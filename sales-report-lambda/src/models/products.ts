// src/models/product.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  categoryIds: mongoose.Types.ObjectId[];
  imageUrl: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
