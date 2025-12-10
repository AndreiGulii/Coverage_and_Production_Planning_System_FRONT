import { useEffect, useState } from "react";
import {
  getSemiproducts,
  createSemiproduct,
  deleteSemiproduct,
  updateSemiproduct
} from "../api/semiproductApi";
import type { SemiproductDto } from "../api/semiproductApi";

export default function SemiproductsPage() {
  const [semiproducts, setSemiproducts] = useState<SemiproductDto[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<SemiproductDto>({
    id: "",
    name: "",
    description: "",
    unit: "",
    color: "#72ea72"
  });

  useEffect(() => {
    loadSemiproducts();
  }, []);

  const loadSemiproducts = async () => {
    const data = await getSemiproducts();
    setSemiproducts(
      data.map(d => ({
        ...d,
        color: d.color || "#72ea72"
      }))
    );
  };

  const clearForm = () => {
    setEditingId(null);
    setForm({
      id: "",
      name: "",
      description: "",
      unit: "",
      color: "#72ea72"
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.unit) {
      alert("Заполните название и единицу измерения");
      return;
    }

    if (editingId) {
      await updateSemiproduct(editingId, form);
    } else {
      await createSemiproduct(form);
    }

    clearForm();
    await loadSemiproducts();
  };

  const handleEdit = (s: SemiproductDto) => {
    setEditingId(s.id!);
    setForm({
      id: s.id,
      name: s.name,
      description: s.description || "",
      unit: s.unit || "",
      color: s.color || "#72ea72"
    });
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

      {/* Форма */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Название"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Ед. изм."
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />

        {/* Цвет */}
        <div className="flex items-center">
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-16 h-10 border rounded cursor-pointer"
          />
          <span className="ml-2">{form.color}</span>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          {editingId ? "Сохранить" : "Добавить"}
        </button>
      </div>

      {/* Таблица */}
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Название</th>
            <th className="border p-2">Описание</th>
            <th className="border p-2">Ед. изм.</th>
            <th className="border p-2">Цвет</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {semiproducts.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.description}</td>
              <td className="border p-2">{s.unit}</td>
              <td className="border p-2">
                <div className="flex items-center">
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: s.color ?? "#72ea72"
                    }}
                  />
                  <span className="ml-2">{s.color}</span>
                </div>
              </td>
              <td className="border p-2 text-center space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(s)}
                >
                  Редактировать
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(s.id!)}
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