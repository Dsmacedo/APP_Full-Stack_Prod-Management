// src/api/productsService.ts
import api from "./api";
import { Product } from "../types/Product";

export const productsService = {
  getAll: async () => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, "_id">) => {
    const response = await api.post<Product>("/products", product);
    return response.data;
  },

  update: async (id: string, product: Partial<Product>) => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  },
};
