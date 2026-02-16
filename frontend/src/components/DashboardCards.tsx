import { Box, Card, CardContent, Typography } from '@mui/material';
import { formatMoney } from '../utils';
import type { DashboardResponse } from '../types';

type Props = {
    dashboard: DashboardResponse | null;
};

export default function DashboardCards({ dashboard }: Props) {
    return (
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
    );
}
