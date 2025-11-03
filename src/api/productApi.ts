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

export const getProducts = async (): Promise<ProductDto[]> => {
  const { data } = await api.get<ProductDto[]>("/products");
  return data;
};
export const createProduct = (payload: ProductDto) => api.post("/products", payload);
export const updateProduct = (id: string, payload: ProductDto) => api.put(`/products/${id}`, payload);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);