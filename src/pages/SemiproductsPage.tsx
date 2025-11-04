// src/pages/SemiproductsPage.tsx
import { useEffect, useState } from "react";
import { getSemiproducts, createSemiproduct, deleteSemiproduct } from "../api/semiproductApi";
import type { SemiproductDto } from "../api/semiproductApi";

export default function SemiproductsPage() {
  const [semiproducts, setSemiproducts] = useState<SemiproductDto[]>([]);
  const [newSemiproduct, setNewSemiproduct] = useState<Partial<SemiproductDto>>({
    name: "",
    description: "",
    unit: ""
  });

  useEffect(() => {
    loadSemiproducts();
  }, []);

  const loadSemiproducts = async () => {
    const data = await getSemiproducts();
    setSemiproducts(data);
  };

  const handleAdd = async () => {
    if (!newSemiproduct.name || !newSemiproduct.unit) {
      alert("⚠️ Заполните название и единицу измерения");
      return;
    }

    await createSemiproduct(newSemiproduct as SemiproductDto);
    setNewSemiproduct({ name: "", description: "", unit: "" });
    await loadSemiproducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Удалить полуфабрикат?")) {
      await deleteSemiproduct(id);
      await loadSemiproducts();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Полуфабрикаты</h1>

      {/* Форма добавления */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Название"
          value={newSemiproduct.name}
          onChange={(e) => setNewSemiproduct({ ...newSemiproduct, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Описание"
          value={newSemiproduct.description}
          onChange={(e) => setNewSemiproduct({ ...newSemiproduct, description: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Ед. изм."
          value={newSemiproduct.unit}
          onChange={(e) => setNewSemiproduct({ ...newSemiproduct, unit: e.target.value })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Добавить
        </button>
      </div>

      {/* Таблица полуфабрикатов */}
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Название</th>
            <th className="border p-2">Описание</th>
            <th className="border p-2">Ед. изм.</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {semiproducts.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.description}</td>
              <td className="border p-2">{s.unit}</td>
              <td className="border p-2 text-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(s.id)}
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