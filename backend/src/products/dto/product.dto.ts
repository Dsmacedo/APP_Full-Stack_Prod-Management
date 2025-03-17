import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsArray()
  @IsOptional()
  categoryIds: string[];

  @IsOptional()
  @IsString()
  imageUrl: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsArray()
  @IsOptional()
  categoryIds: string[];

  @IsOptional()
  @IsString()
  imageUrl: string;
}
