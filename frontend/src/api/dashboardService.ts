import api from "./api";

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  maxOrderValue: number;
  minOrderValue: number;
}

export interface PeriodOrder {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  count: number;
  total: number;
}

export interface CategorySales {
  _id: string;
  categoryName: string;
  count: number;
  total: number;
}

export interface TopSellingProduct {
  _id: string;
  productName: string;
  count: number;
  total: number;
}

export const dashboardService = {
  getStatistics: async (
    startDate?: string,
    endDate?: string,
    categoryId?: string
  ) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (categoryId) params.append("categoryId", categoryId);

    const response = await api.get<OrderStatistics>(
      `/dashboard/statistics?${params.toString()}`
    );
    return response.data;
  },

  getOrdersByPeriod: async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await api.get<PeriodOrder[]>(
      `/dashboard/orders-by-period?${params.toString()}`
    );
    return response.data;
  },

  getOrdersByCategory: async () => {
    const response = await api.get<CategorySales[]>(
      "/dashboard/orders-by-category"
    );
    return response.data;
  },

  getTopSellingProducts: async (limit = 10) => {
    const response = await api.get<TopSellingProduct[]>(
      `/dashboard/top-selling-products?limit=${limit}`
    );
    return response.data;
  },
};
