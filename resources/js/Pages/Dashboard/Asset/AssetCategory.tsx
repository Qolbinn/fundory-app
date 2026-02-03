import { DialogAssetCategoryForm } from '@/Components/DialogAssetCategoryForm';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { getAssetIconComponent } from '@/Lib/asset-category-config';
import { cn } from '@/Lib/utils';
import { Head } from '@inertiajs/react';
import { ArrowLeftRight, CheckCircle2, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

export default function AssetCategoryIndex({
    categories,
}: {
    categories: any[];
}) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const handleCreate = () => {
        setSelectedCategory(null);
        setDialogOpen(true);
    };

    const handleEdit = (category: any) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    // Helper untuk warna badge tipe
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'INCOME':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'INVEST':
                return 'text-blue-700 bg-blue-50 border-blue-200';
            case 'EXPENSE':
                return 'text-orange-700 bg-orange-50 border-orange-200';
            default:
                return 'text-gray-700 bg-gray-50';
        }
    };

    return (
        <DashboardLayout
            header={
                <h2 className="text-xl font-semibold">
                    Kategori Manajemen Aset
                </h2>
            }
        >
            <Head title="Kategori Aset" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium">Daftar Kategori</h3>
                        <p className="text-sm text-muted-foreground">
                            Atur pos-pos pemasukan, investasi, dan alokasi dana.
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Kategori Baru
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categories.map((category) => {
                        const IconComponent = getAssetIconComponent(
                            category.icon,
                        );

                        return (
                            <Card
                                key={category.id}
                                className="group relative flex cursor-pointer flex-col gap-4 p-5 transition-all hover:border-primary/50 hover:shadow-md"
                                onClick={() => handleEdit(category)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Icon Box */}
                                        <div
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                                            style={{
                                                backgroundColor:
                                                    category.color + '20',
                                                color: category.color,
                                            }}
                                        >
                                            <IconComponent size={24} />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {category.name}
                                            </h3>

                                            {/* Badge Type */}
                                            <span
                                                className={cn(
                                                    'mt-1 inline-block rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                                                    getTypeColor(category.type),
                                                )}
                                            >
                                                {category.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Edit Icon */}
                                    <Pencil className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>

                                {/* Bagian Bawah: Indikator Rotation */}
                                <div className="mt-2 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
                                    {category.is_rotation ? (
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <ArrowLeftRight className="h-3.5 w-3.5" />
                                            <span>Rotation (Pindah Aset)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-green-600">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            <span>
                                                Real Flow (Net Worth Change)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {categories.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
                        <div className="mb-3 rounded-full bg-muted p-4">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold">Belum ada kategori</h3>
                        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                            Mulai dengan membuat kategori seperti "Gaji",
                            "Saham", atau "Operasional".
                        </p>
                        <Button variant="outline" onClick={handleCreate}>
                            Buat Sekarang
                        </Button>
                    </div>
                )}
            </div>

            <DialogAssetCategoryForm
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                categoryToEdit={selectedCategory}
            />
        </DashboardLayout>
    );
}
