// src/api/semiproductApi.ts
import axios from "axios";

export interface SemiproductDto {
  id?: string;
  name: string;
  description?: string;
  unit: string;
  color?: string;
}

export const getSemiproducts = async (): Promise<SemiproductDto[]> => {
  const res = await axios.get("/api/semiproducts");
  return res.data;
};

export const createSemiproduct = async (data: Omit<SemiproductDto, "id">) => {
  const res = await axios.post("/api/semiproducts", data);
  return res.data;
};

export const updateSemiproduct = async (id: string, data: SemiproductDto) => {
  const res = await axios.put(`/api/semiproducts/${id}`, data);
  return res.data;
};

export const deleteSemiproduct = async (id: string) => {
  await axios.delete(`/api/semiproducts/${id}`);
};