import React, { useEffect, useState } from "react";
import { Select, MenuItem, Button, TextField } from "@mui/material";
import MachineAPI from "../api/MachineAPI";
import type { Machine } from "../api/MachineAPI";

import ProductplAPI from "../api/ProductplAPI"
import type { Product } from "../api/ProductplAPI"
import MachineProductAPI from "../api/MachineProductAPI";

export const MachineProductMapping: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<number | "">("");
  const [selectedProduct, setSelectedProduct] = useState<number | "">("");
  const [setupTime, setSetupTime] = useState<number>(5);

  useEffect(() => {
    MachineAPI.getAll().then(res => setMachines(res.data));
    ProductplAPI.getAll().then(res => setProducts(res.data));
  }, []);

  const handleSave = async () => {
    if (!selectedMachine || !selectedProduct) return;
    await MachineProductAPI.assignProduct(selectedMachine, { productId: selectedProduct, setupTime });
    setSelectedProduct("");
    setSetupTime(5);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Привязка продукта к машине</h3>
      <Select value={selectedMachine} onChange={e => setSelectedMachine(Number(e.target.value))}>
        {machines.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
      </Select>
      <Select value={selectedProduct} onChange={e => setSelectedProduct(Number(e.target.value))} style={{ marginLeft: 10 }}>
        {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
      </Select>
      <TextField type="number" value={setupTime} onChange={e => setSetupTime(Number(e.target.value))} style={{ marginLeft: 10 }} label="Время переналадки (мин)" />
      <Button onClick={handleSave} variant="contained" color="primary" style={{ marginLeft: 10 }}>Сохранить</Button>
    </div>
  );
};