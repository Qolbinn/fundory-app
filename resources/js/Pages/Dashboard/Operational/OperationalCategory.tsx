import { DialogOperationalCategoryForm } from '@/Components/DialogOperationalCategoryForm';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { getIconComponent } from '@/Lib/operational-category-config';
import { Head } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

export default function CategoryIndex({ categories }: { categories: any[] }) {
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

    return (
        <DashboardLayout
            header={
                <h2 className="text-xl font-semibold">Kategori Operasional</h2>
            }
        >
            <Head title="Kategori" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                        Kelola kategori pengeluaranmu disini.
                    </p>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Kategori Baru
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {categories.map((category) => {
                        const IconComponent = getIconComponent(category.icon);

                        return (
                            <Card
                                key={category.id}
                                className="group flex cursor-pointer items-center justify-between p-4 transition-shadow hover:shadow-md"
                                onClick={() => handleEdit(category)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icon Box */}
                                    <div
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor:
                                                category.color + '20',
                                        }} // Opacity 20%
                                    >
                                        <IconComponent
                                            size={20}
                                            color={category.color}
                                        />
                                    </div>

                                    {/* Text Info */}
                                    <div>
                                        <h3 className="text-sm font-semibold">
                                            {category.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {category.budget_limit
                                                ? `Limit: Rp ${new Intl.NumberFormat('id-ID').format(category.budget_limit)}`
                                                : 'Tidak ada limit'}
                                        </p>
                                    </div>
                                </div>

                                {/* Edit Icon (Muncul saat hover) */}
                                <Pencil className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </Card>
                        );
                    })}
                </div>

                {categories.length === 0 && (
                    <div className="rounded-lg border-2 border-dashed py-12 text-center text-muted-foreground">
                        Belum ada kategori. Yuk buat sekarang!
                    </div>
                )}
            </div>

            <DialogOperationalCategoryForm
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                categoryToEdit={selectedCategory}
            />
        </DashboardLayout>
    );
}
