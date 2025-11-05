import React, { useState } from "react";
import type { OrderRequestDto } from "../api/orderApi";
import { createOrder } from "../api/orderApi";
import { Button } from "@/components/ui/button";

type Client = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
};

type Props = {
  clients: Client[];
  products: Product[];
  onSaved?: () => void;
};

type OrderItemForm = {
  productId: string;
  quantity: number;
  bedarfsdatum: string;
};



export default function OrderForm({ clients, products, onSaved }: Props) {
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("NEW");
  const [items, setItems] = useState<OrderItemForm[]>([
  { productId: "", quantity: 1 , bedarfsdatum: "2025-11-05"},
]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1, bedarfsdatum: "2025-11-05" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  
  const handleChangeItem = (index: number, field: keyof OrderItemForm, value: string | number) => {
  const updated = [...items];
  updated[index] = { ...updated[index], [field]: value } as OrderItemForm;
  setItems(updated);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: OrderRequestDto = { clientId, status, items };

    try {
      await createOrder(payload);
      onSaved?.();
      alert("✅ Заказ успешно создан");
      setClientId("");
      setItems([{ productId: "", quantity: 1, bedarfsdatum: "2025-11-05" }]);
    } catch (err) {
      console.error(err);
      alert("❌ Ошибка при создании заказа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Создать заказ</h2>

      {/* Клиент */}
      <label className="block mb-2 font-medium">Клиент</label>
      <select
        className="border rounded p-2 w-full mb-4"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        required
      >
        <option value="">-- Выберите клиента --</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Статус */}
      <label className="block mb-2 font-medium">--Статус--</label>
      <select
        className="border rounded p-2 w-full mb-4"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="NEW">Новый</option>
        <option value="IN_PROGRESS">В процессе</option>
        <option value="DONE">Готов</option>
      </select>

      {/* Продукты */}
      <h3 className="font-medium mb-2">Позиции заказа</h3>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <select
            className="border rounded p-2 flex-1"
            value={item.productId}
            onChange={(e) => handleChangeItem(i, "productId", e.target.value)}
            required
          >
            <option value="">-- Продукт --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="border rounded p-2 w-24 text-center"
            value={item.quantity}
            min={1}
            onChange={(e) => handleChangeItem(i, "quantity", Number(e.target.value))}
            required
          />

          <input
            type="date"
            className="border rounded p-2"
            value={item.bedarfsdatum || ""}
            onChange={(e) => handleChangeItem(i, "bedarfsdatum", e.target.value)}
            required
          />

          <Button
            type="button"
            variant="destructive"
            onClick={() => handleRemoveItem(i)}
            disabled={items.length === 1}
          >
            ✖
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" className="mb-4" onClick={handleAddItem}>
        + Добавить позицию
      </Button>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Сохраняем..." : "Сохранить заказ"}
      </Button>
    </form>
  );
}