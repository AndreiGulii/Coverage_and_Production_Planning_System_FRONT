import axios from "axios";
import type { AxiosResponse } from "axios";

// --- Тип продукта ---
export interface Product {
  id?: number;
  name: string;
  unit?: string;
  minBatch?: number;
  productionTime?: number;
  color?: string;
  type?: "product" | "semiproduct";
}

// --- API ---
const BASE = "/api/products";

export const ProductPlAPI = {
  getAll: (): Promise<AxiosResponse<Product[]>> => axios.get(BASE),
  get: (id: number): Promise<AxiosResponse<Product>> => axios.get(`${BASE}/${id}`),
  create: (data: Product) => axios.post(BASE, data),
  update: (id: number, data: Product) => axios.put(`${BASE}/${id}`, data),
  delete: (id: number) => axios.delete(`${BASE}/${id}`)
};

export default ProductPlAPI; // default экспорт