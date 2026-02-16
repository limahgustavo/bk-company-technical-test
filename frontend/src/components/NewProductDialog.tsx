import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';

type Props = {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onSave: (data: { id?: string; name: string }) => Promise<void>;
};

export default function NewProductDialog({ open, loading, onClose, onSave }: Props) {
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');

    function handleClose() {
        setSku('');
        setName('');
        onClose();
    }

    async function handleSave() {
        await onSave({ id: sku.trim() || undefined, name: name.trim() });
        setSku('');
        setName('');
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Novo produto</DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="SKU (opcional)"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={() => void handleSave()}
                    disabled={loading || name.trim() === ''}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
