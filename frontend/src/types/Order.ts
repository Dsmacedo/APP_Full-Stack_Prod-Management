export interface Order {
  _id: string;
  date: string;
  productIds: string[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}
