import { DialogAssetForm } from '@/Components/DialogAssetForm';
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
import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { assetColumns } from './columns';

interface IndexProps {
    transactions: any[]; // Sesuaikan tipe AssetTransaction
}

export default function AssetTransactionIndex({ transactions }: IndexProps) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
        null,
    );
    const [isAlertOpen, setAlertOpen] = useState(false);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);

    // --- HANDLERS ---
    const handleCreate = () => {
        setSelectedTransaction(null);
        setDialogOpen(true);
    };

    const handleEdit = useCallback((transaction: any) => {
        setSelectedTransaction(transaction);
        setDialogOpen(true);
    }, []);

    const handleDeleteSingle = useCallback((transaction: any) => {
        setDeletingIds([transaction.id]);
        setAlertOpen(true);
    }, []);

    const handleBulkDelete = useCallback((ids: number[]) => {
        setDeletingIds(ids);
        setAlertOpen(true);
    }, []);

    const confirmDelete = () => {
        router.delete(route('asset-transactions.bulk-delete'), {
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
            header={<h2 className="text-xl font-semibold">Transaksi Aset</h2>}
            enableDateFilter={true}
        >
            <Head title="Transaksi Aset" />

            <DataTableTransaction
                columns={assetColumns}
                data={transactions}
                meta={{
                    onEdit: handleEdit,
                    onDelete: handleDeleteSingle,
                }}
                onCreate={handleCreate}
                onBulkDelete={handleBulkDelete}
                searchKey="note"
                searchPlaceholder="Cari catatan transaksi..."
            />

            {/* Form Dialog */}
            <DialogAssetForm
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                transactionToEdit={selectedTransaction}
            />

            {/* Alert Delete */}
            <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Data yang dihapus tidak dapat dikembalikan. Akan
                            menghapus{' '}
                            <span className="font-bold text-red-600">
                                {deletingIds.length} item
                            </span>
                            .
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus Permanen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
