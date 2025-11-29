import type { MeasurementUnit } from './MeasurementUnit';

export interface BomResponseDto {
  id: string;
  productId: string;        // ← обязательно, чтобы фильтр работал
  productName: string;
  materialId: string;
  materialName: string;
  productMe: number;
  productMeh?: MeasurementUnit;
  materialMe: number;
  materialMeh?: MeasurementUnit;
  version?: string;
}