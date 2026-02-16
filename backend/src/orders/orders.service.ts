import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
  ) { }

  // cria pedido a partir do webhook
  async createFromWebhook(data: {
    id: string;
    externalId: string;
    buyerName: string;
    buyerEmail: string;
    totalAmount: number;
    createdAt: string;
    items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
  }) {
    const order = this.orderRepo.create({
      id: data.id,
      externalId: data.externalId,
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      totalAmount: data.totalAmount,
      createdAt: data.createdAt,
      items: data.items.map((item) =>
        this.itemRepo.create({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }),
      ),
    });

    return this.orderRepo.save(order);
  }

  // cria pedido a partir do formulario do frontend
  async createFromDto(dto: CreateOrderDto) {
    const totalAmount = dto.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );

    const order = this.orderRepo.create({
      id: randomUUID(),
      externalId: `WEB-${Date.now()}`,
      buyerName: dto.buyerName,
      buyerEmail: dto.buyerEmail,
      totalAmount: Number(totalAmount.toFixed(2)),
      createdAt: new Date().toISOString(),
      items: dto.items.map((item) =>
        this.itemRepo.create({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }),
      ),
    });

    return this.orderRepo.save(order);
  }

  async findAll() {
    const orders = await this.orderRepo.find({ relations: ['items'] });

    // converte decimais pra number
    return orders.map((o) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
      items: o.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
    }));
  }

  // busca pedidos com filtro de data
  async findFiltered(filters: { startDate?: string; endDate?: string }) {
    const allOrders = await this.findAll();

    return allOrders
      .filter((o) => {
        const date = new Date(o.createdAt);
        if (filters.startDate && date < new Date(filters.startDate)) return false;
        if (filters.endDate && date > new Date(filters.endDate)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
