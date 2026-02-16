import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCost } from './product-cost.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductCostsService {
  constructor(
    @InjectRepository(ProductCost)
    private readonly costRepo: Repository<ProductCost>,
    private readonly productsService: ProductsService,
  ) { }

  async upsert(productId: string, cost: number) {
    const product = await this.productsService.findById(productId);
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    // salva ou atualiza o custo
    await this.costRepo.upsert({ productId, cost }, ['productId']);
    return { productId, cost };
  }

  async findAllView() {
    const products = await this.productsService.findAll();
    const result: { productId: string; productName: string; cost: number | null }[] = [];

    for (const p of products) {
      const costEntry = await this.costRepo.findOneBy({ productId: p.id });
      result.push({
        productId: p.id,
        productName: p.name,
        cost: costEntry ? Number(costEntry.cost) : null,
      });
    }

    return result;
  }

  async findByProductId(productId: string) {
    const entry = await this.costRepo.findOneBy({ productId });
    if (!entry) return null;
    return { productId: entry.productId, cost: Number(entry.cost) };
  }
}
