import axios from "axios";

// ===== DTO =====

// Запрос на создание/обновление BOM (синхронно с BomRequestDto.java)
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
    productName: string;
    materialName: string;
    productMe: number;
    productMeh?: string;
    materialMe: number;
    materialMeh?: string;
    version?: string;
}

const API_URL = "/api/boms";

// ===== API =====

// Получить все BOM
export const getBoms = async (): Promise<BomResponseDto[]> => {
    try {
        const { data } = await axios.get<BomResponseDto[]>(API_URL);
        return data;
    } catch (error) {
        console.error('Ошибка запроса BOM:', error);
        throw error;
    }
};

// Получить BOM по ID
export const getBomById = async (id: string): Promise<BomResponseDto> => {
    const { data } = await axios.get<BomResponseDto>(`${API_URL}/${id}`);
    return data;
};

// Создать BOM
export const createBom = async (dto: BomRequestDto): Promise<BomResponseDto> => {
    const { data } = await axios.post<BomResponseDto>(API_URL, dto);
    return data;
};

// Обновить BOM
export const updateBom = async (id: string, dto: BomRequestDto): Promise<BomResponseDto> => {
    const { data } = await axios.put<BomResponseDto>(`${API_URL}/${id}`, dto);
    return data;
};

// Удалить BOM
export const deleteBom = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};