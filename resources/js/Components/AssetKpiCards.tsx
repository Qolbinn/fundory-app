import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    ArrowDown,
    ArrowUp,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';

interface Props {
    netWorth: number;
    liquidBalance: number;
    realIncome: number;
    netSaving: number;
    changeInCash: number;
}

const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(val);

export function AssetKpiCards({
    netWorth,
    liquidBalance,
    realIncome,
    netSaving,
    changeInCash,
}: Props) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* NET WORTH */}
            <Card className="border-slate-800 bg-slate-900 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">
                        Total Net Worth
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatRupiah(netWorth)}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                        Aset Investasi + Kas Liquid
                    </p>
                </CardContent>
            </Card>

            {/* SALDO LIQUID */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Saldo Liquid
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatRupiah(liquidBalance)}
                    </div>
                    <div className="mt-1 flex items-center text-xs">
                        {changeInCash >= 0 ? (
                            <span className="flex items-center text-green-600">
                                <ArrowUp className="mr-1 h-3 w-3" />
                                {formatRupiah(changeInCash)} (Bln Ini)
                            </span>
                        ) : (
                            <span className="flex items-center text-red-600">
                                <ArrowDown className="mr-1 h-3 w-3" />
                                {formatRupiah(Math.abs(changeInCash))} (Bln Ini)
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* REAL INCOME */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Real Income
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {formatRupiah(realIncome)}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Gaji & Dividen Murni
                    </p>
                </CardContent>
            </Card>

            {/* NET SAVING */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Net Saving
                    </CardTitle>
                    {netSaving >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                </CardHeader>
                <CardContent>
                    <div
                        className={`text-2xl font-bold ${netSaving >= 0 ? 'text-blue-600' : 'text-red-600'}`}
                    >
                        {formatRupiah(netSaving)}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {netSaving >= 0
                            ? 'Masuk ke Aset (Invest)'
                            : 'Keluar dari Aset (Jual)'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
