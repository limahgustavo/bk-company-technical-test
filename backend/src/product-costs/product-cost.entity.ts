import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('product_cost')
export class ProductCost {
  @PrimaryColumn()
  productId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  cost: number;
}
