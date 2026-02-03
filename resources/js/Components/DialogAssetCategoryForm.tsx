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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    AVAILABLE_ASSET_COLORS,
    AVAILABLE_ASSET_ICONS,
    getAssetIconComponent,
} from '@/Lib/asset-category-config';
import { cn } from '@/Lib/utils';
import { AssetCategoryFormValues, assetCategorySchema } from '@/schema/asset';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryToEdit?: any;
}

export function DialogAssetCategoryForm({
    open,
    onOpenChange,
    categoryToEdit,
}: Props) {
    const isEditing = !!categoryToEdit;

    const form = useForm<AssetCategoryFormValues>({
        resolver: zodResolver(assetCategorySchema),
        defaultValues: {
            name: '',
            type: 'INCOME',
            is_rotation: false,
            icon: 'wallet',
            color: '#10b981',
        },
    });

    // Watch values untuk logic reaktif
    const selectedType = form.watch('type');
    const selectedColor = form.watch('color');
    const selectedIcon = form.watch('icon');

    const PreviewIcon = getAssetIconComponent(selectedIcon);

    // LOGIC: Reset form saat modal dibuka
    useEffect(() => {
        if (open) {
            if (categoryToEdit) {
                form.reset({
                    name: categoryToEdit.name,
                    type: categoryToEdit.type,
                    is_rotation: Boolean(categoryToEdit.is_rotation),
                    icon: categoryToEdit.icon,
                    color: categoryToEdit.color,
                });
            } else {
                form.reset({
                    name: '',
                    type: 'INCOME', // Default
                    is_rotation: false,
                    icon: 'wallet',
                    color: '#10b981',
                });
            }
        }
    }, [open, categoryToEdit, form]);

    // LOGIC: Auto-set is_rotation berdasarkan Type
    useEffect(() => {
        if (selectedType === 'INVEST') {
            form.setValue('is_rotation', true);
        } else if (selectedType === 'EXPENSE') {
            form.setValue('is_rotation', false);
        }
        // Jika INCOME, biarkan user memilih (jangan di-override otomatis)
    }, [selectedType, form]);

    const onSubmit = (values: AssetCategoryFormValues) => {
        if (isEditing) {
            router.put(
                route('asset-categories.update', categoryToEdit.id),
                values,
                { onSuccess: () => onOpenChange(false) },
            );
        } else {
            router.post(route('asset-categories.store'), values, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Edit Kategori Aset'
                            : 'Buat Kategori Aset'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* --- SECTION 1: PREVIEW & NAME --- */}
                        <div className="flex items-start gap-4 rounded-lg border bg-muted/20 p-4">
                            <div
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-colors"
                                style={{
                                    backgroundColor: selectedColor + '20',
                                    borderColor: selectedColor,
                                }}
                            >
                                <PreviewIcon size={32} color={selectedColor} />
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Nama Kategori</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Contoh: Gaji, Saham, Topup Ops"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* --- SECTION 2: TIPE & ROTATION LOGIC --- */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* TIPE CATEGORY */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipe Transaksi</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Tipe" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="INCOME">
                                                    INCOME (Pemasukan)
                                                </SelectItem>
                                                <SelectItem value="INVEST">
                                                    INVEST (Tabungan/Aset)
                                                </SelectItem>
                                                <SelectItem value="EXPENSE">
                                                    EXPENSE (Pengeluaran)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Kelompok besar jenis transaksi.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* INDIKATOR STATUS ROTATION (READ ONLY UNTUK INVEST/EXPENSE) */}
                            {selectedType !== 'INCOME' && (
                                <FormField
                                    control={form.control}
                                    name="is_rotation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status Rotasi</FormLabel>
                                            <div
                                                className={cn(
                                                    'flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium',
                                                    field.value // Gunakan field.value dari FormField
                                                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                        : 'border-orange-200 bg-orange-50 text-orange-700',
                                                )}
                                            >
                                                {field.value ? (
                                                    <>
                                                        <ArrowLeftRight className="h-4 w-4" />
                                                        Rotation (Pindah Aset)
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Real Flow (Uang{' '}
                                                        {selectedType ===
                                                        'EXPENSE'
                                                            ? 'Hilang'
                                                            : 'Baru'}
                                                        )
                                                    </>
                                                )}
                                            </div>
                                            <FormDescription>
                                                Otomatis diatur sistem
                                                berdasarkan tipe transaksi.
                                            </FormDescription>
                                            {/* Tidak perlu FormMessage karena read-only dan auto-set */}
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        {/* --- SECTION 3: KHUSUS INCOME (PILIAN MANUAL ROTATION) --- */}
                        {selectedType === 'INCOME' && (
                            <FormField
                                control={form.control}
                                name="is_rotation"
                                render={({ field }) => (
                                    <FormItem className="space-y-3 rounded-lg border border-yellow-200 bg-yellow-50/50 p-4">
                                        <FormLabel className="text-base font-semibold text-yellow-900">
                                            Apakah ini Pemasukan Murni atau
                                            Pencairan Aset?
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(val) =>
                                                    field.onChange(
                                                        val === 'true',
                                                    )
                                                }
                                                defaultValue={
                                                    field.value
                                                        ? 'true'
                                                        : 'false'
                                                }
                                                className="flex flex-col gap-3"
                                            >
                                                {/* OPSI 1: REAL INCOME */}
                                                <FormItem className="flex items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="false" />
                                                    </FormControl>
                                                    <div className="space-y-1">
                                                        <FormLabel className="font-bold text-green-700">
                                                            Pemasukan Murni
                                                            (Gaji/Dividen)
                                                        </FormLabel>
                                                        <FormDescription className="text-xs">
                                                            Menambah Total
                                                            Kekayaan (Net
                                                            Worth). Uang baru
                                                            yang masuk ke
                                                            sistem.
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>

                                                {/* OPSI 2: ROTATION */}
                                                <FormItem className="flex items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="true" />
                                                    </FormControl>
                                                    <div className="space-y-1">
                                                        <FormLabel className="font-bold text-blue-700">
                                                            Rotasi / Pencairan
                                                            Aset (Jual Saham)
                                                        </FormLabel>
                                                        <FormDescription className="text-xs">
                                                            Hanya mengubah
                                                            bentuk Aset (Saham
                                                            -&gt; Cash). Tidak
                                                            dianggap gaji, agar
                                                            laporan tidak bias.
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* --- SECTION 4: ICON & COLOR PICKER --- */}
                        <div className="space-y-4 border-t pt-2">
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
                                                className="grid grid-cols-6 gap-2 sm:grid-cols-8"
                                            >
                                                {AVAILABLE_ASSET_ICONS.map(
                                                    (icon) => (
                                                        <FormItem
                                                            key={icon.name}
                                                        >
                                                            <FormControl>
                                                                <RadioGroupItem
                                                                    value={
                                                                        icon.name
                                                                    }
                                                                    id={`icon-${icon.name}`}
                                                                    className="peer sr-only"
                                                                />
                                                            </FormControl>
                                                            <FormLabel
                                                                htmlFor={`icon-${icon.name}`}
                                                                className={cn(
                                                                    'flex cursor-pointer items-center justify-center rounded-md border p-2 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10',
                                                                    field.value ===
                                                                        icon.name &&
                                                                        'border-primary ring-1 ring-primary',
                                                                )}
                                                            >
                                                                <icon.component className="h-5 w-5" />
                                                            </FormLabel>
                                                        </FormItem>
                                                    ),
                                                )}
                                            </RadioGroup>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warna Kategori</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-wrap gap-3"
                                            >
                                                {AVAILABLE_ASSET_COLORS.map(
                                                    (color) => (
                                                        <FormItem key={color}>
                                                            <FormControl>
                                                                <RadioGroupItem
                                                                    value={
                                                                        color
                                                                    }
                                                                    id={`color-${color}`}
                                                                    className="peer sr-only"
                                                                />
                                                            </FormControl>
                                                            <FormLabel
                                                                htmlFor={`color-${color}`}
                                                                className="block h-8 w-8 cursor-pointer rounded-full ring-offset-2 transition-transform hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary"
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
                                    </FormItem>
                                )}
                            />
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
