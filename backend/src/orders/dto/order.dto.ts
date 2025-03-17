import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsDate,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsArray()
  @IsNotEmpty()
  productIds: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  total: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsArray()
  @IsOptional()
  productIds: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  total: number;
}

export class DateRangeDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
