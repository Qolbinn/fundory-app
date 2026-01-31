import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OperationalTransaction } from '@/types/model';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface TableMeta {
    onEdit: (data: OperationalTransaction) => void;
    // onDelete: (data: OperationalTransaction) => void;
}

// 2. Definisikan Kolom
export const operationalColumns: ColumnDef<OperationalTransaction>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
        id: 'category',
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
        filterFn: 'equalsString', // penting
    },
    {
        accessorKey: 'note',
        // header: 'Catatan',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Catatan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate text-muted-foreground">
                {row.getValue('note') || '-'}
            </div>
        ),
    },
    {
        accessorKey: 'amount',
        // header: () => <div className="text-right">Jumlah</div>,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Jumlah
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
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
    {
        id: 'actions_2',
        header: () => <div className="text-right font-bold">Aksi Row</div>,
        cell: ({ row, table }) => {
            const transaction = row.original;
            const meta = table.options.meta as TableMeta;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* Modal Edit */}
                        {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
                        <DropdownMenuItem
                            onClick={() => meta?.onEdit(transaction)}
                        >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
