import { OperationalDialog } from '@/Components/DialogOperationalForm';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { DataTableTransaction } from '@/Components/ui/data-table-transaction';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { OperationalTransaction } from '@/types/model';
import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { operationalColumns } from './columns';

interface IndexProps {
    transactions: OperationalTransaction[];
}

export default function OperationalTransaction({ transactions }: IndexProps) {
    // 1. State Kontrol Modal
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
        useState<OperationalTransaction | null>(null);
    const [isAlertOpen, setAlertOpen] = useState(false);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);

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

    const handleDeleteSingle = useCallback(
        (transaction: OperationalTransaction) => {
            setDeletingIds([transaction.id]); // Masukkan 1 ID saja
            setAlertOpen(true); // Buka Alert
        },
        [],
    );

    // 3. Handler Trigger Delete Bulk (dari DataTable)
    const handleBulkDelete = useCallback((ids: number[]) => {
        setDeletingIds(ids); // Masukkan banyak ID
        setAlertOpen(true); // Buka Alert
    }, []);

    const confirmDelete = () => {
        router.delete(route('operational.bulk-delete'), {
            data: { ids: deletingIds },
            onSuccess: () => {
                setAlertOpen(false);
                setDeletingIds([]);
            },
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout
            header={
                <h2 className="text-xl font-semibold">Transaksi Operasional</h2>
            }
        >
            <Head title="Transaksi Operasional" />

            <DataTableTransaction
                // columns={columns}
                columns={operationalColumns}
                data={transactions}
                meta={{
                    onEdit: handleEdit,
                    onDelete: handleDeleteSingle,
                }}
                onCreate={handleCreate}
                onBulkDelete={handleBulkDelete}
                searchKey="note"
                searchPlaceholder="Cari catatan..."
            />

            {/* Render Modal: SINGLE INSTANCE */}
            <OperationalDialog
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                transactionToEdit={selectedTransaction}
            />

            {/* --- ALERT DIALOG KONFIRMASI --- */}
            <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan
                            menghapus{' '}
                            <span className="font-bold text-red-600">
                                {deletingIds.length} data
                            </span>{' '}
                            transaksi secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
