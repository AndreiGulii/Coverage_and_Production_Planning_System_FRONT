import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// --- Типы DTO ---
export type OrderItemDto = {
  productId: string;
  quantity: number;
  bedarfsdatum: string;
};

export type OrderRequestDto = {
  clientId: string;
  status?: string;
  items: OrderItemDto[];
};

export type ClientDto = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

export type ProductDto = {
  id: string;
  name: string;
  code?: string;
};

export type OrderResponseDto = {
  id: string;
  client: ClientDto;
  items: {
    id: string;
    product: ProductDto;
    quantity: number;
    bedarfsdatum: string;
  }[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

// --- API методы ---
export const getOrders = () => api.get<OrderResponseDto[]>("/orders");

export const getOrderById = (id: string) =>
  api.get<OrderResponseDto>(`/orders/${id}`);

export const createOrder = (payload: OrderRequestDto) =>
  api.post<OrderResponseDto>("/orders", payload);

export const updateOrder = (id: string, payload: OrderRequestDto) =>
  api.put<OrderResponseDto>(`/orders/${id}`, payload);

export const deleteOrder = (id: string) => api.delete(`/orders/${id}`);