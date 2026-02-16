import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { ProductCostsService } from '../product-costs/product-costs.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productCostsService: ProductCostsService,
  ) { }

  async getDashboard(filters: { startDate?: string; endDate?: string }) {
    const orders = await this.ordersService.findFiltered(filters);

    const revenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

    // calcula custo total
    let costTotal = 0;
    for (const order of orders) {
      for (const item of order.items) {
        const cost = await this.productCostsService.findByProductId(item.productId);
        if (cost) {
          costTotal += cost.cost * item.quantity;
        }
      }
    }

    const profit = revenue - costTotal;

    return {
      ordersCount: orders.length,
      revenue: Number(revenue.toFixed(2)),
      costTotal: Number(costTotal.toFixed(2)),
      profit: Number(profit.toFixed(2)),
    };
  }
}
