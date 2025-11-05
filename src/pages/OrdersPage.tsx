import { useEffect, useState } from "react";
import { getOrders, createOrder, deleteOrder } from "../api/orderApi";
import { getClients } from "../api/clientApi";
import { getProducts } from "../api/productApi";

// Типы
interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Product {
  id: string;
  name: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  bedarfsdatum: string;
}

interface Order {
  id: string;
  client: Client;
  items: OrderItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderResponseDto {
  id: string;
  client: Client;
  items: { id: string; product: Product; quantity: number; bedarfsdatum: string; }[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [newOrder, setNewOrder] = useState<{
    clientId: string;
    items: { productId: string; quantity: number; bedarfsdatum: string; }[];
    status: string;
  }>({
    clientId: "",
    items: [],
    status: "NEW",
  });

  useEffect(() => {
    loadOrders();
    loadClients();
    loadProducts();
  }, []);

  // Загрузка заказов
  const loadOrders = async () => {
  const response = await getOrders(); 
  const data: OrderResponseDto[] = response.data; // <-- используем тип явно

  const mapped: Order[] = data.map((dto) => ({
    id: dto.id,
    client: dto.client,
    items: dto.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      bedarfsdatum: item.bedarfsdatum,
    })),
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }));
  setOrders(mapped);
};

  // Загрузка клиентов и продуктов для формы
  const loadClients = async () => {
    const { data } = await getClients();
    setClients(data as Client[]);
  };

  const loadProducts = async () => {
    const  data  = await getProducts();
    setProducts(data as Product[]);
  };

  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: "", quantity: 1, bedarfsdatum: "2025-11-05" }],
    });
  };

  const handleItemChange = <K extends keyof OrderItem>(
  index: number,
  field: K,
  value: OrderItem[K]
) => {
  const updatedItems = [...newOrder.items];
  updatedItems[index][field] = value;
  setNewOrder({ ...newOrder, items: updatedItems });
};

  const handleAddOrder = async () => {
    await createOrder(newOrder);
    setNewOrder({ clientId: "", items: [], status: "NEW" });
    await loadOrders();
  };

  const handleDeleteOrder = async (id: string) => {
    await deleteOrder(id);
    await loadOrders();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Заказы</h1>

      {/* Форма добавления заказа */}
      <div className="mb-6 p-4 border rounded">
        <select
          className="border p-2 rounded mb-2"
          value={newOrder.clientId}
          onChange={(e) => setNewOrder({ ...newOrder, clientId: e.target.value })}
        >
          <option value="">Выберите клиента</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {newOrder.items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              className="border p-2 rounded"
              value={item.productId}
              onChange={(e) => handleItemChange(index, "productId", e.target.value)}
            >
              <option value="">Выберите продукт</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="border p-2 rounded w-20"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value))}
            />
            <input
            type="date"
            className="border rounded p-2"
            value={item.bedarfsdatum || ""}
            onChange={(e) => handleItemChange(index, "bedarfsdatum", e.target.value)}
            required
          />
          </div>
        ))}

        <button
          onClick={handleAddItem}
          className="bg-gray-500 text-white px-4 py-2 rounded mb-2"
        >
          Добавить позицию
        </button>

        <button
          onClick={handleAddOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Создать заказ
        </button>
      </div>

      {/* Таблица заказов */}
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">[ --Клиент-- ]</th>
            <th className="border p-2">[ --Позиции-- ]</th>
            <th className="border p-2">[ --Статус-- ]</th>
            <th className="border p-2">[ --Действия-- ]</th>
            <th className="border p-2">[ --Дата потребности-- ]</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.client.name}</td>
              <td className="border p-2">
                {order.items.map((item) => (
                  <div key={item.productId}>
                    {products.find((p) => p.id === item.productId)?.name || item.productId} — {item.quantity}
                    {item.bedarfsdatum ? new Date(item.bedarfsdatum).toLocaleDateString() : "-"}
                  </div>
                ))}
              </td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}