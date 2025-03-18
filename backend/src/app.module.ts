import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://Dan:970516@cluster0.b8qrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        dbName: 'eadcourse',
      },
    ),
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    DashboardModule,
    FileUploadModule,
  ],
})
export class AppModule {}
