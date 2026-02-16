import {
    Box,
    Button,
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Product } from '../types';

type Props = {
    products: Product[];
    loading: boolean;
    onNewProduct: () => void;
};

export default function ProductsTable({ products, loading, onNewProduct }: Props) {
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Produtos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onNewProduct}
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
    );
}
