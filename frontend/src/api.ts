import type { CreateOrderInput, DashboardResponse, Order, Product, ProductCostView } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function toStartOfDayIso(date: string): string {
  return `${date}T00:00:00.000Z`;
}

function toEndOfDayIso(date: string): string {
  return `${date}T23:59:59.999Z`;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getDashboard(filters: {
  startDate?: string;
  endDate?: string;
}): Promise<DashboardResponse> {
  const params = new URLSearchParams();
  if (filters.startDate) params.set('startDate', toStartOfDayIso(filters.startDate));
  if (filters.endDate) params.set('endDate', toEndOfDayIso(filters.endDate));
  const qs = params.toString();
  return apiFetch<DashboardResponse>(`/dashboard${qs ? `?${qs}` : ''}`);
}

export async function getOrders(filters: { startDate?: string; endDate?: string }): Promise<Order[]> {
  const params = new URLSearchParams();
  if (filters.startDate) params.set('startDate', toStartOfDayIso(filters.startDate));
  if (filters.endDate) params.set('endDate', toEndOfDayIso(filters.endDate));
  const qs = params.toString();
  return apiFetch<Order[]>(`/orders${qs ? `?${qs}` : ''}`);
}

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/products');
}

export async function createProduct(input: { id?: string; name: string }): Promise<Product> {
  return apiFetch<Product>('/products', { method: 'POST', body: JSON.stringify(input) });
}

export async function getProductCosts(): Promise<ProductCostView[]> {
  return apiFetch<ProductCostView[]>('/product-costs');
}

export async function updateProductCost(productId: string, cost: number): Promise<void> {
  await apiFetch(`/product-costs/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    body: JSON.stringify({ cost }),
  });
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(input) });
}
