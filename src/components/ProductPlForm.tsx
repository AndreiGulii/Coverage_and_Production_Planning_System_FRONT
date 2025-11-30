import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import ProductplAPI from "../api/ProductplAPI";
import type { Product } from "../api/ProductplAPI";

interface ProductFormProps {
  onSaved: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSaved }) => {
  const [name, setName] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [minBatch, setMinBatch] = useState<number>(1);
  const [productionTime, setProductionTime] = useState<number>(10);
  const [color, setColor] = useState<string>("#4caf50");
  const [type, setType] = useState<"product" | "semiproduct">("product");

  const handleSave = async () => {
    await ProductplAPI.create({
      name,
      unit,
      minBatch,
      productionTime,
      color,
      type
    } as Product);

    onSaved();

    setName("");
    setUnit("");
    setMinBatch(1);
    setProductionTime(10);
    setColor("#4caf50");
    setType("product");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Добавить продукт / полупродукт</h3>

      <TextField label="Название" value={name} onChange={e => setName(e.target.value)} style={{ marginRight: 10 }} />
      <TextField label="Ед. измерения" value={unit} onChange={e => setUnit(e.target.value)} style={{ marginRight: 10 }} />
      <TextField label="Мин. партия (ед.)" type="number" value={minBatch} onChange={e => setMinBatch(Number(e.target.value))} style={{ marginRight: 10 }} />
      <TextField label="Время на единицу (мин)" type="number" value={productionTime} onChange={e => setProductionTime(Number(e.target.value))} style={{ marginRight: 10 }} />
      <TextField label="Тип" select value={type} onChange={e => setType(e.target.value as "product" | "semiproduct")} style={{ marginRight: 10, width: 150 }}>
        <MenuItem value="product">Product</MenuItem>
        <MenuItem value="semiproduct">Semiproduct</MenuItem>
      </TextField>
      <TextField label="Цвет" type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 80, marginRight: 10 }} />

      <Button onClick={handleSave} variant="contained" color="primary">Сохранить</Button>
    </div>
  );
};