import { Fragment, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatMoney, formatDate } from '../utils';
import type { Order } from '../types';

type Props = {
    orders: Order[];
    loading: boolean;
    onNewOrder: () => void;
};

export default function OrdersTable({ orders, loading, onNewOrder }: Props) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    function toggle(orderId: string) {
        setExpanded((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    }

    return (
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
                        onClick={onNewOrder}
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
                                    const open = Boolean(expanded[order.id]);
                                    return (
                                        <Fragment key={order.id}>
                                            <TableRow hover>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => toggle(order.id)}>
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
    );
}
