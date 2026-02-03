import { BudgetCard } from '@/Components/BudgetRealizationCard';
import { DonutChartCategory } from '@/Components/DonutChartCategory';
import { LineChartTransaction } from '@/Components/LineChartTransaction';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Deferred, Head, Link } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';

interface OperationalDashboardProps {
    metrics: {
        balance: number;
        total_expense: number;
        total_transactions: number;
    };
    expense_pie_chart: any[];
    expense_line_chart: any[];
    budget_realization: any[];
    recent_transactions: any[];
}

export default function OperationalDashboard({
    metrics,
    expense_pie_chart,
    expense_line_chart,
    budget_realization,
    recent_transactions,
}: OperationalDashboardProps) {
    // { user }: DashboardProps
    return (
        <DashboardLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Operational
                </h2>
            }
            enableDateFilter={true}
        >
            <Head title="Dashboard" />

            <section className="grid gap-4 md:grid-cols-12">
                <Card className="md:col-span-4">
                    <CardHeader>
                        <CardTitle>Sisa Saldo</CardTitle>
                        <CardDescription>
                            Rp {metrics.balance.toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>

                <div className="grid grid-cols-3 gap-4 md:col-span-8">
                    <Card className="">
                        <CardHeader>
                            <CardTitle>Total Pengeluaran</CardTitle>
                            <CardDescription>lorem ipsum</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Rp {metrics.total_expense.toLocaleString()}</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end border-t border-border p-0">
                            <Link
                                href={route('operational.transaction')}
                                className="flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                View more <ArrowRightIcon />
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card className="">
                        <CardHeader>
                            <CardTitle>Jumlah Transaksi</CardTitle>
                            <CardDescription>
                                {metrics.total_transactions}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end border-t border-border p-0">
                            <Link
                                href={route('operational.transaction')}
                                className="flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                View more <ArrowRightIcon />
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card className="">
                        <CardHeader>
                            <CardTitle>Jumlah Kategori</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-end border-t border-border p-0">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm"
                            >
                                View more <ArrowRightIcon />
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-12">
                {/* Pie Chart Pengeluaran */}
                <div className="md:col-span-4">
                    {/* <DonutChartCategory data={expense_pie_chart} /> */}
                    <Deferred
                        data="expense_pie_chart"
                        fallback={
                            <Card className="flex h-[350px] flex-col items-center justify-center p-6">
                                <Skeleton className="mb-4 h-[200px] w-[200px] rounded-full" />
                                <div className="w-full space-y-2 px-10">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="mx-auto h-4 w-2/3" />
                                </div>
                                <span className="mt-4 animate-pulse text-sm text-muted-foreground">
                                    Memuat data kategori...
                                </span>
                            </Card>
                        }
                    >
                        {/* Saat data siap, komponen ini dirender */}
                        <DonutChartCategory data={expense_pie_chart || []} />
                    </Deferred>
                </div>

                {/* Line Chart Grafik Pengeluaran */}
                <div className="md:col-span-8">
                    {/* <LineChartTransaction data={expense_line_chart} /> */}
                    <Deferred
                        data="expense_line_chart"
                        fallback={
                            <Card className="flex h-[350px] flex-col justify-between p-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-[150px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                                <div className="flex h-[200px] w-full items-end gap-2">
                                    <Skeleton className="h-1/3 w-full" />
                                    <Skeleton className="h-1/2 w-full" />
                                    <Skeleton className="h-2/3 w-full" />
                                    <Skeleton className="h-full w-full" />
                                    <Skeleton className="h-1/2 w-full" />
                                </div>
                                <span className="animate-pulse text-sm text-muted-foreground">
                                    Memuat tren bulanan...
                                </span>
                            </Card>
                        }
                    >
                        {/* Saat data siap, komponen ini dirender */}
                        <LineChartTransaction data={expense_line_chart || []} />
                    </Deferred>
                </div>
            </section>
            <BudgetCard data={budget_realization} />
            {/* <RecentTransactionsCard data={recent_transactions} /> */}
        </DashboardLayout>
    );
}
