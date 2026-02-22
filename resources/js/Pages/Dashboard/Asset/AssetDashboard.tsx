import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

// Components
import { AssetKpiCards } from '@/Components/AssetKpiCards';
import { AssetRecentTransactions } from '@/Components/AssetRecentTransaction';
import { DonutChartCategory } from '@/Components/DonutChartCategory'; // Use your uploaded component
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

export default function AssetDashboard({
    cards,
    allocationChart,
    recentTransactions,
}: any) {

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    return (
        <DashboardLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Asset Overview
                </h2>
            }
            enableDateFilter={true}
        >
            <Head title="Asset Dashboard" />

            <div className="space-y-6">
                {/* 1. HEADER & FILTER */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight">
                            Halo, Investor!
                        </h3>
                        <p className="text-muted-foreground">
                            Laporan kesehatan finansial Anda periode ini.
                        </p>
                    </div>
                </div>

                {/* 2. KPI CARDS (Modular) */}
                <AssetKpiCards {...cards} />

                {/* 3. MIDDLE SECTION */}
                <div className="grid gap-4 md:grid-cols-7">
                    {/* CHART ALOKASI (Reuse DonutChartCategory) */}
                    <div className="col-span-4">
                        <DonutChartCategory data={allocationChart} />
                    </div>

                    {/* INSIGHT & RECENT */}
                    <div className="col-span-3 space-y-4">
                        {/* Insight Box */}
                        <Card className="border-blue-100 bg-blue-50/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-blue-800">
                                    💡 Insight Keuangan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-blue-900">
                                    {cards.netSaving < 0 ? (
                                        <>
                                            Perhatian: Anda melakukan{' '}
                                            <strong>
                                                Divestasi bersih{' '}
                                                {formatRupiah(
                                                    Math.abs(cards.netSaving),
                                                )}
                                            </strong>
                                            . Kas meningkat karena jual aset.
                                        </>
                                    ) : cards.realIncome > 0 &&
                                      cards.netSaving / cards.realIncome >
                                          0.3 ? (
                                        <>
                                            Good Job! Saving rate Anda{' '}
                                            <strong>
                                                {Math.round(
                                                    (cards.netSaving /
                                                        cards.realIncome) *
                                                        100,
                                                )}
                                                %
                                            </strong>
                                            . Pertahankan!
                                        </>
                                    ) : (
                                        <>
                                            Ada sisa kas (Unallocated){' '}
                                            <strong>
                                                {formatRupiah(
                                                    cards.realIncome -
                                                        cards.livingCost -
                                                        cards.netSaving,
                                                )}
                                            </strong>
                                            . Yuk tambah investasi!
                                        </>
                                    )}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Recent Transactions (Modular) */}
                        <AssetRecentTransactions
                            transactions={recentTransactions}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
