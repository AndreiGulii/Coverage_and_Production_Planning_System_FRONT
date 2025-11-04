// src/api/materialApi.ts
import axios from "axios";

export interface MaterialDto {
  id: string;
  name: string;
  description: string;
  unit: string;
  createdAt?: string;
  updatedAt?: string;
}

// Получить все материалы
export const getMaterials = async (): Promise<MaterialDto[]> => {
  const response = await axios.get<MaterialDto[]>("/api/materials");
    return response.data;
};

// Получить один материал
export const getMaterialById = async (id: string): Promise<MaterialDto> => {
  const res = await axios.get(`/api/materials/${id}`);
  return res.data;
};

// Создать новый материал
export const createMaterial = async (data: Omit<MaterialDto, "id">) => {
  const res = await axios.post("/api/materials", data);
  return res.data;
};

// Удалить материал
export const deleteMaterial = async (id: string) => {
  await axios.delete(`/api/materials/${id}`);
};