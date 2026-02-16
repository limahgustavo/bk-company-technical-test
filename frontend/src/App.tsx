import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createOrder,
  createProduct,
  getDashboard,
  getOrders,
  getProductCosts,
  getProducts,
  updateProductCost,
} from './api';
import type { DashboardResponse, Order, Product, ProductCostView } from './types';

// componentes
import DashboardCards from './components/DashboardCards';
import OrdersTable from './components/OrdersTable';
import ProductsTable from './components/ProductsTable';
import ProductCostsTable from './components/ProductCostsTable';
import NewProductDialog from './components/NewProductDialog';
import NewOrderDialog from './components/NewOrderDialog';

export default function App() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productCosts, setProductCosts] = useState<ProductCostView[]>([]);

  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [startDate, endDate],
  );

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, o, p, pc] = await Promise.all([
        getDashboard(filters),
        getOrders(filters),
        getProducts(),
        getProductCosts(),
      ]);
      setDashboard(d);
      setOrders(o);
      setProducts(p);
      setProductCosts(pc);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  // salva um produto novo
  async function handleCreateProduct(data: { id?: string; name: string }) {
    setLoading(true);
    setError(null);
    try {
      await createProduct(data);
      setCreateProductOpen(false);
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  // salva custo de um produto
  async function handleSaveCost(productId: string, cost: number) {
    setLoading(true);
    setError(null);
    try {
      await updateProductCost(productId, cost);
      const pc = await getProductCosts();
      setProductCosts(pc);
      const d = await getDashboard(filters);
      setDashboard(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  // cria um pedido novo
  async function handleCreateOrder(data: { buyerName: string; buyerEmail: string; items: any[] }) {
    setLoading(true);
    setError(null);
    try {
      await createOrder(data);
      setOrderDialogOpen(false);
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ py: 4, px: { xs: 2, md: 4 }, minHeight: '100vh', width: '100%' }}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visão geral da sua loja
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
            <DatePicker
              label="Data Inicial"
              value={startDate ? dayjs(startDate) : null}
              onChange={(value) => setStartDate(value ? value.format('YYYY-MM-DD') : '')}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="Data Final"
              value={endDate ? dayjs(endDate) : null}
              onChange={(value) => setEndDate(value ? value.format('YYYY-MM-DD') : '')}
              slotProps={{ textField: { size: 'small' } }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => void refreshAll()}
              disabled={loading}
            >
              Filtrar
            </Button>
          </Stack>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <DashboardCards dashboard={dashboard} />

        <OrdersTable
          orders={orders}
          loading={loading}
          onNewOrder={() => setOrderDialogOpen(true)}
        />

        <ProductsTable
          products={products}
          loading={loading}
          onNewProduct={() => setCreateProductOpen(true)}
        />

        <ProductCostsTable
          productCosts={productCosts}
          loading={loading}
          onSaveCost={handleSaveCost}
        />
      </Stack>

      <NewProductDialog
        open={createProductOpen}
        loading={loading}
        onClose={() => setCreateProductOpen(false)}
        onSave={handleCreateProduct}
      />

      <NewOrderDialog
        open={orderDialogOpen}
        loading={loading}
        products={products}
        onClose={() => setOrderDialogOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </Container>
  );
}
