import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { EcommerceOrderWebhookDto } from './dto/ecommerce-order-webhook.dto';
import { randomUUID } from 'node:crypto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post('orders')
  async createOrder(@Body() body: EcommerceOrderWebhookDto) {
    // mapeia o webhook pra criar o pedido
    const order = {
      id: randomUUID(),
      externalId: body.id,
      buyerName: body.buyer.buyerName,
      buyerEmail: body.buyer.buyerEmail,
      totalAmount: body.totalAmount,
      createdAt: body.createdAt,
      items: body.lineItems.map((item) => ({
        productId: item.itemId,
        productName: item.itemName,
        quantity: item.qty,
        unitPrice: item.unitPrice,
      })),
    };

    return this.ordersService.createFromWebhook(order);
  }
}
