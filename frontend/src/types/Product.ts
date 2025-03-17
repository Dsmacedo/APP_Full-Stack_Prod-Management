// src/types/Product.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
