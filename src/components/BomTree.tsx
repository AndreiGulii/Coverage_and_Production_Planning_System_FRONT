import { useState } from "react";
import type { BomResponseDto } from "@/api/bomApi";

interface BomTreeProps {
  componentId: string;
  componentType: "product" | "semiproduct" | "material";
  componentName?: string; // Имя текущего компонента
  allBoms: BomResponseDto[];
  level?: number;
}

export default function BomTree({ componentId, componentType, componentName, allBoms, level = 0 }: BomTreeProps) {
  const [expanded, setExpanded] = useState(false);

  // Находим все BOM, где текущий компонент используется как продукт
  const items = allBoms.filter(b => b.productId === componentId && b.productType === componentType);

  const toggle = () => setExpanded(s => !s);

  return (
    <div style={{ marginLeft: level * 20 }}>
      <button
        onClick={toggle}
        className="px-2 py-1 bg-blue-600 text-white rounded mb-2"
      >
        {expanded ? "−" : "+"} {componentName || (items[0]?.productName ?? "Неизвестный компонент")}
      </button>

      {expanded && (
        <div className="mt-2 border-l-2 border-blue-300 pl-4">
          {items.length > 0 ? (
            items.map(b => (
              <div key={b.id} className="mb-2">
                <div className="font-medium">
                  • {b.materialName} ({b.materialMe} {b.materialMeh})
                </div>

                {/* Рекурсивно строим BOM для материала/полуфабриката */}
                <BomTree
                  componentId={b.materialId}
                  componentType={b.materialType}
                  componentName={b.materialName}
                  allBoms={allBoms}
                  level={level + 1}
                />
              </div>
            ))
          ) : (
            <div className="text-gray-500">Нет BOM</div>
          )}
        </div>
      )}
    </div>
  );
}