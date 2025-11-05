// src/pages/BomPage.tsx
import { useEffect, useState } from "react";
import { getBoms, createBom, deleteBom } from "../api/bomApi";
import type { BomRequestDto, BomResponseDto } from "../api/bomApi";
import { getProducts } from "../api/productApi";
import { getMaterials } from "../api/materialApi";
import { getSemiproducts } from "../api/semiproductApi";
import type { MeasurementUnit } from "@/types/MeasurementUnit";
import { measurementUnits } from "../types/MeasurementUnit";

type ProductType = "product" | "semiproduct";
type MaterialType = "material" | "semiproduct";

type Option = {
  id: string;
  name: string;
  type: ProductType | MaterialType;
};

export default function BomsPage() {
  const [boms, setBoms] = useState<BomResponseDto[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [materials, setMaterials] = useState<Option[]>([]);
  const [newBom, setNewBom] = useState<BomRequestDto>({
    productId: "",
    productType: "product",
    productMe: 1,
    productMeh: "",
    materialId: "",
    materialType: "material",
    materialMe: 1,
    materialMeh: "",
    version: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bomsData, productsData, materialsData, semiproductsData] =
        await Promise.all([getBoms(), getProducts(), getMaterials(), getSemiproducts()]);

      setBoms(bomsData);

      // Продукты + полуфабрикаты
      const productOpts: Option[] = [
        ...productsData.map(p => ({ id: p.id || "", name: p.name, type: "product" as const })),
        ...semiproductsData.map(s => ({ id: s.id, name: s.name, type: "semiproduct" as const })),
      ];

      // Материалы + полуфабрикаты
      const materialOpts: Option[] = [
        ...materialsData.map(m => ({ id: m.id || "", name: m.name, type: "material" as const })),
        ...semiproductsData.map(s => ({ id: s.id, name: s.name, type: "semiproduct" as const })),
      ];

      setProducts(productOpts);
      setMaterials(materialOpts);
    } catch (err) {
      console.error("Ошибка загрузки данных BOM:", err);
    }
  };

  const handleAdd = async () => {
  console.log("Отправляем BOM:", newBom); // ← сюда добавляешь

  if (!newBom.productId || !newBom.materialId) {
    alert("⚠️ Выберите продукт и материал");
    return;
  }

  try {
    await createBom(newBom);
    setNewBom({
      productId: "",
      productType: "product",
      productMe: 1,
      productMeh: "",
      materialId: "",
      materialType: "material",
      materialMe: 1,
      materialMeh: "",
      version: "",
    });
    await loadData();
  } catch (err) {
    console.error("Ошибка при добавлении BOM:", err);
  }
};

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (confirm("Удалить этот BOM?")) {
      try {
        await deleteBom(id);
        setBoms(boms.filter(b => b.id !== id));
      } catch (err) {
        console.error("Ошибка при удалении BOM:", err);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">BOM (Рецептуры / Составы)</h1>

      {/* --- Форма добавления --- */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={newBom.productId}
          onChange={(e) => {
            const selected = products.find(p => p.id === e.target.value);
            if (selected) {
              setNewBom({
                ...newBom,
                productId: selected.id,
                productType: selected.type as ProductType,
              });
            }
          }}
        >
          <option value="">Выберите продукт</option>
          {products.map(opt => (
            <option key={opt.type + "-" + opt.id} value={opt.id}>
              {opt.name} ({opt.type})
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Кол-во продукта"
          value={newBom.productMe}
          onChange={(e) => setNewBom({ ...newBom, productMe: Number(e.target.value) })}
        />
        <select
  className="border p-2 rounded"
  value={newBom.productMeh}
  onChange={(e) => setNewBom({ ...newBom, productMeh: e.target.value as MeasurementUnit })}
>
  <option value="">Выберите ед. изм.</option>
  {measurementUnits.map((unit) => (
    <option key={unit} value={unit}>
      {unit}
    </option>
  ))}
</select>

        <select
          className="border p-2 rounded"
          value={newBom.materialId}
          onChange={(e) => {
            const selected = materials.find(m => m.id === e.target.value);
            if (selected) {
              setNewBom({
                ...newBom,
                materialId: selected.id,
                materialType: selected.type as MaterialType,
              });
            }
          }}
        >
          <option value="">Выберите материал</option>
          {materials.map(opt => (
            <option key={opt.type + "-" + opt.id} value={opt.id}>
              {opt.name} ({opt.type})
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Кол-во материала"
          value={newBom.materialMe}
          onChange={(e) => setNewBom({ ...newBom, materialMe: Number(e.target.value) })}
        />
        <select
          className="border p-2 rounded"
          value={newBom.materialMeh}
          onChange={(e) => setNewBom({ ...newBom, materialMeh: e.target.value as MeasurementUnit })}
        >
        {measurementUnits.map((unit) => (
          <option key={unit} value={unit}>
          {unit}
          </option>
        ))}
</select>

        <input
          className="border p-2 rounded"
          placeholder="Версия"
          value={newBom.version}
          onChange={(e) => setNewBom({ ...newBom, version: e.target.value })}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded col-span-4"
          onClick={handleAdd}
        >
          [ + Добавить Bom ]
        </button>
      </div>

      {/* --- Таблица BOM --- */}
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">[ Продукт ]</th>
            <th className="border p-2">[ Кол-во / ед. ]</th>
            <th className="border p-2">[ Материал ]</th>
            <th className="border p-2">[ Кол-во / ед. ]</th>
            <th className="border p-2">[ Версия ]</th>
            <th className="border p-2">[ Действия ]</th>
          </tr>
        </thead>
        <tbody>
          {boms.map((b) => (
            <tr key={b.id}>
              <td className="border p-2">{"[ "+b.productName +" ]" || "-"}</td>
              <td className="border p-2">{"[ " +b.productMe } {b.productMeh+ "   ]" || "-"}</td>
              <td className="border p-2">{"[ " + b.materialName + " ]" || "-"}</td>
              <td className="border p-2">{"[ " + b.materialMe} {b.materialMeh + " ]" || "-"}</td>
              <td className="border p-2">{"[ " + b.version + " ]" || "-"}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(b.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  [ X Удалить строку BOM ]
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}