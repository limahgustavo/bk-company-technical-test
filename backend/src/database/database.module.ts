import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { ProductCost } from '../product-costs/product-cost.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { InitSchema1708100000000 } from './migrations/1708100000000-InitSchema';
import { SeedData1708100000001 } from './migrations/1708100000001-SeedData';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'teste_pratico',
      entities: [Product, ProductCost, Order, OrderItem],
      migrations: [InitSchema1708100000000, SeedData1708100000001],
      migrationsRun: true,
      synchronize: false,
    }),
  ],
})
export class DatabaseModule { }
