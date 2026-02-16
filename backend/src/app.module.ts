import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { ProductCostsModule } from './product-costs/product-costs.module';
import { ProductsModule } from './products/products.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    DatabaseModule,
    ProductsModule,
    ProductCostsModule,
    OrdersModule,
    WebhooksModule,
    DashboardModule,
  ],
})
export class AppModule { }
