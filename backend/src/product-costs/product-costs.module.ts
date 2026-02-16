import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { ProductCost } from './product-cost.entity';
import { ProductCostsController } from './product-costs.controller';
import { ProductCostsService } from './product-costs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCost]), ProductsModule],
  controllers: [ProductCostsController],
  providers: [ProductCostsService],
  exports: [ProductCostsService],
})
export class ProductCostsModule { }
