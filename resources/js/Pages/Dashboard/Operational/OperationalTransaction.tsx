import { OperationalDialog } from '@/Components/DialogOperationalForm';
import { Button } from '@/Components/ui/button';
import { DataTable } from '@/Components/ui/data-table'; // Komponen langkah 3
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { OperationalTransaction } from '@/types/model';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { operationalColumns } from './columns';

// Definisikan props untuk Pagination Laravel
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface IndexProps {
    transactions: {
        data: OperationalTransaction[];
        links: PaginationLink[]; // Links pagination Laravel
        current_page: number;
        last_page: number;
    };
}

export default function OperationalTransaction({ transactions }: IndexProps) {
    // 1. State Kontrol Modal
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
        useState<OperationalTransaction | null>(null);

    // 2. Handler untuk Membuka Modal
    const handleCreate = () => {
        setSelectedTransaction(null); // Kosongkan data
        setDialogOpen(true);
    };

    // Pelajari kenapa useCallback penting di sini
    const handleEdit = useCallback((transaction: OperationalTransaction) => {
        setSelectedTransaction(transaction); // Isi data
        setDialogOpen(true);
    }, []);

    // --- BEST PRACTICE DEFINITION ---
    const columns = useMemo(
        () => [
            ...operationalColumns, // 1. Masukkan kolom dasar
            {
                id: 'actions',
                header: 'Aksi',
                cell: ({ row }) => {
                    const transaction = row.original;

                    return (
                        <div className="flex justify-end gap-2">
                            {/* Tombol Edit */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(transaction)} // Akses state parent langsung!
                                className="h-8 w-8 text-blue-600"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Tombol Delete (Nanti) */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [handleEdit],
    ); // 2. Dependency Array: Kolom dibuat ulang hanya jika handleEdit berubah

    return (
        <DashboardLayout
            header={
                <h2 className="text-xl font-semibold">Transaksi Operasional</h2>
            }
        >
            <Head title="Transaksi Operasional" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Daftar pengeluaran dan pemasukan harian.
                    </p>
                    {/* Nanti di sini tombol Create Modal */}
                    <Button onClick={handleCreate}>+ Tambah Transaksi</Button>
                </div>

                {/* Render Data Table */}
                <DataTable columns={columns} data={transactions.data} />

                {/* Simple Pagination Control (Next/Prev) */}
                <div className="flex items-center justify-end space-x-2 py-4">
                    {transactions.links.map((link, key) =>
                        link.url ? (
                            <Link
                                key={key}
                                href={link.url}
                                preserveScroll
                                className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ) : null,
                    )}
                </div>
            </div>

            {/* Render Modal: SINGLE INSTANCE */}
            <OperationalDialog
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                transactionToEdit={selectedTransaction}
            />
        </DashboardLayout>
    );
}
