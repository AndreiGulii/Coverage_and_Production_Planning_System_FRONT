import { useEffect, useState } from "react";
import {
  getMaterials,
  createMaterial,
  deleteMaterial,
  updateMaterial,
  type MaterialDto
} from "../api/materialApi";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<MaterialDto[]>([]);
  const [idEditing, setIdEditing] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [mountTimeSeconds, setMountTimeSeconds] = useState<string>("0");
  const [unmountTimeSeconds, setUnmountTimeSeconds] = useState<string>("0");

  const loadData = async () => {
    const data = await getMaterials();
    setMaterials(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Очистить форму
  const clearForm = () => {
    setIdEditing(null);
    setName("");
    setDescription("");
    setUnit("");
    setMountTimeSeconds("0");
    setUnmountTimeSeconds("0");
  };

  // Сохранение (create или update)
  const handleSave = async () => {
    if (!name.trim()) return;

    const payload = {
      name,
      description,
      unit,
      // Преобразуем строки в числа и ставим 0 по умолчанию
      mountTimeSeconds: mountTimeSeconds !== "" ? Number(mountTimeSeconds) : 5,
      unmountTimeSeconds: unmountTimeSeconds !== "" ? Number(unmountTimeSeconds) : 5,
    };

    if (idEditing) {
      await updateMaterial(idEditing, payload);
      setIdEditing(null);
    } else {
      await createMaterial(payload);
    }

    clearForm();
    await loadData();
  };

  // Удаление
  const handleDelete = async (id: string) => {
    if (confirm("Удалить материал?")) {
      await deleteMaterial(id);
      await loadData();
    }
  };

  // Заполнить форму для редактирования
  const handleEdit = (m: MaterialDto) => {
    setIdEditing(m.id);
    setName(m.name);
    setDescription(m.description);
    setUnit(m.unit);
    setMountTimeSeconds(m.mountTimeSeconds?.toString() ?? "0");
    setUnmountTimeSeconds(m.unmountTimeSeconds?.toString() ?? "0");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Материалы</h1>

      {/* --- Форма добавления / редактирования --- */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Ед. изм."
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 rounded w-40"
          placeholder="Монтаж (сек)"
          value={mountTimeSeconds}
          onChange={(e) => setMountTimeSeconds(e.target.value)}
        />

        <input
          type="number"
          className="border p-2 rounded w-40"
          placeholder="Демонтаж (сек)"
          value={unmountTimeSeconds}
          onChange={(e) => setUnmountTimeSeconds(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {idEditing ? "Сохранить изменения" : "Добавить"}
        </button>

        {idEditing && (
          <button
            onClick={clearForm}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Отмена
          </button>
        )}
      </div>

      {/* --- Таблица материалов --- */}
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Название</th>
            <th className="border p-2">Описание</th>
            <th className="border p-2">Ед.изм.</th>
            <th className="border p-2">Монтаж (сек)</th>
            <th className="border p-2">Демонтаж (сек)</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>

        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.description}</td>
              <td className="border p-2">{m.unit}</td>
              <td className="border p-2">{m.mountTimeSeconds}</td>
              <td className="border p-2">{m.unmountTimeSeconds}</td>

              <td className="border p-2 text-center flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(m)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Редактировать
                </button>

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