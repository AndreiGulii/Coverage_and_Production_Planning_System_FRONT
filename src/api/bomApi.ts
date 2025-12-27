import axios from "axios";

// ===== DTO =====

// Запрос на создание/обновление BOM
export interface BomRequestDto {
    productId: string; // UUID
    productType: "product" | "semiproduct";
    productMe: number;
    productMeh: string;
    materialId: string; // UUID
    materialType: "material" | "semiproduct";
    materialMe: number;
    materialMeh: string;
    version: string;
    createdAt?: string; // ISO-строка, LocalDateTime
    updatedAt?: string; // ISO-строка, LocalDateTime
}

// Ответ от сервера (сущность Bom)
export interface BomResponseDto {
    id: string;
    productId: string;
    productName: string;
    productType: "product" | "semiproduct";   // <-- новое
    materialId: string;
    materialName: string;
    materialType: "material" | "semiproduct"; // <-- новое
    productMe: number;
    productMeh?: string;
    materialMe: number;
    materialMeh?: string;
    version?: string;
}

const API_URL = "/api/boms";

// ===== Внутренний тип для raw ответа сервера =====
interface BomRawDto {
    id: string;
    product?: { id: string; name: string; type: "product" | "semiproduct" };
    productId?: string;
    productName?: string;
    material?: { id: string; name: string; type: "material" | "semiproduct" };
    materialId?: string;
    materialName?: string;
    productMe: number;
    productMeh?: string;
    materialMe: number;
    materialMeh?: string;
    version?: string;
}

// ===== API =====

// Получить все BOM
export const getBoms = async (): Promise<BomResponseDto[]> => {
    try {
        const { data } = await axios.get<BomRawDto[]>(API_URL);

        return data.map(b => ({
            id: b.id,
    productId: b.product?.id || b.productId || "",
    productName: b.product?.name || b.productName || "",
    productType: b.product?.type || "product",           // <-- новый
    materialId: b.material?.id || b.materialId || "",
    materialName: b.material?.name || b.materialName || "",
    materialType: b.material?.type || "material",       // <-- новый
    productMe: b.productMe,
    productMeh: b.productMeh,
    materialMe: b.materialMe,
    materialMeh: b.materialMeh,
    version: b.version,
        }));
    } catch (error) {
        console.error('Ошибка запроса BOM:', error);
        throw error;
    }
};

/// Получить BOM по ID
export const getBomById = async (id: string): Promise<BomResponseDto> => {
    const { data } = await axios.get<BomRawDto>(`${API_URL}/${id}`);

    return {
        id: data.id,
        productId: data.product?.id || data.productId || "",
        productName: data.product?.name || data.productName || "",
        productType: data.product?.type || "product",         // <-- добавлено
        materialId: data.material?.id || data.materialId || "",
        materialName: data.material?.name || data.materialName || "",
        materialType: data.material?.type || "material",      // <-- добавлено
        productMe: data.productMe,
        productMeh: data.productMeh,
        materialMe: data.materialMe,
        materialMeh: data.materialMeh,
        version: data.version,
    };
};

// Создать BOM
export const createBom = async (dto: BomRequestDto): Promise<BomResponseDto> => {
    const { data } = await axios.post<BomRawDto>(API_URL, dto);

    return {
        id: data.id,
        productId: data.product?.id || data.productId || "",
        productName: data.product?.name || data.productName || "",
        productType: data.product?.type || "product",         // <-- добавлено
        materialId: data.material?.id || data.materialId || "",
        materialName: data.material?.name || data.materialName || "",
        materialType: data.material?.type || "material",      // <-- добавлено
        productMe: data.productMe,
        productMeh: data.productMeh,
        materialMe: data.materialMe,
        materialMeh: data.materialMeh,
        version: data.version,
    };
};

// Обновить BOM
export const updateBom = async (id: string, dto: BomRequestDto): Promise<BomResponseDto> => {
    const { data } = await axios.put<BomRawDto>(`${API_URL}/${id}`, dto);

    return {
        id: data.id,
        productId: data.product?.id || data.productId || "",
        productName: data.product?.name || data.productName || "",
        productType: data.product?.type || "product",         // <-- добавлено
        materialId: data.material?.id || data.materialId || "",
        materialName: data.material?.name || data.materialName || "",
        materialType: data.material?.type || "material",      // <-- добавлено
        productMe: data.productMe,
        productMeh: data.productMeh,
        materialMe: data.materialMe,
        materialMeh: data.materialMeh,
        version: data.version,
    };
};
// Удалить BOM
export const deleteBom = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};