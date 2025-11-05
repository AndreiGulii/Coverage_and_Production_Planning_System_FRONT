import axios from "axios";
const api = axios.create({ baseURL: "/api" });

export const ComponentType = {
  MATERIAL : "MATERIAL",
  SEMIPRODUCT : "SEMIPRODUCT",
  PRODUCT : "PRODUCT",
} as const;

export type ComponentType = typeof ComponentType[keyof typeof ComponentType];

export type StockDto = {
  id?: string;
  componentType: ComponentType;
  componentId: string; // UUID как string
  quantity: number;
  lastUpdated?: string; // ISO string
};

export const getStocks = async (): Promise<StockDto[]> => {
  const { data } = await api.get<StockDto[]>("/stock");
  return data;
};

export const createStock = (payload: StockDto) => api.post("/stock", payload);
export const updateStock = (id: string, payload: StockDto) => api.put(`/stock/${id}`, payload);
export const deleteStock = (id: string) => api.delete(`/stock/${id}`);
export const getStockById = (id: string) => api.get<StockDto>(`/stock/${id}`);