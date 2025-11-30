// src/types/Bom.ts

export interface BomRequestDto {
  productId: string;
  productType: "product" | "semiproduct";
  productMe: number;
  productMeh: string;
  materialId: string;
  materialType: "material" | "semiproduct";
  materialMe: number;
  materialMeh: string;
  version: string;
}

export interface BomResponseDto extends BomRequestDto {
  id: string;
  productName?: string;
  materialName?: string;
}