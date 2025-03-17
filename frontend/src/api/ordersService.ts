// src/api/ordersService.ts
import api from "./api";
import { Order } from "../types/Order";

export const ordersService = {
  getAll: async () => {
    const response = await api.get<Order[]>("/orders");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (order: Omit<Order, "_id">) => {
    const response = await api.post<Order>("/orders", order);
    return response.data;
  },

  update: async (id: string, order: Partial<Order>) => {
    const response = await api.put<Order>(`/orders/${id}`, order);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/orders/${id}`);
  },
};
