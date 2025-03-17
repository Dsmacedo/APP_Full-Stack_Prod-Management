import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar se todas as categorias existem
    if (
      createProductDto.categoryIds &&
      createProductDto.categoryIds.length > 0
    ) {
      for (const categoryId of createProductDto.categoryIds) {
        const exists = await this.categoriesService.categoryExists(categoryId);
        if (!exists) {
          throw new BadRequestException(
            `Category with ID ${categoryId} not found`,
          );
        }
      }
    }

    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('categoryIds').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('categoryIds')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Verificar se todas as categorias existem
    if (
      updateProductDto.categoryIds &&
      updateProductDto.categoryIds.length > 0
    ) {
      for (const categoryId of updateProductDto.categoryIds) {
        const exists = await this.categoriesService.categoryExists(categoryId);
        if (!exists) {
          throw new BadRequestException(
            `Category with ID ${categoryId} not found`,
          );
        }
      }
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('categoryIds')
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }

  async productExists(id: string): Promise<boolean> {
    const count = await this.productModel.countDocuments({ _id: id }).exec();
    return count > 0;
  }
}
