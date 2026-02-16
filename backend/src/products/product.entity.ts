import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}
