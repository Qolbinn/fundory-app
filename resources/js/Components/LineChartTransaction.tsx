'use client';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    type ChartConfig,
} from '@/Components/ui/chart';

export const description = 'A line chart';

// Interface Data Prop
interface ChartData {
    month: string;
    amount: number;
    full_date?: string;
}

// Config Warna & Label
const chartConfig = {
    amount: {
        label: 'Pengeluaran',
        color: 'hsl(217 91% 60%)', // Biru
    },
} satisfies ChartConfig;

export function LineChartTransaction({ data }: { data: ChartData[] }) {
    // Helper Format Rupiah
    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <CardTitle>Tren Pengeluaran</CardTitle>
                <CardDescription>
                    {data.length > 0
                        ? `${data[0].month} - ${data[data.length - 1].month}`
                        : 'No Data'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="max-h-[300px] w-full"
                >
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />

                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            // Tampilkan slice 3 huruf pertama jika nama bulan panjang
                            // Tapi karena controller kirim "Jan 24", ini aman.
                            tickFormatter={(value) => value}
                        />

                        {/* Custom Tooltip untuk Rupiah */}
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload;
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="text-[0.70rem] uppercase text-muted-foreground">
                                                {item.full_date || item.month}
                                            </div>
                                            <div className="font-bold text-primary">
                                                {formatRupiah(item.amount)}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Line
                            dataKey="amount" // Sesuai key dari Controller
                            type="monotone" // 'natural' kadang terlalu melengkung aneh di 0
                            stroke="var(--color-amount)"
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: 'var(--color-amount)',
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
