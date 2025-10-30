import axios from "axios";
const api = axios.create({ baseURL: "/api" });

export type ProductDto = {
  id?: string;
  name: string;
  description?: string;
  unit?: string;
  category?:string
  code?: string;
};

export const getProducts = () => api.get<ProductDto[]>("/products");
export const createProduct = (payload: ProductDto) => api.post("/products", payload);
export const updateProduct = (id: string, payload: ProductDto) => api.put(`/products/${id}`, payload);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);