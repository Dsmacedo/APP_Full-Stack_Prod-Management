import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class DashboardService {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getOrderStatistics(
    startDate?: Date,
    endDate?: Date,
    categoryId?: string,
    productId?: string,
  ) {
    return this.ordersService.getOrderStatistics(
      startDate,
      endDate,
      categoryId,
    );
  }

  async getOrdersByPeriod(startDate: Date, endDate: Date) {
    // Usando uma tipagem explícita para o pipeline
    const pipeline: any[] = [
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
          },
          count: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ];

    return this.orderModel.aggregate(pipeline).exec();
  }

  async getOrdersByCategory() {
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'products',
          localField: 'productIds',
          foreignField: '_id',
          as: 'products',
        },
      },
      { $unwind: '$products' },
      { $unwind: '$products.categoryIds' },
      {
        $lookup: {
          from: 'categories',
          localField: 'products.categoryIds',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          count: { $sum: 1 },
          total: { $sum: '$total' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ];

    return this.orderModel.aggregate(pipeline).exec();
  }

  async getTopSellingProducts(limit = 10) {
    const pipeline: any[] = [
      { $unwind: '$productIds' },
      {
        $lookup: {
          from: 'products',
          localField: 'productIds',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product._id',
          productName: { $first: '$product.name' },
          count: { $sum: 1 },
          total: { $sum: '$product.price' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ];

    return this.orderModel.aggregate(pipeline).exec();
  }
}
