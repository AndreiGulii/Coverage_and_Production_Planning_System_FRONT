import axios from "axios";
import type { AxiosResponse } from "axios"

export interface MachineProduct {
  id?: number;
  machineId: number;
  productId: number;
  setupTime?: number;
}

const BASE = "/api/machine-products";

const MachineProductAPI = {
  getAll: (): Promise<AxiosResponse<MachineProduct[]>> => axios.get(BASE),
  getByMachine: (machineId: number): Promise<AxiosResponse<MachineProduct[]>> => axios.get(`${BASE}/machine/${machineId}`),
  getByProduct: (productId: number): Promise<AxiosResponse<MachineProduct[]>> => axios.get(`${BASE}/product/${productId}`),

  assignProduct: (machineId: number, data: { productId: number; setupTime?: number }) =>
    axios.post(`${BASE}/machine/${machineId}`, data),

  update: (id: number, data: MachineProduct) => axios.put(`${BASE}/${id}`, data),
  delete: (id: number) => axios.delete(`${BASE}/${id}`)
};

export default MachineProductAPI;