import { useState } from 'react';
import {
    Card,
    CardContent,
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
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { formatMoney } from '../utils';
import type { ProductCostView } from '../types';

type Props = {
    productCosts: ProductCostView[];
    loading: boolean;
    onSaveCost: (productId: string, cost: number) => Promise<void>;
};

export default function ProductCostsTable({ productCosts, loading, onSaveCost }: Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');

    function startEditing(row: ProductCostView) {
        setEditingId(row.productId);
        setEditingValue(row.cost === null ? '' : String(row.cost));
    }

    function stopEditing() {
        setEditingId(null);
        setEditingValue('');
    }

    async function handleSave(productId: string) {
        const value = editingValue.trim() === '' ? 0 : Number(editingValue);
        if (Number.isNaN(value) || value < 0) return;
        await onSaveCost(productId, value);
        stopEditing();
    }

    return (
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
                                    const isEditing = editingId === row.productId;
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
                                                        value={editingValue}
                                                        onChange={(e) => setEditingValue(e.target.value)}
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
                                                            onClick={() => void handleSave(row.productId)}
                                                            disabled={loading}
                                                        >
                                                            <SaveIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={stopEditing}
                                                            disabled={loading}
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Stack>
                                                ) : (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => startEditing(row)}
                                                        disabled={loading}
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
    );
}
