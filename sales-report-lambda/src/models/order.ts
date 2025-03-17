import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  date: Date;
  productIds: mongoose.Types.ObjectId[];
  total: number;
}

const OrderSchema: Schema = new Schema(
  {
    date: { type: Date, default: Date.now },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
