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
import { ColumnDef } from '@tanstack/react-table';
import {
    ArrowLeftRight,
    ArrowUpDown,
    MoreHorizontal,
    Pencil,
    Trash2,
} from 'lucide-react';

// Pastikan tipe data ini sesuai dengan model.d.ts kamu
export interface AssetTransaction {
    id: number;
    date: string;
    amount: number;
    note?: string;
    category?: {
        id: number;
        name: string;
        type: 'INCOME' | 'INVEST' | 'EXPENSE';
        is_rotation: boolean;
        color: string;
        icon: string;
    };
}

interface TableMeta {
    onEdit: (data: AssetTransaction) => void;
    onDelete: (data: AssetTransaction) => void;
}

export const assetColumns: ColumnDef<AssetTransaction>[] = [
    // 1. SELECT CHECKBOX
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

    // 2. TANGGAL
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Tanggal
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'));
            return (
                <div className="font-medium">
                    {date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </div>
            );
        },
    },

    // 3. KATEGORI (Dengan Badge Warna & Indikator Rotasi)
    {
        id: 'category',
        accessorKey: 'category.name', // Access nested data untuk sorting
        header: 'Kategori',
        cell: ({ row }) => {
            const category = row.original.category;

            if (!category)
                return <span className="text-muted-foreground">-</span>;

            return (
                <div className="flex flex-col items-start gap-1">
                    <Badge
                        variant="outline"
                        style={{
                            borderColor: category.color,
                            backgroundColor: category.color + '10', // Opacity 10%
                            color: category.color,
                        }}
                        className="whitespace-nowrap"
                    >
                        {category.name}
                    </Badge>

                    {/* Indikator Kecil Is Rotation */}
                    {category.is_rotation && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <ArrowLeftRight className="h-3 w-3" />
                            <span>Rotation</span>
                        </div>
                    )}
                </div>
            );
        },
    },

    // 4. CATATAN
    {
        accessorKey: 'note',
        header: 'Catatan',
        cell: ({ row }) => (
            <div
                className="max-w-[250px] truncate text-muted-foreground"
                title={row.getValue('note')}
            >
                {row.getValue('note') || '-'}
            </div>
        ),
    },

    // 5. JUMLAH (AMOUNT) - Logic Warna Penting Disini
    {
        accessorKey: 'amount',
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Jumlah
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            const type = row.original.category?.type;

            // Logic Tanda & Warna
            // INCOME = Positif (Hijau)
            // INVEST & EXPENSE = Negatif (Merah - Cash Out)
            const isPositive = type === 'INCOME';

            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
            }).format(amount);

            return (
                <div
                    className={`text-right font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                    {isPositive ? '+' : '-'} {formatted}
                </div>
            );
        },
    },

    // 6. AKSI
    {
        id: 'actions',
        header: () => <div className="text-right font-bold"></div>,
        cell: ({ row, table }) => {
            const transaction = row.original;
            const meta = table.options.meta as TableMeta;

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => meta?.onEdit(transaction)}
                                className="cursor-pointer"
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => meta?.onDelete(transaction)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
