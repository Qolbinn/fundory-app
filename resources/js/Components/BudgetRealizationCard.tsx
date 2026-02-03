import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { cn } from '@/Lib/utils';

interface BudgetData {
    id: number;
    name: string;
    color: string;
    target: number;
    used: number;
    percentage: number;
    is_over_budget: boolean;
}

export function BudgetCard({ data }: { data: BudgetData[] }) {
    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Realisasi Anggaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {data.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Tidak ada kategori dengan limit anggaran.
                    </p>
                )}

                {data.map((item) => (
                    <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <span
                                className={cn(
                                    'font-bold',
                                    item.is_over_budget
                                        ? 'text-red-500'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.percentage}%
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <Progress
                            value={item.percentage}
                            // Hack styling untuk warna dynamic (karena shadcn progress indicator pake bg-primary)
                            // Kita override indicator color via style inline di parent wrapper jika perlu,
                            // tapi default black/primary sudah oke.
                            // Jika mau merah saat overbudget:
                            className={cn(
                                'h-2',
                                '[&>div]:bg-primary', // Default color
                                item.is_over_budget && '[&>div]:bg-red-500', // Overbudget color
                            )}
                        />

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Terpakai: {formatRupiah(item.used)}</span>
                            <span>Target: {formatRupiah(item.target)}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
