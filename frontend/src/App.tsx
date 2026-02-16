import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  createOrder,
  createProduct,
  getDashboard,
  getOrders,
  getProductCosts,
  getProducts,
  updateProductCost,
} from './api';
import type {
  CreateOrderItemInput,
  DashboardResponse,
  Order,
  Product,
  ProductCostView,
} from './types';

function formatMoney(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR');
}

export default function App() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productCosts, setProductCosts] = useState<ProductCostView[]>([]);

  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [productIdDraft, setProductIdDraft] = useState('');
  const [productNameDraft, setProductNameDraft] = useState('');

  const [editingCostProductId, setEditingCostProductId] = useState<string | null>(null);
  const [editingCostValue, setEditingCostValue] = useState<string>('');

  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // ── Fazer Pedido ──
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderBuyerName, setOrderBuyerName] = useState('');
  const [orderBuyerEmail, setOrderBuyerEmail] = useState('');
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([
    { productId: '', productName: '', quantity: 1, unitPrice: 0 },
  ]);

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

  async function handleCreateProduct() {
    setLoading(true);
    setError(null);
    try {
      await createProduct({
        id: productIdDraft.trim() || undefined,
        name: productNameDraft.trim(),
      });
      setCreateProductOpen(false);
      setProductIdDraft('');
      setProductNameDraft('');
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function startEditingCost(row: ProductCostView) {
    setEditingCostProductId(row.productId);
    setEditingCostValue(row.cost === null ? '' : String(row.cost));
  }

  function stopEditingCost() {
    setEditingCostProductId(null);
    setEditingCostValue('');
  }

  async function handleSaveCost(productId: string) {
    setLoading(true);
    setError(null);
    try {
      const raw = editingCostValue ?? '';
      const value = raw.trim() === '' ? 0 : Number(raw);
      if (Number.isNaN(value) || value < 0) {
        setError('Custo inválido.');
        return;
      }
      await updateProductCost(productId, value);
      const pc = await getProductCosts();
      setProductCosts(pc);
      const d = await getDashboard(filters);
      setDashboard(d);
      stopEditingCost();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  function toggleOrderExpanded(orderId: string) {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  }

  // ── Order dialog helpers ──
  function openOrderDialog() {
    setOrderBuyerName('');
    setOrderBuyerEmail('');
    setOrderItems([{ productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
    setOrderDialogOpen(true);
  }

  function updateOrderItem(index: number, partial: Partial<CreateOrderItemInput>) {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  }

  function addOrderItem() {
    setOrderItems((prev) => [
      ...prev,
      { productId: '', productName: '', quantity: 1, unitPrice: 0 },
    ]);
  }

  function removeOrderItem(index: number) {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  }

  const orderTotal = useMemo(
    () => orderItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [orderItems],
  );

  const canSubmitOrder =
    orderBuyerName.trim() !== '' &&
    orderBuyerEmail.trim() !== '' &&
    orderItems.length > 0 &&
    orderItems.every((item) => item.productId && item.quantity >= 1 && item.unitPrice >= 0);

  async function handleCreateOrder() {
    setLoading(true);
    setError(null);
    try {
      await createOrder({
        buyerName: orderBuyerName.trim(),
        buyerEmail: orderBuyerEmail.trim(),
        items: orderItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
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

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Lucro
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {dashboard ? formatMoney(dashboard.profit) : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Faturamento
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {dashboard ? formatMoney(dashboard.revenue) : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Custo Total
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {dashboard ? formatMoney(dashboard.costTotal) : '-'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 220px', minWidth: 220 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Total de Pedidos
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {dashboard?.ordersCount ?? '-'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* ── Pedidos ── */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Pedidos Recentes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Últimos pedidos recebidos
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={openOrderDialog}
                disabled={loading}
              >
                Fazer Pedido
              </Button>
            </Box>

            {orders.length === 0 ? (
              <Typography sx={{ mt: 2 }} color="text.secondary">
                Nenhum pedido no período.
              </Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 56 }} />
                      <TableCell>Pedido</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell align="right">Data</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => {
                      const open = Boolean(expandedOrders[order.id]);
                      return (
                        <Fragment key={order.id}>
                          <TableRow hover>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => toggleOrderExpanded(order.id)}
                                aria-label="Detalhes"
                              >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={700}>{order.externalId}</Typography>
                            </TableCell>
                            <TableCell>{order.buyerName}</TableCell>
                            <TableCell align="right">{formatDate(order.createdAt)}</TableCell>
                            <TableCell align="right">{formatMoney(order.totalAmount)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ py: 0 }} colSpan={5}>
                              <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 2 }}>
                                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                    Itens do pedido
                                  </Typography>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Produto</TableCell>
                                        <TableCell align="right">Qtd</TableCell>
                                        <TableCell align="right">Preço unitário</TableCell>
                                        <TableCell align="right">Subtotal</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {order.items.map((item) => (
                                        <TableRow key={`${order.id}-${item.productId}`}>
                                          <TableCell>
                                            <Typography fontWeight={600}>{item.productName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                              {item.productId}
                                            </Typography>
                                          </TableCell>
                                          <TableCell align="right">{item.quantity}</TableCell>
                                          <TableCell align="right">{formatMoney(item.unitPrice)}</TableCell>
                                          <TableCell align="right">
                                            {formatMoney(item.unitPrice * item.quantity)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Email: {order.buyerEmail}
                                  </Typography>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* ── Produtos ── */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Produtos
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateProductOpen(true)}
                disabled={loading}
              >
                Novo
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">SKU</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography color="text.secondary">Nenhum produto cadastrado.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Typography fontWeight={600}>{p.name}</Typography>
                        </TableCell>
                        <TableCell align="right">{p.id}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* ── Custos ── */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700}>
              Custos de Produto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Edite diretamente o custo associado a cada produto
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Custo</TableCell>
                    <TableCell align="right" sx={{ width: 64 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productCosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography color="text.secondary">
                          Cadastre produtos para poder definir custos.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    productCosts.map((row) => {
                      const isEditing = editingCostProductId === row.productId;
                      return (
                        <TableRow key={row.productId} hover>
                          <TableCell>
                            <Typography fontWeight={600}>{row.productName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {row.productId}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {isEditing ? (
                              <TextField
                                value={editingCostValue}
                                onChange={(e) => setEditingCostValue(e.target.value)}
                                type="number"
                                inputProps={{ min: 0, step: '0.01' }}
                                size="small"
                                sx={{ maxWidth: 160 }}
                              />
                            ) : row.cost === null ? (
                              <Typography color="text.secondary">—</Typography>
                            ) : (
                              <Typography>{formatMoney(row.cost)}</Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {isEditing ? (
                              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                <IconButton
                                  size="small"
                                  onClick={() => void handleSaveCost(row.productId)}
                                  disabled={loading}
                                  aria-label="Salvar"
                                >
                                  <SaveIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => stopEditingCost()}
                                  disabled={loading}
                                  aria-label="Cancelar"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Stack>
                            ) : (
                              <IconButton
                                size="small"
                                onClick={() => startEditingCost(row)}
                                disabled={loading}
                                aria-label="Editar"
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* ── Dialog: Novo Produto ── */}
      <Dialog open={createProductOpen} onClose={() => setCreateProductOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo produto</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="SKU (opcional)"
              value={productIdDraft}
              onChange={(e) => setProductIdDraft(e.target.value)}
              fullWidth
            />
            <TextField
              label="Nome"
              value={productNameDraft}
              onChange={(e) => setProductNameDraft(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateProductOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleCreateProduct()}
            disabled={loading || productNameDraft.trim() === ''}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Fazer Pedido ── */}
      <Dialog open={orderDialogOpen} onClose={() => setOrderDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Fazer Pedido</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Nome do Comprador"
                value={orderBuyerName}
                onChange={(e) => setOrderBuyerName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email do Comprador"
                value={orderBuyerEmail}
                onChange={(e) => setOrderBuyerEmail(e.target.value)}
                type="email"
                fullWidth
              />
            </Stack>

            <Typography variant="subtitle2" fontWeight={700}>
              Itens do Pedido
            </Typography>

            {orderItems.map((item, index) => (
              <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) => `${option.name} (${option.id})`}
                  value={products.find((p) => p.id === item.productId) ?? null}
                  onChange={(_, selected) => {
                    if (selected) {
                      updateOrderItem(index, {
                        productId: selected.id,
                        productName: selected.name,
                      });
                    } else {
                      updateOrderItem(index, { productId: '', productName: '' });
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="Produto" size="small" />}
                  sx={{ flex: 2, minWidth: 200 }}
                  size="small"
                />
                <TextField
                  label="Qtd"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={item.quantity}
                  onChange={(e) => updateOrderItem(index, { quantity: Math.max(1, Number(e.target.value)) })}
                  size="small"
                  sx={{ width: 90 }}
                />
                <TextField
                  label="Preço Unit."
                  type="number"
                  inputProps={{ min: 0, step: '0.01' }}
                  value={item.unitPrice}
                  onChange={(e) => updateOrderItem(index, { unitPrice: Math.max(0, Number(e.target.value)) })}
                  size="small"
                  sx={{ width: 120 }}
                />
                <Typography variant="body2" sx={{ width: 100, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {formatMoney(item.unitPrice * item.quantity)}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeOrderItem(index)}
                  disabled={orderItems.length <= 1}
                  aria-label="Remover item"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button size="small" startIcon={<AddIcon />} onClick={addOrderItem}>
                Adicionar Item
              </Button>
              <Typography fontWeight={700}>Total: {formatMoney(orderTotal)}</Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleCreateOrder()}
            disabled={loading || !canSubmitOrder}
            startIcon={<ShoppingCartIcon />}
          >
            Confirmar Pedido
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
