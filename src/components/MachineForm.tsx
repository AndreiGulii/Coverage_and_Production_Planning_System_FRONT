import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import MachineAPI from "../api/MachineAPI";
import type { Machine} from "../api/MachineAPI";

interface MachineFormProps {
  onSaved: () => void;
}

interface SelectableItem {
  id: string;
  name: string;
  description?: string;
  type: "product" | "semiproduct";
}

// Типы для данных с API
interface ProductAPIResponse {
  id: string;
  name: string;
  description?: string;
}

export const MachineForm: React.FC<MachineFormProps> = ({ onSaved }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [workplaces, setWorkplaces] = useState<number | "">("");

  const [machines, setMachines] = useState<Machine[]>([]);
  const [products, setProducts] = useState<SelectableItem[]>([]);
  const [semiproducts, setSemiproducts] = useState<SelectableItem[]>([]);

  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<"product" | "semiproduct">("product");

  const [minBatch, setMinBatch] = useState<number>(1);
  const [productionTimePerUnit, setProductionTimePerUnit] = useState<number>(1);
  const [setupTime, setSetupTime] = useState<number | "">("");

  // -----------------------------
  // Загрузка продуктов и машин
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Продукты и полуфабрикаты
        const productsRes = await fetch("/api/products").then(r => r.json()) as ProductAPIResponse[];
        const semiproductsRes = await fetch("/api/semiproducts").then(r => r.json()) as ProductAPIResponse[];

        setProducts(
          productsRes.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            type: "product" as const,
          }))
        );

        setSemiproducts(
          semiproductsRes.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            type: "semiproduct" as const,
          }))
        );

        // 2. Машины с capabilities
        const machinesRes = await MachineAPI.getAll();
        const machinesWithItems = machinesRes.data.map(m => ({
          ...m,
          items: m.capabilities || [], // берем продукты из capabilities
        }));

        setMachines(machinesWithItems);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);

  // -----------------------------
  // Сохранение новой машины
  // -----------------------------
  const handleSaveMachine = async () => {
    try {
      await MachineAPI.create({ name, description, workplace: Number(workplaces) || 1 });
      setName("");
      setDescription("");
      setWorkplaces("");
      onSaved();

      const machinesRes = await MachineAPI.getAll();
      const machinesWithItems = machinesRes.data.map(m => ({
        ...m,
        items: m.capabilities || [],
      }));
      setMachines(machinesWithItems);
    } catch (error) {
      console.error("Ошибка при создании машины:", error);
    }
  };

  // -----------------------------
  // Добавление продукта/полуфабриката к машине
  // -----------------------------
  const handleAddItemToMachine = async () => {
    if (!selectedMachine || !selectedItemId) return;

    const setup = !selectedMachine.items || selectedMachine.items.length === 0 ? Number(setupTime) || 0 : 0;

    try {
      await MachineAPI.addItemToMachine(
        selectedMachine.id,
        selectedItemId,
        selectedType,
        minBatch,
        productionTimePerUnit,
        setup
      );

      setSelectedItemId("");
      setMinBatch(1);
      setProductionTimePerUnit(1);
      setSetupTime("");

      const machinesRes = await MachineAPI.getAll();
      const machinesWithItems = machinesRes.data.map(m => ({
        ...m,
        items: m.capabilities || [],
      }));
      setMachines(machinesWithItems);

      setSelectedMachine(machinesWithItems.find(m => m.id === selectedMachine.id) || null);
    } catch (error) {
      console.error("Ошибка при добавлении элемента:", error);
    }
  };

  const itemsToSelect = selectedType === "product" ? products : semiproducts;

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Добавить машину</h3>
      <TextField label="Название" value={name} onChange={e => setName(e.target.value)} style={{ marginRight: 10 }} />
      <TextField label="Описание" value={description} onChange={e => setDescription(e.target.value)} style={{ marginRight: 10 }} />
      <TextField
        label="Рабочие места"
        type="number"
        value={workplaces}
        onChange={e => setWorkplaces(Number(e.target.value))}
        style={{ marginRight: 10 }}
      />
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
                {item.object?.name || "—"} ({item.itemType}) — minBatch: {item.minBatch}, productionTime: {item.productionTimePerUnit}, setup: {item.setupTime}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 style={{ marginTop: 40 }}>Список всех машин и их продуктов</h3>
      {machines.map(machine => (
        <div key={machine.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <strong>{machine.name}</strong> (Рабочие места: {machine.workplace || 0})<br />
          <em>{machine.description}</em>

          {machine.items && machine.items.length > 0 ? (
            <ul>
              {machine.items.map(item => (
                <li key={item.id}>
                  {item.object?.name || "—"} ({item.itemType}) — minBatch: {item.minBatch}, productionTime: {item.productionTimePerUnit}, setup: {item.setupTime}
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