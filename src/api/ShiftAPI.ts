import axios from "axios";
import type { AxiosResponse } from "axios"

export interface Shift {
  id?: number;
  startTime: string;
  endTime: string;
  color?: string;
  isWorking?: boolean;
}

const BASE = "/api/shifts";

const ShiftAPI = {
  getAll: (): Promise<AxiosResponse<Shift[]>> => axios.get(BASE),
  get: (id: number): Promise<AxiosResponse<Shift>> => axios.get(`${BASE}/${id}`),

  create: (data: Shift) => axios.post(BASE, data),
  update: (id: number, data: Shift) => axios.put(`${BASE}/${id}`, data),
  delete: (id: number) => axios.delete(`${BASE}/${id}`)
};

export default ShiftAPI;