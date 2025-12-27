import axios from "axios";
import type { ProductionSlot } from "@/types/production";

const BASE = "/api/production-scheduling";

export interface ScheduleRequest {
  machineId: string;
  itemId: string;
  itemType: "product" | "semiproduct";
  quantity: number;
  startTime: string;
  pressformId: string;
}

export const ProductionSchedulingApi = {
  schedule: (data: ScheduleRequest) =>
    axios.post<ProductionSlot>(`${BASE}/schedule`, null, { params: data }),

  getByMachine: (machineId: string) =>
    axios.get<ProductionSlot[]>(`${BASE}/machine/${machineId}`),

  checkPressformAvailability: (
    pressformId: string,
    start: string,
    end: string
  ) =>
    axios.get<boolean>(`${BASE}/availability`, {
      params: { pressformId, start, end },
    }),
};