// src/api/materialApi.ts
import axios from "axios";

export interface MaterialCreateDto {
  name: string;
  description: string;
  unit: string;
  mountTimeSeconds: number;
  unmountTimeSeconds: number;
}

export interface MaterialDto extends MaterialCreateDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getMaterials = async (): Promise<MaterialDto[]> => {
  const res = await axios.get("/api/materials");
  return res.data;
};

export const getMaterialById = async (id: string): Promise<MaterialDto> => {
  const res = await axios.get(`/api/materials/${id}`);
  return res.data;
};

export const createMaterial = async (data: MaterialCreateDto) => {
  const res = await axios.post("/api/materials", data);
  return res.data;
};

export const updateMaterial = async (id: string, data: MaterialCreateDto) => {
  const res = await axios.put(`/api/materials/${id}`, data);
  return res.data;
};

export const deleteMaterial = async (id: string) => {
  await axios.delete(`/api/materials/${id}`);
};