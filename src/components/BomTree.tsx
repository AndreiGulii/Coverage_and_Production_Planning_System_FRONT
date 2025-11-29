import { useState } from "react";
import type { BomResponseDto } from "@/api/bomApi";

interface BomTreeProps {
  productName: string;
  allBoms: BomResponseDto[];
  level?: number;
}

export default function BomTree({ productName, allBoms, level = 0 }: BomTreeProps) {
  const [expanded, setExpanded] = useState(false);

  const items = allBoms.filter(b => b.productName === productName);

  if (items.length === 0) {
    return (
      <div style={{ marginLeft: level * 20 }} className="text-gray-500">
        Нет BOM
      </div>
    );
  }

  const toggle = () => setExpanded((s) => !s);

  return (
    <div style={{ marginLeft: level * 20 }}>
      <button
        onClick={toggle}
        className="px-2 py-1 bg-blue-600 text-white rounded mb-2"
      >
        {expanded ? "−" : "+"} {productName}
      </button>

      {expanded && (
        <div className="mt-2 border-l-2 border-blue-300 pl-4">
          {items.map((b) => (
            <div key={b.id} className="mb-2">
              <div className="font-medium">
                • {b.materialName}  
                <span className="text-gray-600">
                  {" "}({b.materialMe} {b.materialMeh})
                </span>
              </div>

              {/* Если материал — полуфабрикат → у него может быть BOM */}
              <BomTree
                productName={b.materialName}
                allBoms={allBoms}
                level={level + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}