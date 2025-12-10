import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct
} from "../api/productApi";

interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: string;
  code: string;
  color: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    unit: "",
    category: "",
    code: "",
    color: "#72ea72"
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    const mapped: Product[] = data.map(p => ({
      id: p.id || "",
      name: p.name,
      description: p.description || "",
      unit: p.unit || "",
      category: p.category || "",
      code: p.code || "",
      color: p.color || "#72ea72"
    }));
    setProducts(mapped);
  };

  const handleAdd = async () => {
    await createProduct(newProduct);
    setNewProduct({
      name: "",
      description: "",
      unit: "",
      category: "",
      code: "",
      color: "#72ea72"
    });
    await loadProducts();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await loadProducts();
  };

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setEditProduct({ ...p });
  };

  const handleSave = async () => {
    if (!editProduct) return;
    await updateProduct(editProduct.id, editProduct);
    setEditId(null);
    setEditProduct(null);
    await loadProducts();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Продукты</h1>

      {/* Форма создания нового продукта */}
      <div className="flex gap-2 mb-4 items-center">
        <input
          className="border p-2 rounded"
          placeholder="Имя"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Описание"
          value={newProduct.description}
          onChange={e =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Ед. изм."
          value={newProduct.unit}
          onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Категория"
          value={newProduct.category}
          onChange={e =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        />
        <input
          className="border p-2 rounded"
          placeholder="Код"
          value={newProduct.code}
          onChange={e => setNewProduct({ ...newProduct, code: e.target.value })}
        />

        {/* Цвет с отображением кода */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={newProduct.color}
            onChange={e =>
              setNewProduct({ ...newProduct, color: e.target.value })
            }
            style={{ width: 30, height: 30, padding: 0, border: "none", cursor: "pointer" }}
          />
          <span style={{ fontFamily: "monospace" }}>{newProduct.color}</span>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Добавить
        </button>
      </div>

      {/* Таблица */}
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Имя</th>
            <th className="border p-2">Описание</th>
            <th className="border p-2">Ед. изм.</th>
            <th className="border p-2">Категория</th>
            <th className="border p-2">Код</th>
            <th className="border p-2">Цвет</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>

              {/* Режим редактирования */}
              {editId === p.id && editProduct ? (
                <>
                  <td className="border p-2">
                    <input
                      className="border p-1 rounded"
                      value={editProduct.name}
                      onChange={e =>
                        setEditProduct({ ...editProduct, name: e.target.value })
                      }
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      className="border p-1 rounded"
                      value={editProduct.description}
                      onChange={e =>
                        setEditProduct({
                          ...editProduct,
                          description: e.target.value
                        })
                      }
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      className="border p-1 rounded"
                      value={editProduct.unit}
                      onChange={e =>
                        setEditProduct({ ...editProduct, unit: e.target.value })
                      }
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      className="border p-1 rounded"
                      value={editProduct.category}
                      onChange={e =>
                        setEditProduct({
                          ...editProduct,
                          category: e.target.value
                        })
                      }
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      className="border p-1 rounded"
                      value={editProduct.code}
                      onChange={e =>
                        setEditProduct({ ...editProduct, code: e.target.value })
                      }
                    />
                  </td>

                  <td className="border p-2 flex items-center gap-2">
                    <input
                      type="color"
                      value={editProduct.color}
                      onChange={e =>
                        setEditProduct({ ...editProduct, color: e.target.value })
                      }
                      style={{
                        width: 30,
                        height: 30,
                        padding: 0,
                        border: "none",
                        cursor: "pointer"
                      }}
                    />
                    <span style={{ fontFamily: "monospace" }}>{editProduct.color}</span>
                  </td>

                  <td className="border p-2 flex gap-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={handleSave}
                    >
                      Сохранить
                    </button>
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        setEditId(null);
                        setEditProduct(null);
                      }}
                    >
                      Отмена
                    </button>
                  </td>
                </>
              ) : (
                /* Обычный режим отображения */
                <>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.description}</td>
                  <td className="border p-2">{p.unit}</td>
                  <td className="border p-2">{p.category}</td>
                  <td className="border p-2">{p.code}</td>
                  <td className="border p-2 flex items-center gap-2">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 4,
                        backgroundColor: p.color,
                        border: "1px solid #ccc"
                      }}
                    />
                    <span style={{ fontFamily: "monospace" }}>{p.color}</span>
                  </td>

                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Удалить
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}