import { OperationalDialog } from '@/Components/DialogOperationalForm';
import { DataTableTransaction } from '@/Components/ui/data-table-transaction';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { OperationalTransaction } from '@/types/model';
import { Head } from '@inertiajs/react';
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
    // const columns = useMemo(
    //     () => [
    //         ...operationalColumns, // 1. Masukkan kolom dasar
    //         {
    //             id: 'actions_1',
    //             header: 'Aksi',
    //             cell: ({ row }) => {
    //                 const transaction = row.original;

    //                 return (
    //                     <div className="flex justify-end gap-2">
    //                         {/* Tombol Edit */}
    //                         <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             onClick={() => handleEdit(transaction)} // Akses state parent langsung!
    //                             className="h-8 w-8 text-blue-600"
    //                         >
    //                             <Pencil className="h-4 w-4" />
    //                         </Button>

    //                         {/* Tombol Delete (Nanti) */}
    //                         <Button
    //                             variant="ghost"
    //                             size="icon"
    //                             className="h-8 w-8 text-red-600"
    //                         >
    //                             <Trash2 className="h-4 w-4" />
    //                         </Button>
    //                     </div>
    //                 );
    //             },
    //         },
    //     ],
    //     [handleEdit],
    // ); // 2. Dependency Array: Kolom dibuat ulang hanya jika handleEdit berubah

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
                    onEdit: handleEdit, // Lempar fungsi handleEdit ke table
                    // onDelete: handleDelete  // Lempar fungsi handleDelete ke table
                }}
                onCreate={handleCreate}
                searchKey="note"
                searchPlaceholder="Cari catatan..."
            />

            {/* Render Modal: SINGLE INSTANCE */}
            <OperationalDialog
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                transactionToEdit={selectedTransaction}
            />
        </DashboardLayout>
    );
}
