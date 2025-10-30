import { useEffect, useState } from "react";
import { getClients, createClient, deleteClient } from "../api/clientApi";

// Определяем тип клиента
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function ClientsPage(){
    const [clients, setClients]= useState<Client[]>([]);
    const [newClient, setNewClient] = useState<Omit<Client, "id">>({ 
        name: "", 
        email: "", 
        phone: "" 
    });
    useEffect(() => {
    loadClients();
    }, []);

    const loadClients = async () => {
    const { data } = await getClients();
    setClients(data as Client[]);
  };

  const handleAdd = async () => {
    await createClient(newClient);
    setNewClient({ name: "", email: "", phone: "" });
    await loadClients();
  };

  const handleDelete = async (id: string) => {
    await deleteClient(id);
    await loadClients();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Клиенты</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Имя"
          value={newClient.name}
          onChange={e => setNewClient({ ...newClient, name: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={newClient.email}
          onChange={e => setNewClient({ ...newClient, email: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Телефон"
          value={newClient.phone}
          onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
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
            <th className="border p-2">Email</th>
            <th className="border p-2">Телефон</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.email}</td>
              <td className="border p-2">{c.phone}</td>
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