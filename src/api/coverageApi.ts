import axios from "axios";
const api = axios.create({ baseURL: "/api" });

export const getCoverage = async (): Promise<CoverageDto[]> => {
  const { data } = await api.get<CoverageDto[]>("/coverage");
  return data;
};

export type CoverageDay = {
  date: string;
  demand: number;
  covered: boolean;
};

export type CoverageDto = {
  productId: string;
  productName: string;
  description: string;
  stock: number;
  coveredDays: number;
  days: CoverageDay[];

  // Добавляем тип продукта для фильтрации
  productType: "product" | "semiproduct" | "material";

  semiproductCoverage?: CoverageDto[];
  materialCoverage?: CoverageDto[];
};