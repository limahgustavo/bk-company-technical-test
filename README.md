# bk-company-technical-test

Dashboard de vendas feito com NestJS no backend, React no frontend e PostgreSQL como banco de dados.

## Como rodar

Precisa ter o Docker instalado. Depois é só rodar:

```bash
docker compose up --build
```

Depois de subir, acessa:
- Frontend: http://localhost:5173
- API: http://localhost:3000
- Documentação da API (Swagger): http://localhost:3000/docs

## Estrutura do projeto

```
├── backend/           -> API feita com NestJS
├── frontend/          -> Interface feita com React + Vite
├── docker-compose.yml -> Sobe tudo junto (banco, api, front)
└── README.md
```

## Backend

Feito com **NestJS** e **TypeORM** pra se comunicar com o PostgreSQL.

### Pastas e arquivos principais

- `src/main.ts` - Arquivo que inicia a aplicação
- `src/app.module.ts` - Módulo principal que junta todos os outros
- `src/database/` - Configuração do banco e as migrations
  - `migrations/` - Scripts que criam as tabelas e inserem dados de teste
- `src/products/` - Tudo sobre produtos (entity, service, controller)
- `src/product-costs/` - Custos dos produtos
- `src/orders/` - Pedidos (criar, listar, filtrar por data)
- `src/dashboard/` - Retorna os dados do dashboard (lucro, faturamento, etc)
- `src/webhooks/` - Recebe pedidos de sistemas externos

### Endpoints da API

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | /dashboard | Retorna lucro, faturamento, custo e total de pedidos |
| GET | /products | Lista todos os produtos |
| POST | /products | Cria um produto novo |
| GET | /product-costs | Lista produtos com seus custos |
| PUT | /product-costs/:id | Atualiza o custo de um produto |
| GET | /orders | Lista os pedidos (aceita filtro de data) |
| POST | /orders | Cria um pedido novo |
| POST | /webhooks/orders | Recebe pedido de e-commerce externo |

### Tabelas do banco

- **product** - id, name
- **product_cost** - productId, cost
- **order** - id, externalId, buyerName, buyerEmail, totalAmount, createdAt
- **order_item** - id, orderId, productId, productName, quantity, unitPrice

A tabela `order_item` tem uma FK pra `order` (cascade delete).

### Migrations

Quando o backend sobe ele roda as migrations automaticamente:
1. `InitSchema` - Cria as 4 tabelas
2. `SeedData` - Insere dados de teste (5 produtos com custos e 3 pedidos)

## Frontend

Feito com **React**, **Vite** e **Material UI**.

### Arquivos

- `src/App.tsx` - Componente principal com todas as seções da página
- `src/api.ts` - Funções que chamam a API do backend
- `src/types.ts` - Tipos TypeScript
- `src/main.tsx` - Entry point

### O que tem na tela

- **Cards do dashboard** - Mostra lucro, faturamento, custo total e quantidade de pedidos
- **Filtro por data** - Filtra os pedidos e o dashboard por período
- **Tabela de pedidos** - Lista os pedidos, clica pra expandir e ver os itens
- **Botão "Fazer Pedido"** - Abre um dialog pra criar pedido novo (seleciona produto, quantidade e preço)
- **Tabela de produtos** - Lista os produtos cadastrados e permite criar novos
- **Tabela de custos** - Mostra o custo de cada produto e permite editar inline

## Tecnologias usadas

- NestJS
- TypeORM
- PostgreSQL
- React
- Vite
- Material UI (MUI)
- Docker / Docker Compose
