// 'use client';

// import * as React from 'react';
// import { Label, Pie, PieChart } from 'recharts';

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     // CardFooter,
//     CardHeader,
//     CardTitle,
// } from '@/Components/ui/card';
// import {
//     ChartContainer,
//     ChartLegend,
//     ChartLegendContent,
//     ChartTooltip,
//     ChartTooltipContent,
//     type ChartConfig,
// } from '@/Components/ui/chart';
// // import { Field, FieldLabel } from './ui/field';
// // import { Progress } from './ui/progress';

// export const description = 'A donut chart with text';

// const chartData = [
//     { browser: 'chrome', visitors: 275, fill: 'hsl(217 91% 60%)' }, // blue
//     { browser: 'safari', visitors: 200, fill: 'hsl(160 84% 39%)' }, // green
//     { browser: 'firefox', visitors: 187, fill: 'hsl(24 94% 50%)' }, // orange
//     { browser: 'edge', visitors: 173, fill: 'hsl(199 89% 48%)' }, // cyan
//     { browser: 'other', visitors: 90, fill: 'hsl(240 5% 65%)' }, // gray
// ];

// const chartConfig = {
//     visitors: {
//         label: 'Visitors',
//     },
//     chrome: {
//         label: 'Chrome',
//         color: 'var(--chart-1)',
//     },
//     safari: {
//         label: 'Safari',
//         color: 'var(--chart-2)',
//     },
//     firefox: {
//         label: 'Firefox',
//         color: 'var(--chart-3)',
//     },
//     edge: {
//         label: 'Edge',
//         color: 'var(--chart-4)',
//     },
//     other: {
//         label: 'Other',
//         color: 'var(--chart-5)',
//     },
// } satisfies ChartConfig;

// export function DonutChartCategory() {
//     const totalVisitors = React.useMemo(() => {
//         return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
//     }, []);

//     return (
//         <Card className="flex flex-col">
//             <CardHeader className="items-center pb-0">
//                 <CardTitle>Pie Chart - Donut with Text</CardTitle>
//                 <CardDescription>January - June 2024</CardDescription>
//             </CardHeader>
//             <CardContent className="flex-1 pb-0">
//                 <ChartContainer
//                     config={chartConfig}
//                     className="mx-auto aspect-square max-h-[250px]"
//                 >
//                     <PieChart>
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent hideLabel />}
//                         />
//                         <Pie
//                             data={chartData}
//                             dataKey="visitors"
//                             nameKey="browser"
//                             innerRadius={60}
//                             strokeWidth={5}
//                         >
//                             <Label
//                                 content={({ viewBox }) => {
//                                     if (
//                                         viewBox &&
//                                         'cx' in viewBox &&
//                                         'cy' in viewBox
//                                     ) {
//                                         return (
//                                             <text
//                                                 x={viewBox.cx}
//                                                 y={viewBox.cy}
//                                                 textAnchor="middle"
//                                                 dominantBaseline="middle"
//                                             >
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={viewBox.cy}
//                                                     className="fill-foreground text-3xl font-bold"
//                                                 >
//                                                     {totalVisitors.toLocaleString()}
//                                                 </tspan>
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={(viewBox.cy || 0) + 24}
//                                                     className="fill-muted-foreground"
//                                                 >
//                                                     Visitors
//                                                 </tspan>
//                                             </text>
//                                         );
//                                     }
//                                 }}
//                             />
//                         </Pie>
//                         <ChartLegend
//                             content={<ChartLegendContent nameKey="browser" />}
//                             className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
//                         />
//                     </PieChart>
//                 </ChartContainer>

//             </CardContent>
//         </Card>
//     );
// }

'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
} from '@/Components/ui/chart';

// Definisikan Tipe Data dari Backend
interface ChartData {
    name: string;
    amount: number;
    count: number;
    fill: string;
}

interface DonutChartProps {
    data: ChartData[];
}

export function DonutChartCategory({ data }: DonutChartProps) {
    // 1. Hitung Total Amount untuk Label Tengah
    const totalAmount = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.amount, 0);
    }, [data]);

    // 2. Generate Chart Config secara Dinamis
    // Shadcn Chart butuh config mapping untuk label & warna Legend
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            amount: { label: 'Total' },
        };
        data.forEach((item, index) => {
            // Kita gunakan nama kategori sebagai key config
            // Ganti spasi dengan underscore biar aman jadi key object
            const key = item.name.replace(/\s+/g, '_');
            config[key] = {
                label: item.name,
                color: item.fill,
            };
        });
        return config;
    }, [data]);

    // Helper untuk format Rupiah
    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pengeluaran per Kategori</CardTitle>
                <CardDescription>Berdasarkan filter tanggal</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload;
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.fill,
                                                    }}
                                                />
                                                <span className="text-sm font-medium">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex flex-col gap-1">
                                                <span className="text-lg font-bold">
                                                    {formatRupiah(item.amount)}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {item.count} transaksi
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Pie
                            data={data}
                            dataKey="amount" // Nilai Slice berdasarkan Amount
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        'cx' in viewBox &&
                                        'cy' in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    {/* Format Ringkas (Misal: 1.5jt) */}
                                                    {new Intl.NumberFormat(
                                                        'id-ID',
                                                        {
                                                            notation: 'compact',
                                                            maximumFractionDigits: 1,
                                                        },
                                                    ).format(totalAmount)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-xs"
                                                >
                                                    Pengeluaran
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                        {/* Legend menggunakan config dinamis yg kita buat */}
                        <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
