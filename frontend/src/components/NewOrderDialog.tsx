import { useMemo, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { formatMoney } from '../utils';
import type { CreateOrderItemInput, Product } from '../types';

type Props = {
    open: boolean;
    loading: boolean;
    products: Product[];
    onClose: () => void;
    onSubmit: (data: { buyerName: string; buyerEmail: string; items: CreateOrderItemInput[] }) => Promise<void>;
};

export default function NewOrderDialog({ open, loading, products, onClose, onSubmit }: Props) {
    const [buyerName, setBuyerName] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [items, setItems] = useState<CreateOrderItemInput[]>([
        { productId: '', productName: '', quantity: 1, unitPrice: 0 },
    ]);

    function handleClose() {
        setBuyerName('');
        setBuyerEmail('');
        setItems([{ productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
        onClose();
    }

    function updateItem(index: number, partial: Partial<CreateOrderItemInput>) {
        setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...partial } : item)));
    }

    function addItem() {
        setItems((prev) => [...prev, { productId: '', productName: '', quantity: 1, unitPrice: 0 }]);
    }

    function removeItem(index: number) {
        setItems((prev) => prev.filter((_, i) => i !== index));
    }

    const total = useMemo(
        () => items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
        [items],
    );

    const canSubmit =
        buyerName.trim() !== '' &&
        buyerEmail.trim() !== '' &&
        items.length > 0 &&
        items.every((item) => item.productId && item.quantity >= 1 && item.unitPrice >= 0);

    async function handleSubmit() {
        await onSubmit({
            buyerName: buyerName.trim(),
            buyerEmail: buyerEmail.trim(),
            items: items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            })),
        });
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Fazer Pedido</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Nome do Comprador"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Email do Comprador"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                            type="email"
                            fullWidth
                        />
                    </Stack>

                    <Typography variant="subtitle2" fontWeight={700}>
                        Itens do Pedido
                    </Typography>

                    {items.map((item, index) => (
                        <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(option) => `${option.name} (${option.id})`}
                                value={products.find((p) => p.id === item.productId) ?? null}
                                onChange={(_, selected) => {
                                    if (selected) {
                                        updateItem(index, { productId: selected.id, productName: selected.name });
                                    } else {
                                        updateItem(index, { productId: '', productName: '' });
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
                                onChange={(e) => updateItem(index, { quantity: Math.max(1, Number(e.target.value)) })}
                                size="small"
                                sx={{ width: 90 }}
                            />
                            <TextField
                                label="Preço Unit."
                                type="number"
                                inputProps={{ min: 0, step: '0.01' }}
                                value={item.unitPrice}
                                onChange={(e) => updateItem(index, { unitPrice: Math.max(0, Number(e.target.value)) })}
                                size="small"
                                sx={{ width: 120 }}
                            />
                            <Typography variant="body2" sx={{ width: 100, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                {formatMoney(item.unitPrice * item.quantity)}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => removeItem(index)}
                                disabled={items.length <= 1}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="small" startIcon={<AddIcon />} onClick={addItem}>
                            Adicionar Item
                        </Button>
                        <Typography fontWeight={700}>Total: {formatMoney(total)}</Typography>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={() => void handleSubmit()}
                    disabled={loading || !canSubmit}
                    startIcon={<ShoppingCartIcon />}
                >
                    Confirmar Pedido
                </Button>
            </DialogActions>
        </Dialog>
    );
}
