import { Body, Controller, Get, Param, Put, Post } from '@nestjs/common';
import { SetProductCostDto } from './dto/set-product-cost.dto';
import { UpdateProductCostDto } from './dto/update-product-cost.dto';
import { ProductCostsService } from './product-costs.service';

@Controller('product-costs')
export class ProductCostsController {
  constructor(private readonly productCostsService: ProductCostsService) { }

  @Post()
  upsert(@Body() body: SetProductCostDto) {
    return this.productCostsService.upsert(body.productId, body.cost);
  }

  @Put(':productId')
  update(@Param('productId') productId: string, @Body() body: UpdateProductCostDto) {
    return this.productCostsService.upsert(productId, body.cost);
  }

  @Get()
  findAllView() {
    return this.productCostsService.findAllView();
  }
}
