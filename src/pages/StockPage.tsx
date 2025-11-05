import { useEffect, useState } from "react";
import { getStocks, createStock, updateStock, deleteStock, ComponentType } from "../api/stockApi";
import type {  StockDto } from "../api/stockApi";



export default function StockPage() {
  const [stocks, setStocks] = useState<StockDto[]>([]);
  const [newStock, setNewStock] = useState<StockDto>({
    componentType: ComponentType.MATERIAL,
    componentId: "",
    quantity: 0,
  });

  const loadStocks = async () => {
    const data = await getStocks();
    setStocks(data);
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const handleAddStock = async () => {
    if (!newStock.componentId) return alert("Укажите ID компонента");
    await createStock(newStock);
    setNewStock({ componentType: ComponentType.MATERIAL, componentId: "", quantity: 0 });
    await loadStocks();
  };

  const handleUpdateStock = async (id: string, updated: StockDto) => {
    await updateStock(id, updated);
    await loadStocks();
  };

  const handleDeleteStock = async (id: string) => {
    await deleteStock(id);
    await loadStocks();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Склад</h1>

      {/* Форма добавления */}
      <div className="flex gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={newStock.componentType}
          onChange={(e) =>
            setNewStock({ ...newStock, componentType: e.target.value as ComponentType })
          }
        >
          {Object.values(ComponentType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          placeholder="Component ID"
          value={newStock.componentId}
          onChange={(e) => setNewStock({ ...newStock, componentId: e.target.value })}
        />

        <input
          type="number"
          className="border p-2 rounded w-24"
          value={newStock.quantity}
          onChange={(e) => setNewStock({ ...newStock, quantity: Number(e.target.value) })}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddStock}
        >
          Добавить
        </button>
      </div>

      {/* Таблица склада */}
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Component Type</th>
            <th className="border p-2">Component ID</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Last Updated</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              {/* Редактируемый тип компонента */}
              <td className="border p-2">
                <select
                  value={stock.componentType}
                  onChange={(e) =>
                    handleUpdateStock(stock.id!, { ...stock, componentType: e.target.value as ComponentType })
                  }
                  className="border p-1 rounded"
                >
                  {Object.values(ComponentType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </td>

              {/* Редактируемый ID */}
              <td className="border p-2">
                <input
                  type="text"
                  value={stock.componentId}
                  className="border p-1 rounded w-36"
                  onChange={(e) =>
                    handleUpdateStock(stock.id!, { ...stock, componentId: e.target.value })
                  }
                />
              </td>

              {/* Редактируемое количество */}
              <td className="border p-2">
                <input
                  type="number"
                  value={stock.quantity}
                  className="border p-1 w-20 rounded"
                  onChange={(e) =>
                    handleUpdateStock(stock.id!, { ...stock, quantity: Number(e.target.value) })
                  }
                />
              </td>

              {/* Дата обновления */}
              <td className="border p-2">
                {stock.lastUpdated ? new Date(stock.lastUpdated).toLocaleString() : "-"}
              </td>

              {/* Действия */}
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteStock(stock.id!)}
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