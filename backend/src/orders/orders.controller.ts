import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.createFromDto(body);
  }

  @Get()
  findAll(@Query() query: OrdersQueryDto) {
    return this.ordersService.findFiltered(query);
  }
}
