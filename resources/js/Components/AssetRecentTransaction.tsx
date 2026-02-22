import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';

interface Props {
    transactions: any[];
}

export function AssetRecentTransactions({ transactions }: Props) {
    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">Transaksi Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.map((trx) => (
                        <div
                            key={trx.id}
                            className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {trx.category?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(trx.date), 'dd MMM')} •{' '}
                                    {trx.note || '-'}
                                </p>
                            </div>
                            <div
                                className={`text-sm font-medium ${['EXPENSE', 'INVEST'].includes(trx.category?.type) ? 'text-red-600' : 'text-green-600'}`}
                            >
                                {['EXPENSE', 'INVEST'].includes(
                                    trx.category?.type,
                                )
                                    ? '-'
                                    : '+'}{' '}
                                {formatRupiah(trx.amount)}
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="ghost"
                        className="h-8 w-full text-xs"
                        asChild
                    >
                        <Link href={route('asset.transaction')}>
                            Lihat Semua
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
