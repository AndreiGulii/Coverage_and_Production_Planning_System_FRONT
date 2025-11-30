import axios from "axios";
import type { AxiosResponse } from "axios";

export interface Machine {
  id?: string; // UUID
  name: string;
  description?: string;
  workplaces?: number;
  items?: Item[]; // продукты и полуфабрикаты
}

export interface Workplace {
  id?: string;
  name: string;
}

export interface Item {
  id?: string;
  name: string;
  type: "product" | "semiproduct";
  description?: string;
  minBatch?: number;
  productionTimePerUnit?: number;
  setupTime?: number;
}

const BASE = "/api/machines";

const MachineAPI = {
  getAll: (): Promise<AxiosResponse<Machine[]>> => axios.get(BASE),
  get: (id: string): Promise<AxiosResponse<Machine>> => axios.get(`${BASE}/${id}`),
  create: (data: Machine) => axios.post(BASE, data),
  update: (id: string, data: Machine) => axios.put(`${BASE}/${id}`, data),
  delete: (id: string) => axios.delete(`${BASE}/${id}`),

  addWorkplace: (id: string, workplace: Workplace) => axios.post(`${BASE}/${id}/workplaces`, workplace),
  getWorkplaces: (id: string): Promise<AxiosResponse<Workplace[]>> => axios.get(`${BASE}/${id}/workplaces`),

  addItemToMachine: (
    machineId: string,
    itemId: string,
    type: "product" | "semiproduct",
    minBatch: number = 1,
    productionTimePerUnit: number = 1,
    setupTime: number = 0
  ) =>
    axios.post("/api/machine-products", {
      machine: { id: machineId },
      itemId,
      itemType: type,
      minBatch,
      productionTimePerUnit,
      setupTime
    }),

  // Получение продуктов конкретной машины из таблицы machine_product
  getMachineProducts: (machineId: string): Promise<AxiosResponse<Item[]>> =>
    axios.get(`/api/machine-products?machineId=${machineId}`),

  getItems: (machineId: string): Promise<AxiosResponse<Item[]>> =>
    axios.get(`${BASE}/${machineId}/items`),

  deleteItem: (machineProductId: string) => 
    axios.delete(`/api/machine-products/${machineProductId}`),
};

export default MachineAPI;