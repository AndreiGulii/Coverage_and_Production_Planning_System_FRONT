// src/pages/MaterialsPage.tsx
import { useEffect, useState } from "react";
import { getMaterials, createMaterial, deleteMaterial } from "../api/materialApi";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<{ id: string; name: string; description: string; unit: string }[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");

  const loadData = async () => {
    const data = await getMaterials();
    setMaterials(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;

    await createMaterial({
      name,
      description,
      unit,
    });

    setName("");
    setDescription("");
    setUnit("");
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Удалить материал?")) {
      await deleteMaterial(id);
      await loadData();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Материалы</h1>

      {/* --- Форма добавления --- */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Название материала"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Описание материала"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Единица измерения"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Добавить
        </button>
      </div>

      {/* --- Таблица материалов --- */}
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
          {materials.map((m) => (
            <tr key={m.id}>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.description}</td>
              <td className="border p-2">{m.unit}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(m.id)}
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