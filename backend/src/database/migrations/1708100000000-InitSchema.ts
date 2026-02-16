import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1708100000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product" (
        "id" varchar PRIMARY KEY,
        "name" varchar NOT NULL
      )
    `);

        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product_cost" (
        "productId" varchar PRIMARY KEY,
        "cost" decimal(12,2) NOT NULL DEFAULT 0
      )
    `);

        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order" (
        "id" varchar PRIMARY KEY,
        "externalId" varchar NOT NULL,
        "buyerName" varchar NOT NULL,
        "buyerEmail" varchar NOT NULL,
        "totalAmount" decimal(12,2) NOT NULL,
        "createdAt" varchar NOT NULL
      )
    `);

        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order_item" (
        "id" SERIAL PRIMARY KEY,
        "orderId" varchar NOT NULL,
        "productId" varchar NOT NULL,
        "productName" varchar NOT NULL,
        "quantity" int NOT NULL,
        "unitPrice" decimal(12,2) NOT NULL,
        CONSTRAINT "FK_order_item_order" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "order_item"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "order"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_cost"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product"`);
    }
}
