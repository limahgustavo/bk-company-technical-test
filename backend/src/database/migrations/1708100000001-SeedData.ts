import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedData1708100000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Produtos ──
        await queryRunner.query(`
      INSERT INTO "product" ("id", "name") VALUES
        ('P-001', 'Camiseta Básica'),
        ('P-002', 'Caneca Personalizada'),
        ('P-003', 'Adesivo Logo'),
        ('P-004', 'Boné Snapback'),
        ('P-005', 'Chaveiro Metal')
      ON CONFLICT ("id") DO NOTHING
    `);

        // ── Custos ──
        await queryRunner.query(`
      INSERT INTO "product_cost" ("productId", "cost") VALUES
        ('P-001', 20.00),
        ('P-002', 8.50),
        ('P-003', 1.20),
        ('P-004', 15.00),
        ('P-005', 3.00)
      ON CONFLICT ("productId") DO NOTHING
    `);

        // ── Pedido 1: Maria comprou 2 Camisetas + 1 Caneca ──
        await queryRunner.query(`
      INSERT INTO "order" ("id", "externalId", "buyerName", "buyerEmail", "totalAmount", "createdAt")
      VALUES ('seed-order-1', 'ORD-10001', 'Maria Souza', 'maria@email.com', 119.70, '2025-02-10T14:32:00Z')
      ON CONFLICT ("id") DO NOTHING
    `);
        await queryRunner.query(`
      INSERT INTO "order_item" ("orderId", "productId", "productName", "quantity", "unitPrice")
      VALUES
        ('seed-order-1', 'P-001', 'Camiseta Básica', 2, 49.90),
        ('seed-order-1', 'P-002', 'Caneca Personalizada', 1, 19.90)
      ON CONFLICT DO NOTHING
    `);

        // ── Pedido 2: João comprou 5 Adesivos + 1 Boné ──
        await queryRunner.query(`
      INSERT INTO "order" ("id", "externalId", "buyerName", "buyerEmail", "totalAmount", "createdAt")
      VALUES ('seed-order-2', 'ORD-10002', 'João Silva', 'joao@email.com', 54.25, '2025-02-11T09:15:00Z')
      ON CONFLICT ("id") DO NOTHING
    `);
        await queryRunner.query(`
      INSERT INTO "order_item" ("orderId", "productId", "productName", "quantity", "unitPrice")
      VALUES
        ('seed-order-2', 'P-003', 'Adesivo Logo', 5, 4.85),
        ('seed-order-2', 'P-004', 'Boné Snapback', 1, 30.00)
      ON CONFLICT DO NOTHING
    `);

        // ── Pedido 3: Ana comprou 3 Chaveiros + 1 Camiseta ──
        await queryRunner.query(`
      INSERT INTO "order" ("id", "externalId", "buyerName", "buyerEmail", "totalAmount", "createdAt")
      VALUES ('seed-order-3', 'ORD-10003', 'Ana Costa', 'ana@email.com', 74.60, '2025-02-12T16:45:00Z')
      ON CONFLICT ("id") DO NOTHING
    `);
        await queryRunner.query(`
      INSERT INTO "order_item" ("orderId", "productId", "productName", "quantity", "unitPrice")
      VALUES
        ('seed-order-3', 'P-005', 'Chaveiro Metal', 3, 8.20),
        ('seed-order-3', 'P-001', 'Camiseta Básica', 1, 49.90)
      ON CONFLICT DO NOTHING
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "order_item" WHERE "orderId" IN ('seed-order-1','seed-order-2','seed-order-3')`);
        await queryRunner.query(`DELETE FROM "order" WHERE "id" IN ('seed-order-1','seed-order-2','seed-order-3')`);
        await queryRunner.query(`DELETE FROM "product_cost" WHERE "productId" IN ('P-001','P-002','P-003','P-004','P-005')`);
        await queryRunner.query(`DELETE FROM "product" WHERE "id" IN ('P-001','P-002','P-003','P-004','P-005')`);
    }
}
