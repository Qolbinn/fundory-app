import { Badge } from '@/Components/ui/badge';
import { OperationalTransaction } from '@/types/model';
import { ColumnDef } from '@tanstack/react-table';

// 2. Definisikan Kolom
export const operationalColumns: ColumnDef<OperationalTransaction>[] = [
    {
        accessorKey: 'date',
        header: 'Tanggal',
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'));
            return (
                <div className="font-medium">
                    {date.toLocaleDateString('id-ID')}
                </div>
            );
        },
    },
    {
        accessorKey: 'category',
        header: 'Kategori',
        cell: ({ row }) => {
            const category = row.original.category;
            if (!category)
                return <span className="text-muted-foreground">-</span>;

            // Contoh render custom dengan Badge warna dynamic
            return (
                <Badge
                    variant="outline"
                    style={{
                        borderColor: category.color,
                        color: category.color,
                    }}
                >
                    {category.name}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'note',
        header: 'Catatan',
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate text-muted-foreground">
                {row.getValue('note') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'amount',
        header: () => <div className="text-right">Jumlah</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            const type = row.original.type;

            // Format Rupiah
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
            }).format(amount);

            return (
                <div
                    className={`text-right font-medium ${type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}
                >
                    {type === 'EXPENSE' ? '-' : '+'} {formatted}
                </div>
            );
        },
    },
];
