import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DateRangeDto } from '../orders/dto/order.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('statistics')
  async getOrderStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
    @Query('productId') productId?: string,
  ) {
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    return this.dashboardService.getOrderStatistics(
      startDateObj,
      endDateObj,
      categoryId,
      productId,
    );
  }

  @Get('orders-by-period')
  async getOrdersByPeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    return this.dashboardService.getOrdersByPeriod(startDateObj, endDateObj);
  }

  @Get('orders-by-category')
  async getOrdersByCategory() {
    return this.dashboardService.getOrdersByCategory();
  }

  @Get('top-selling-products')
  async getTopSellingProducts(@Query('limit') limit?: number) {
    return this.dashboardService.getTopSellingProducts(limit ? +limit : 10);
  }
}
