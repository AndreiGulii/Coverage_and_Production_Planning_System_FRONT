import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// ======================
// REQUEST DTO
// ======================
export type StockRequestDto = {
  quantity: number;
  componentType: "MATERIAL" | "SEMIPRODUCT" | "PRODUCT";
  material?: { id: string };
  semiProduct?: { id: string };
  product?: { id: string };
};

// ======================
// STOCK DTO
// ======================
export type StockDto = {
  id?: string;
  quantity: number;
  lastUpdated?: string;
  componentType?: "MATERIAL" | "SEMIPRODUCT" | "PRODUCT";
  materialId?: string;
  semiproductId?: string;
  productId?: string;
};

// ======================
// STOCK API
// ======================
export const getStocks = async (): Promise<StockDto[]> => {
  const { data } = await api.get<StockDto[]>("/stock");
  return data;
};

export const createStock = (payload: StockRequestDto) => api.post("/stock", payload);
export const updateStock = (id: string, payload: StockRequestDto) =>
  api.put(`/stock/${id}`, payload);
export const deleteStock = (id: string) => api.delete(`/stock/${id}`);
export const getStockById = (id: string) => api.get<StockDto>(`/stock/${id}`);

// ======================
// COMPONENTS API
// ======================
export type MaterialDto = { id: string; name: string };
export type SemiProductDto = { id: string; name: string };
export type ProductDto = { id: string; name: string };

export const getMaterials = async (): Promise<MaterialDto[]> => {
  const { data } = await api.get<MaterialDto[]>("/materials");
  return data;
};

export const getSemiProducts = async (): Promise<SemiProductDto[]> => {
  const { data } = await api.get<SemiProductDto[]>("/semiproducts");
  return data;
};

export const getProducts = async (): Promise<ProductDto[]> => {
  const { data } = await api.get<ProductDto[]>("/products");
  return data;
};