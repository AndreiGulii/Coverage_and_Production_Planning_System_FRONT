import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../api/productApi";

interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: string;
  code: string;
}

interface ProductDto {
  id?: string;
  name: string;
  description?: string;
  unit?: string;
  category?: string;
  code?: string;
}

export default function ProductsPage(){
    const [products, setProducts]= useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", unit: "", category:"", code:"" });
    useEffect(() => {
    loadProducts();
    }, []);

    const loadProducts = async () => {
  const { data } = await getProducts(); // ProductDto[]
  const productsMapped: Product[] = (data as ProductDto[]).map(p => ({
    id: p.id || "",
    name: p.name,
    description: p.description || "",
    unit: p.unit || "",
    category: p.category || "",
    code: p.code || ""
  }));
  setProducts(productsMapped);
};

  const handleAdd = async () => {
    await createProduct(newProduct);
    setNewProduct({ name: "", description: "", unit: "", category:"", code:"" });
    await loadProducts();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await loadProducts();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Продукты</h1>

      <div className="flex gap-2 mb-4">
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
          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Ед. измер."
          value={newProduct.unit}
          onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Категория"
          value={newProduct.category}
          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Код"
          value={newProduct.code}
          onChange={e => setNewProduct({ ...newProduct, code: e.target.value })}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Добавить
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Имя</th>
            <th className="border p-2">Описание</th>
            <th className="border p-2">Ед. измер.</th>
            <th className="border p-2">Категория</th>
            <th className="border p-2">Код</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map(c => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.description}</td>
              <td className="border p-2">{c.unit}</td>
              <td className="border p-2">{c.category}</td>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(c.id)}
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