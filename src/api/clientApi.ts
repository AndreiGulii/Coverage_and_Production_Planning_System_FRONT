import axios from "axios";
const api = axios.create({ baseURL: "/api" });

export type ClientDto = {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
};

export const getClients = () => api.get<ClientDto[]>("/clients");
export const createClient = (payload: ClientDto) => api.post("/clients", payload);
export const updateClient = (id: string, payload: ClientDto) => api.put(`/clients/${id}`, payload);
export const deleteClient = (id: string) => api.delete(`/clients/${id}`);
