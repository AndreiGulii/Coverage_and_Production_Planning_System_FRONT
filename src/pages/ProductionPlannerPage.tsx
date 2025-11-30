import React from "react";
import { MachineForm } from "../components/MachineForm";
import { ProductForm } from "../components/ProductPlForm";
import { MachineProductMapping } from "../components/MachineProductMapping";
import ProductionGantt from "../components/ProductionGantt";

export const ProductionPlannerPage: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Планирование производства</h1>

      <MachineForm onSaved={() => {}} />
      <ProductForm onSaved={() => {}} />
      <MachineProductMapping />

      <div style={{ marginTop: 40 }}>
        <h2>График производства</h2>
        <ProductionGantt />
      </div>
    </div>
  );
};
