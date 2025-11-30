import axios from "axios";
import type { AxiosResponse } from "axios";

export interface Production {
  id?: number;
  machineId: number;
  itemId: number;
  itemName?: string;
  quantity: number;
  productionTimePerUnit: number;
  setupTime?: number;
  minBatch?: number;
  intervalBatch?: number;
  startTime?: string | null; // безопасный тип
}

const BASE = "/api/production";

const ProductionAPI = {
  getAll: (): Promise<AxiosResponse<Production[]>> => axios.get(BASE),
  getMachinePlan: (machineId: number): Promise<AxiosResponse<Production[]>> =>
    axios.get(`${BASE}/machine/${machineId}`),

  create: (data: Production) => axios.post(BASE, data),
  update: (id: number, data: Production) => axios.put(`${BASE}/${id}`, data),
  delete: (id: number) => axios.delete(`${BASE}/${id}`),

  recalcSchedule: () => axios.post(`${BASE}/recalculate`),
};

export default ProductionAPI;