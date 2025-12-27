// src/pages/ProductionPlannerPage.tsx
import React, { useEffect, useState } from "react";
import MachineAPI from "../api/MachineAPI";
import type { Machine } from "../api/MachineAPI";
import PressformAPI from "../api/PressformAPI";
import type { Pressform } from "../api/PressformAPI";
import PressformProductBOM from "../components/PressformProductBOM";
import type { ProductDto } from "../api/productApi";
import type { BomResponseDto } from "../api/bomApi";

interface AssignedPressform {
  pressform: Pressform;
  productId?: string;
  boms?: BomResponseDto[];
}

const ProductionPlannerPage: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [pressforms, setPressforms] = useState<Pressform[]>([]);
  const [assignments, setAssignments] = useState<Record<string, AssignedPressform[]>>({});

  useEffect(() => {
    MachineAPI.getAll().then(res => setMachines(res.data));
    PressformAPI.getAll().then(res => setPressforms(res.data));
  }, []);

  const onDragStart = (e: React.DragEvent, pressform: Pressform) => {
    e.dataTransfer.setData("pressform", JSON.stringify(pressform));
  };

  const onDrop = (e: React.DragEvent, machineId: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("pressform");
    if (!data) return;

    const pressform: Pressform = JSON.parse(data);

    // Добавляем прессформу только к текущей машине
    setAssignments(prev => ({
      ...prev,
      [machineId]: [...(prev[machineId] || []), { pressform }]
    }));
  };

  const onProductSelected = (
    machineId: string,
    pressformId: string,
    product: ProductDto | null,
    boms: BomResponseDto[]
  ) => {
    setAssignments(prev => ({
      ...prev,
      [machineId]: prev[machineId]?.map(a =>
        a.pressform.id === pressformId ? { ...a, productId: product?.id, boms } : a
      ) || []
    }));
  };

  return (
    <div style={{ display: "flex", height: "100%", padding: 20, gap: 20 }}>
      {/* LEFT — MACHINES */}
      <div style={{ flex: 3 }}>
        <h2>Машины</h2>

        {machines.map(machine => (
          <div
            key={machine.id}
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e, machine.id)}
            style={{
              border: "2px dashed #aaa",
              borderRadius: 6,
              padding: 10,
              marginBottom: 10,
              minHeight: 80
            }}
          >
            <strong>{machine.name}</strong>

            <div style={{ marginTop: 8 }}>
              {(assignments[machine.id] || []).map(a => (
                <div
                  key={a.pressform.id}
                  style={{
                    marginBottom: 6,
                    padding: 4,
                    borderRadius: 4,
                    background: "#4caf50",
                    color: "#fff"
                  }}
                >
                  <strong>{a.pressform.name}</strong>
                  <div style={{ marginTop: 4 }}>
                    <PressformProductBOM
                      pressformId={a.pressform.id!}
                      onProductSelected={(product, boms) =>
                        onProductSelected(machine.id, a.pressform.id!, product, boms)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT — PRESSFORMS */}
      <div style={{ flex: 1 }}>
        <h2>Пресс-формы</h2>
        {pressforms.map(pf => (
          <div
            key={pf.id}
            draggable
            onDragStart={e => onDragStart(e, pf)}
            style={{
              border: "1px solid #ccc",
              padding: 8,
              borderRadius: 4,
              marginBottom: 6,
              cursor: "grab"
            }}
          >
            {pf.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionPlannerPage;