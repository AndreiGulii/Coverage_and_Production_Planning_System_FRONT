import axios from "axios";
const api = axios.create({ baseURL: "/api" });

export const getCoverage = async (): Promise<CoverageDto[]> => {
  const { data } = await api.get<CoverageDto[]>("/coverage");
  return data;
};
export type CoverageDay = {
  date: string;      // ISO string, например "2025-10-21"
  demand: number;    // потребность на этот день
};

export type CoverageDto = {
  productId: string;
  productName: string;
  description: string;
  stock: number;          // текущий запас
  coveredDays: number;    // кол-во дней, которые покрывает запас
  days: CoverageDay[];    // массив по дням
};