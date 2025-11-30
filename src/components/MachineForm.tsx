import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import MachineAPI from "../api/MachineAPI";
import type { Machine, Item } from "../api/MachineAPI";
import * as ProductAPI from "../api/productApi";
import * as SemiproductAPI from "../api/semiproductApi";

interface MachineFormProps {
  onSaved: () => void;
}

export const MachineForm: React.FC<MachineFormProps> = ({ onSaved }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [workplaces, setWorkplaces] = useState(1);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [semiproducts, setSemiproducts] = useState<Item[]>([]);

  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"product" | "semiproduct">("product");

  const [minBatch, setMinBatch] = useState<number>(1);
  const [productionTimePerUnit, setProductionTimePerUnit] = useState<number>(1);
  const [setupTime, setSetupTime] = useState<number | "">("");

  useEffect(() => {
    fetchProducts();
    fetchSemiproducts();
    fetchMachinesWithItems();
  }, []);

  const fetchProducts = async () => {
    const data = await ProductAPI.getProducts();
    setProducts(
      data.map(p => ({
        id: p.id?.toString(),
        name: p.name,
        type: "product" as const,
        description: p.description
      }))
    );
  };

  const fetchSemiproducts = async () => {
    const data = await SemiproductAPI.getSemiproducts();
    setSemiproducts(
      data.map(p => ({
        id: p.id?.toString(),
        name: p.name,
        type: "semiproduct" as const,
        description: p.description
      }))
    );
  };

  // Загружаем машины вместе с их продуктами из таблицы machine_product
  const fetchMachinesWithItems = async () => {
    const res = await MachineAPI.getAll();
    const machinesWithItems = await Promise.all(
      res.data.map(async machine => {
        const itemsRes = await MachineAPI.getMachineProducts(machine.id!); // <--- используем исправленный метод
        return { ...machine, items: itemsRes.data };
      })
    );
    setMachines(machinesWithItems);
  };

  const handleSaveMachine = async () => {
    await MachineAPI.create({ name, description, workplaces });
    setName(""); setDescription(""); setWorkplaces(1);
    await fetchMachinesWithItems();
    onSaved();
  };

  const handleAddItemToMachine = async () => {
    if (!selectedMachine || !selectedItemId) return;

    const setup = !selectedMachine.items || selectedMachine.items.length === 0 ? setupTime || 0 : 0;

    await MachineAPI.addItemToMachine(
      selectedMachine.id!,
      selectedItemId,
      selectedType,
      minBatch,
      productionTimePerUnit,
      setup
    );

    // сброс значений
    setSelectedItemId("");
    setMinBatch(1);
    setProductionTimePerUnit(1);
    setSetupTime("");

    await fetchMachinesWithItems();
  };

  const handleDeleteItem = async (itemId: string) => {
    await MachineAPI.deleteItem(itemId);
    await fetchMachinesWithItems();
  };

  const itemsToSelect = selectedType === "product" ? products : semiproducts;

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Добавить машину</h3>
      <TextField label="Название" value={name} onChange={e => setName(e.target.value)} style={{ marginRight: 10 }} />
      <TextField label="Описание" value={description} onChange={e => setDescription(e.target.value)} style={{ marginRight: 10 }} />
      <TextField label="Рабочие места" type="number" value={workplaces} onChange={e => setWorkplaces(Number(e.target.value))} style={{ marginRight: 10 }} />
      <Button onClick={handleSaveMachine} variant="contained" color="primary">Сохранить</Button>

      <h4 style={{ marginTop: 20 }}>Назначить продукт/полуфабрикат машине</h4>

      <FormControl style={{ minWidth: 200, marginRight: 10 }}>
        <InputLabel>Выберите машину</InputLabel>
        <Select
          value={selectedMachine?.id || ""}
          onChange={e => {
            const machine = machines.find(m => m.id === e.target.value) || null;
            setSelectedMachine(machine);
          }}
        >
          {machines.map(m => (
            <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ minWidth: 150, marginRight: 10 }}>
        <InputLabel>Тип</InputLabel>
        <Select value={selectedType} onChange={e => setSelectedType(e.target.value as "product" | "semiproduct")}>
          <MenuItem value="product">Продукт</MenuItem>
          <MenuItem value="semiproduct">Полуфабрикат</MenuItem>
        </Select>
      </FormControl>

      {selectedMachine && (
        <div style={{ marginTop: 10 }}>
          <FormControl style={{ minWidth: 200, marginRight: 10 }}>
            <InputLabel>Выберите элемент</InputLabel>
            <Select value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)}>
              <MenuItem value="">-- Выберите --</MenuItem>
              {itemsToSelect.map(item => (
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Минимальная партия"
            type="number"
            value={minBatch}
            onChange={e => setMinBatch(Number(e.target.value))}
            style={{ width: 150, marginRight: 10 }}
          />
          <TextField
            label="Время на единицу"
            type="number"
            value={productionTimePerUnit}
            onChange={e => setProductionTimePerUnit(Number(e.target.value))}
            style={{ width: 150, marginRight: 10 }}
          />
          {(!selectedMachine.items || selectedMachine.items.length === 0) && (
            <TextField
              label="Время переналадки (setup)"
              type="number"
              value={setupTime}
              onChange={e => setSetupTime(e.target.value === "" ? "" : Number(e.target.value))}
              style={{ width: 150, marginRight: 10 }}
            />
          )}

          <Button variant="contained" color="secondary" onClick={handleAddItemToMachine}>Добавить</Button>

          <ul style={{ marginTop: 10 }}>
            {selectedMachine.items?.map(item => (
              <li key={item.id}>
                {item.name} ({item.type}) — minBatch: {item.minBatch}, productionTime: {item.productionTimePerUnit}, setup: {item.setupTime}
                <Button style={{ marginLeft: 10 }} variant="outlined" color="error" size="small" onClick={() => handleDeleteItem(item.id!)}>Удалить</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 style={{ marginTop: 40 }}>Список всех машин и их продуктов</h3>
      {machines.map(machine => (
        <div key={machine.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <strong>{machine.name}</strong> (Рабочие места: {machine.workplaces})<br />
          <em>{machine.description}</em>
          {machine.items && machine.items.length > 0 ? (
            <ul>
              {machine.items.map(item => (
                <li key={item.id}>
                  {item.name} ({item.type}) — minBatch: {item.minBatch}, productionTime: {item.productionTimePerUnit}, setup: {item.setupTime}
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет назначенных продуктов</p>
          )}
        </div>
      ))}
    </div>
  );
};