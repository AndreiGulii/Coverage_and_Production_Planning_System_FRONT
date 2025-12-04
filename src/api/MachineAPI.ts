import axios from "axios";
import type { AxiosResponse } from "axios";

export interface Machine {
  id: string; // теперь точно string
  name: string;
  description?: string;
  workplace?: number;
  items?: MachineItem[]; // ← используем MachineItem
  capabilities?: MachineItem[]; // ← тоже MachineItem
}

export interface Workplace {
  id: string;
  name: string;
}

export interface MachineItem {
  id: string;
  itemId: string;
  itemType: "product" | "semiproduct";
  minBatch: number;
  productionTimePerUnit: number;
  setupTime: number;

  object?: {
    id: string;
    name: string;
    description?: string;
  };
}

const BASE = "/api/machines";

const MachineAPI = {
  getAll: (): Promise<AxiosResponse<Machine[]>> => axios.get(BASE),
  get: (id: string): Promise<AxiosResponse<Machine>> => axios.get(`${BASE}/${id}`),
  create: (data: Omit<Machine, "id" | "items">) => axios.post(BASE, data),
  update: (id: string, data: Partial<Omit<Machine, "id" | "items">>) => axios.put(`${BASE}/${id}`, data),
  delete: (id: string) => axios.delete(`${BASE}/${id}`),

  addWorkplace: (id: string, workplace: Omit<Workplace, "id">) =>
    axios.post(`${BASE}/${id}/workplaces`, workplace),
  getWorkplaces: (id: string): Promise<AxiosResponse<Workplace[]>> =>
    axios.get(`${BASE}/${id}/workplaces`),

  addItemToMachine: (
    machineId: string,
    itemId: string,
    type: "product" | "semiproduct",
    minBatch = 1,
    productionTimePerUnit = 1,
    setupTime = 0
  ) =>
    axios.post("/api/machine-products", {
      machine: { id: machineId },
      itemId,
      itemType: type,
      minBatch,
      productionTimePerUnit,
      setupTime,
    }),

  getMachineProducts: (machineId: string): Promise<AxiosResponse<MachineItem[]>> =>
    axios.get(`/api/machine-products?machineId=${machineId}`),

  getItems: (machineId: string): Promise<AxiosResponse<MachineItem[]>> =>
    axios.get(`${BASE}/${machineId}/items`),

  deleteItem: (machineProductId: string) => axios.delete(`/api/machine-products/${machineProductId}`),
};

export default MachineAPI;