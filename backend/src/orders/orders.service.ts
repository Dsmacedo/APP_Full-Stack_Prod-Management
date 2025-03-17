import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Verificar se todos os produtos existem
    if (createOrderDto.productIds.length === 0) {
      throw new BadRequestException('Order must have at least one product');
    }

    for (const productId of createOrderDto.productIds) {
      const exists = await this.productsService.productExists(productId);
      if (!exists) {
        throw new BadRequestException(`Product with ID ${productId} not found`);
      }
    }

    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('productIds').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('productIds')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Verificar se todos os produtos existem
    if (updateOrderDto.productIds && updateOrderDto.productIds.length > 0) {
      for (const productId of updateOrderDto.productIds) {
        const exists = await this.productsService.productExists(productId);
        if (!exists) {
          throw new BadRequestException(
            `Product with ID ${productId} not found`,
          );
        }
      }
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('productIds')
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return deletedOrder;
  }

  async getOrderStatistics(
    startDate?: Date,
    endDate?: Date,
    categoryId?: string,
  ) {
    const matchStage: any = {};

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) {
        matchStage.date.$gte = startDate;
      }
      if (endDate) {
        matchStage.date.$lte = endDate;
      }
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'products',
          localField: 'productIds',
          foreignField: '_id',
          as: 'products',
        },
      },
    ];

    // Se houver um filtro de categoria
    if (categoryId) {
      pipeline.push({
        $match: {
          'products.categoryIds': { $in: [categoryId] },
        },
      } as any);
    }

    // Agregação para estatísticas
    pipeline.push({
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        maxOrderValue: { $max: '$total' },
        minOrderValue: { $min: '$total' },
      },
    } as any);

    const result = await this.orderModel.aggregate(pipeline).exec();

    return result.length
      ? result[0]
      : {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          maxOrderValue: 0,
          minOrderValue: 0,
        };
  }
}
