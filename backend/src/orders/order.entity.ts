import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('order')
export class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  externalId: string;

  @Column()
  buyerName: string;

  @Column()
  buyerEmail: string;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @Column()
  createdAt: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];
}
