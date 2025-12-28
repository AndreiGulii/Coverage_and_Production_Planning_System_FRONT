import { useEffect, useState } from "react";
import {
  getStocks,
  createStock,
  updateStock,
  deleteStock,
  type StockDto,
  type StockRequestDto,
} from "../api/stockApi";
import axios from "axios";

type Material = { id: string; name: string };
type SemiProduct = { id: string; name: string };
type Product = { id: string; name: string };

export default function StockPage() {
  const [stocks, setStocks] = useState<StockDto[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [semiproducts, setSemiproducts] = useState<SemiProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [newStock, setNewStock] = useState<{
    quantity: number;
    materialId?: string;
    semiproductId?: string;
    productId?: string;
  }>({ quantity: 0 });

  // ----------------------
  // Загрузка данных
  // ----------------------
  const loadStocks = async () => {
    try {
      const data = await getStocks();
      setStocks(data);
    } catch (e) {
      console.error("Ошибка загрузки stock:", e);
    }
  };

  const loadComponents = async () => {
    try {
      const [materialsRes, semiRes, productsRes] = await Promise.all([
        axios.get<Material[]>("/api/materials"),
        axios.get<SemiProduct[]>("/api/semiproducts"),
        axios.get<Product[]>("/api/products"),
      ]);
      setMaterials(materialsRes.data);
      setSemiproducts(semiRes.data);
      setProducts(productsRes.data);
    } catch (e) {
      console.error("Ошибка загрузки компонентов:", e);
    }
  };

  useEffect(() => {
    loadStocks();
    loadComponents();
  }, []);

  // ----------------------
  // Формирование payload
  // ----------------------
  const buildStockPayload = (): StockRequestDto => {
    if (newStock.materialId) {
      return {
        quantity: newStock.quantity,
        componentType: "MATERIAL",
        material: { id: newStock.materialId },
      };
    }
    if (newStock.semiproductId) {
      return {
        quantity: newStock.quantity,
        componentType: "SEMIPRODUCT",
        semiProduct: { id: newStock.semiproductId },
      };
    }
    if (newStock.productId) {
      return {
        quantity: newStock.quantity,
        componentType: "PRODUCT",
        product: { id: newStock.productId },
      };
    }
    throw new Error("Выберите компонент");
  };

  // ----------------------
  // CRUD операции
  // ----------------------
  const handleAddStock = async () => {
    try {
      const payload = buildStockPayload();
      await createStock(payload);
      setNewStock({ quantity: 0 });
      await loadStocks();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleUpdateStock = async (id: string, stock: StockDto) => {
    try {
      let payload: StockRequestDto;
      if (stock.materialId) {
        payload = { quantity: stock.quantity, componentType: "MATERIAL", material: { id: stock.materialId } };
      } else if (stock.semiproductId) {
        payload = { quantity: stock.quantity, componentType: "SEMIPRODUCT", semiProduct: { id: stock.semiproductId } };
      } else {
        payload = { quantity: stock.quantity, componentType: "PRODUCT", product: { id: stock.productId! } };
      }
      await updateStock(id, payload);
      await loadStocks();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleDeleteStock = async (id: string) => {
    try {
      await deleteStock(id);
      await loadStocks();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  // ----------------------
  // Селекторы компонентов
  // ----------------------
  const selectMaterial = (id: string) =>
    setNewStock({ quantity: newStock.quantity, materialId: id, semiproductId: undefined, productId: undefined });
  const selectSemiProduct = (id: string) =>
    setNewStock({ quantity: newStock.quantity, materialId: undefined, semiproductId: id, productId: undefined });
  const selectProduct = (id: string) =>
    setNewStock({ quantity: newStock.quantity, materialId: undefined, semiproductId: undefined, productId: id });

  // ----------------------
  // Рендер
  // ----------------------
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Склад</h1>

      {/* Форма добавления */}
      <div className="flex gap-2 mb-4">
        <select value={newStock.materialId || ""} onChange={(e) => selectMaterial(e.target.value)} className="border p-2 rounded">
          <option value="">Материал</option>
          {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <select value={newStock.semiproductId || ""} onChange={(e) => selectSemiProduct(e.target.value)} className="border p-2 rounded">
          <option value="">Полуфабрикат</option>
          {semiproducts.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select value={newStock.productId || ""} onChange={(e) => selectProduct(e.target.value)} className="border p-2 rounded">
          <option value="">Продукт</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <input
          type="number"
          value={newStock.quantity}
          onChange={(e) => setNewStock({ ...newStock, quantity: Number(e.target.value) })}
          className="border p-2 rounded w-24"
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddStock}>Добавить</button>
      </div>

      {/* Таблица */}
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Material</th>
            <th className="border p-2">SemiProduct</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Last Updated</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td className="border p-2">
                <select
                  value={stock.materialId || ""}
                  onChange={(e) => handleUpdateStock(stock.id!, { ...stock, materialId: e.target.value, semiproductId: undefined, productId: undefined })}
                  className="border p-1 rounded w-36"
                >
                  <option value="">Материал</option>
                  {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </td>
              <td className="border p-2">
                <select
                  value={stock.semiproductId || ""}
                  onChange={(e) => handleUpdateStock(stock.id!, { ...stock, materialId: undefined, semiproductId: e.target.value, productId: undefined })}
                  className="border p-1 rounded w-36"
                >
                  <option value="">Полуфабрикат</option>
                  {semiproducts.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </td>
              <td className="border p-2">
                <select
                  value={stock.productId || ""}
                  onChange={(e) => handleUpdateStock(stock.id!, { ...stock, materialId: undefined, semiproductId: undefined, productId: e.target.value })}
                  className="border p-1 rounded w-36"
                >
                  <option value="">Продукт</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={stock.quantity}
                  onChange={(e) => handleUpdateStock(stock.id!, { ...stock, quantity: Number(e.target.value) })}
                  className="border p-1 w-20 rounded"
                />
              </td>
              <td className="border p-2">{stock.lastUpdated ? new Date(stock.lastUpdated).toLocaleString() : "-"}</td>
              <td className="border p-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteStock(stock.id!)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}