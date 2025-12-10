// src/pages/ProductionConfig.tsx
import React, { useState } from "react";
import { MachineForm } from "../components/MachineForm";
import { ShiftForm } from "../components/ShiftForm";
import ProductionGantt from "../components/ProductionGantt";
import { PressformForm } from "@/components/PressformForm";

const ProductionConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"machines" | "pressforms" | "shifts" |"gantt">("machines");

  return (
    <div style={{ padding: 20 }}>
      <h1>Планирование и настройки производства</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button onClick={() => setActiveTab("machines")}>Машины</button>
        <button onClick={() => setActiveTab("pressforms")}>Пресс-формы</button>
        <button onClick={() => setActiveTab("shifts")}>Смены</button>
        <button onClick={() => setActiveTab("gantt")}>График производства</button>
      </div>

      <div style={{ border: "1px solid #ccc", padding: 20, minHeight: 400 }}>
        {activeTab === "machines" && <MachineForm onSaved={() => {}} />}
        {activeTab === "pressforms" && <PressformForm onChanged={() =>{}}/>}  
        {activeTab === "shifts" && <ShiftForm onChanged={() => {}} />}
        {activeTab === "gantt" && <ProductionGantt />}
      </div>
    </div>
  );
};

export default ProductionConfig;