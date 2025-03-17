// src/api/categoriesService.ts
import api from "./api";
import { Category } from "../types/Category";

export const categoriesService = {
  getAll: async () => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (category: Omit<Category, "_id">) => {
    const response = await api.post<Category>("/categories", category);
    return response.data;
  },

  update: async (id: string, category: Partial<Category>) => {
    const response = await api.put<Category>(`/categories/${id}`, category);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },
};
