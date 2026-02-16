export type DashboardResponse = {
  ordersCount: number;
  revenue: number;
  costTotal: number;
  profit: number;
};

export type Product = {
  id: string;
  name: string;
};

export type ProductCostView = {
  productId: string;
  productName: string;
  cost: number | null;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  externalId: string;
  buyerName: string;
  buyerEmail: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

export type CreateOrderItemInput = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type CreateOrderInput = {
  buyerName: string;
  buyerEmail: string;
  items: CreateOrderItemInput[];
};
