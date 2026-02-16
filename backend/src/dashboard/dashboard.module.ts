import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { ProductCostsModule } from '../product-costs/product-costs.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [OrdersModule, ProductCostsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
