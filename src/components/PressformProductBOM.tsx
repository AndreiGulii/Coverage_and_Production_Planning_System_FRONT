// src/components/PressformProductBOM.tsx
import React, { useEffect, useState, useMemo } from "react";
import PressformAPI from "../api/PressformAPI";
import type { Pressform } from "../api/PressformAPI";
import { getBoms } from "../api/bomApi";
import type { BomResponseDto } from "../api/bomApi";
import type { ProductDto } from "../api/productApi";
import { Select, MenuItem, Typography, Box } from "@mui/material";

interface PressformProductBOMProps {
  pressformId: string;
  onProductSelected: (product: ProductDto | null, boms: BomResponseDto[]) => void;
}

const PressformProductBOM: React.FC<PressformProductBOMProps> = ({
  pressformId,
  onProductSelected,
}) => {
  const [pressform, setPressform] = useState<Pressform | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [boms, setBoms] = useState<BomResponseDto[]>([]);

  // ==================================================
  // Загрузка пресс-формы
  // ==================================================
  useEffect(() => {
    let cancelled = false;

    const fetchPressform = async () => {
      try {
        const res = await PressformAPI.get(pressformId);
        if (!cancelled) {
          setPressform(res.data);
        }
      } catch (e) {
        console.error("Failed to fetch pressform", e);
      }
    };

    fetchPressform();
    return () => {
      cancelled = true;
    };
  }, [pressformId]);

  // ==================================================
  // Доступные продукты / полуфабрикаты
  // ==================================================
  const availableProducts = useMemo(() => {
    if (!pressform) return [];
    return [
      ...(pressform.products ?? []),
      ...(pressform.semiproducts ?? []),
    ];
  }, [pressform]);

  // ==================================================
  // Выбранный продукт
  // ==================================================
  const selectedProduct: ProductDto | null = useMemo(() => {
    if (!selectedProductId) return null;

    const p = availableProducts.find(p => p.id === selectedProductId);
    if (!p) return null;

    return {
      id: p.id,
      name: p.name || "Без имени",
    };
  }, [selectedProductId, availableProducts]);

  // ==================================================
  // 1️⃣ Загрузка BOM (ТОЛЬКО API, без родителя)
  // ==================================================
  useEffect(() => {
    let cancelled = false;

    if (!selectedProductId) {
      setBoms([]);
      return;
    }

    const fetchBoms = async () => {
      try {
        const allBoms = await getBoms();
        const filtered = allBoms.filter(
          b => b.productId === selectedProductId
        );

        if (!cancelled) {
          setBoms(filtered);
        }
      } catch (e) {
        console.error("Failed to fetch BOMs", e);
        if (!cancelled) {
          setBoms([]);
        }
      }
    };

    fetchBoms();
    return () => {
      cancelled = true;
    };
  }, [selectedProductId]);

  // ==================================================
  // 2️⃣ Уведомление родителя (БЕЗ API)
  // ==================================================
  useEffect(() => {
    onProductSelected(selectedProduct, boms);
  }, [selectedProduct, boms, onProductSelected]);

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle1">
        Пресс-форма: {pressform?.name || "Загрузка..."}
      </Typography>

      <Select
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        fullWidth
      >
        <MenuItem value="">
          <em>Выберите продукт / полуфабрикат</em>
        </MenuItem>

        {availableProducts.map(p => (
          <MenuItem key={p.id} value={p.id}>
            {p.name || "Без имени"}
          </MenuItem>
        ))}
      </Select>

      {boms.length > 0 && (
        <Box sx={{ marginTop: 1 }}>
          <Typography variant="subtitle2">
            BOM для продукта:
          </Typography>
          <ul>
            {boms.map(b => (
              <li key={b.id}>
                {b.materialName} — {b.materialMe} {b.materialMeh}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default PressformProductBOM;