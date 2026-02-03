import {
    AVAILABLE_OPERATIONAL_COLORS,
    AVAILABLE_OPERATIONAL_ICONS,
    getOperationalIconComponent,
} from '@/Lib/operational-category-config';
import {
    OperationalCategoryFormValue,
    operationalCategorySchema,
} from '@/schema/operational';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// Shadcn UI
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Switch } from '@/Components/ui/switch';
import { cn } from '@/Lib/utils';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryToEdit?: any; // Ganti tipe data sesuai model nanti
}

export function DialogOperationalCategoryForm({
    open,
    onOpenChange,
    categoryToEdit,
}: Props) {
    const isEditing = !!categoryToEdit;

    const form = useForm<OperationalCategoryFormValue>({
        resolver: zodResolver(operationalCategorySchema),
        defaultValues: {
            name: '',
            icon: 'tag',
            color: '#64748b',
            has_budget: false,
            budget_limit: 0,
        },
    });

    // Watch untuk Preview Real-time
    const selectedIconName = form.watch('icon');
    const selectedColor = form.watch('color');
    const hasBudget = form.watch('has_budget');

    // Helper render Icon Component Dynamic
    const PreviewIcon = getOperationalIconComponent(selectedIconName);

    useEffect(() => {
        if (open) {
            if (categoryToEdit) {
                form.reset({
                    name: categoryToEdit.name,
                    icon: categoryToEdit.icon,
                    color: categoryToEdit.color,
                    has_budget: !!categoryToEdit.budget_limit,
                    budget_limit: categoryToEdit.budget_limit
                        ? Number(categoryToEdit.budget_limit)
                        : 0,
                });
            } else {
                form.reset({
                    name: '',
                    icon: 'tag',
                    color: '#64748b',
                    has_budget: false,
                    budget_limit: 0,
                });
            }
        }
    }, [open, categoryToEdit, form]);

    const onSubmit = (values: OperationalCategoryFormValue) => {
        // Bersihkan data sebelum kirim
        const payload = {
            ...values,
            // Jika switch OFF, paksa budget_limit jadi null
            budget_limit: values.has_budget ? values.budget_limit : null,
        };

        if (isEditing) {
            router.put(
                route('operational-categories.update', categoryToEdit.id),
                payload,
                {
                    onSuccess: () => onOpenChange(false),
                },
            );
        } else {
            router.post(route('operational-categories.store'), payload, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Kategori' : 'Buat Kategori Baru'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* SECTION 1: PREVIEW & NAMA */}
                        <div className="flex items-start gap-4">
                            {/* Preview Box */}
                            <div
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-colors"
                                style={{
                                    backgroundColor: selectedColor + '20',
                                    borderColor: selectedColor,
                                }} // Warna bg transparan 20%
                            >
                                <PreviewIcon
                                    size={32}
                                    color={selectedColor}
                                    className="transition-all"
                                />
                            </div>

                            {/* Input Nama */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Nama Kategori</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Contoh: Makan Siang, Bensin"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* SECTION 2: PILIH ICON */}
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pilih Ikon</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-6 gap-2"
                                        >
                                            {AVAILABLE_OPERATIONAL_ICONS.map(
                                                (icon) => (
                                                    <FormItem key={icon.name}>
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value={
                                                                    icon.name
                                                                }
                                                                id={`icon-${icon.name}`}
                                                                className="peer sr-only" // Sembunyikan radio bulat aslinya
                                                            />
                                                        </FormControl>
                                                        <FormLabel
                                                            htmlFor={`icon-${icon.name}`}
                                                            className={cn(
                                                                'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-muted bg-popover p-2 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary',
                                                                field.value ===
                                                                    icon.name &&
                                                                    'border-primary bg-primary/5',
                                                            )}
                                                        >
                                                            <icon.component className="h-5 w-5" />
                                                        </FormLabel>
                                                    </FormItem>
                                                ),
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SECTION 3: PILIH WARNA */}
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Warna Identitas</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-wrap gap-3"
                                        >
                                            {AVAILABLE_OPERATIONAL_COLORS.map(
                                                (color) => (
                                                    <FormItem key={color}>
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value={color}
                                                                id={`color-${color}`}
                                                                className="peer sr-only"
                                                            />
                                                        </FormControl>
                                                        <FormLabel
                                                            htmlFor={`color-${color}`}
                                                            className="block h-8 w-8 cursor-pointer rounded-full ring-offset-2 transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary"
                                                            style={{
                                                                backgroundColor:
                                                                    color,
                                                            }}
                                                        />
                                                    </FormItem>
                                                ),
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SECTION 4: BUJET OPSIONAL */}
                        <div className="space-y-4 rounded-lg border p-4">
                            <FormField
                                control={form.control}
                                name="has_budget"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Batasi Bujet Bulanan
                                            </FormLabel>
                                            <FormDescription>
                                                Aktifkan jika ingin mendapat
                                                notifikasi saat over-budget.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Input Nominal (Muncul hanya jika Switch ON) */}
                            {hasBudget && (
                                <FormField
                                    control={form.control}
                                    name="budget_limit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Batas Maksimal (Rp)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="1000000"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {isEditing
                                    ? 'Simpan Perubahan'
                                    : 'Buat Kategori'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
