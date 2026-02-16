import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) { }

  async create(input: { id?: string; name: string }) {
    const id = input.id || randomUUID();

    // verifica se ja existe
    const existing = await this.productsRepo.findOneBy({ id });
    if (existing) {
      throw new ConflictException('Produto com este id já existe.');
    }

    const product = this.productsRepo.create({ id, name: input.name });
    return this.productsRepo.save(product);
  }

  async findAll() {
    return this.productsRepo.find();
  }

  async findById(id: string) {
    return this.productsRepo.findOneBy({ id });
  }
}
