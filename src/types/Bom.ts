import type { MeasurementUnit } from './MeasurementUnit';

export interface Bom {
  productId: string;
  productType: 'product' | 'semiproduct';
  productMe: number;
  productMeh: MeasurementUnit;
  materialId: string;
  materialType: 'material' | 'semiproduct';
  materialMe: number;
  materialMeh: MeasurementUnit;
  version: string;
}