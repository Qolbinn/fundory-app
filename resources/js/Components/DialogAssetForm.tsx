import { DatePicker } from '@/Components/DatePicker';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import {
    Form,
    FormControl,
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
import { Textarea } from '@/Components/ui/textarea';
import { getAssetIconComponent } from '@/Lib/asset-category-config';
import { cn } from '@/Lib/utils';
import { AssetTransaction } from '@/Pages/Dashboard/Asset/columns';
import { AssetFormValues, assetSchema } from '@/schema/asset';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transactionToEdit?: AssetTransaction | null;
}

export function DialogAssetForm({
    open,
    onOpenChange,
    transactionToEdit,
}: Props) {
    // 1. Ambil data kategori aset dari Shared Props
    // Pastikan di HandleInertiaRequests atau Controller sudah mengirim 'asset_categories'
    const { options } = usePage<any>().props;
    const categories = options?.asset_categories || [];

    const isEditing = !!transactionToEdit;

    // 2. Setup Form
    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            date: new Date(),
            amount: 0,
            type: 'INCOME', // Default ke INCOME
            asset_category_id: '',
            note: '',
        },
    });

    // 3. Watch Type untuk Filter Kategori
    const selectedType = form.watch('type');

    // Filter kategori berdasarkan Tipe yang dipilih
    const filteredCategories = useMemo(() => {
        return categories.filter((cat: any) => cat.type === selectedType);
    }, [categories, selectedType]);

    // 4. Reset Form
    useEffect(() => {
        if (open) {
            if (transactionToEdit) {
                form.reset({
                    date: new Date(transactionToEdit.date),
                    amount: Number(transactionToEdit.amount),
                    type: transactionToEdit.category?.type || 'INCOME', // Ambil tipe dari relasi kategori
                    asset_category_id: String(
                        transactionToEdit.asset_category_id,
                    ),
                    note: transactionToEdit.note || '',
                });
            } else {
                form.reset({
                    date: new Date(),
                    amount: 0,
                    type: 'INCOME',
                    asset_category_id: '',
                    note: '',
                });
            }
        }
    }, [open, transactionToEdit, form]);

    // 5. Submit Handler
    const onSubmit = (values: AssetFormValues) => {
        const payload = {
            ...values,
            date: format(values.date, 'yyyy-MM-dd'),
        };

        if (isEditing && transactionToEdit) {
            router.put(
                route('asset-transactions.update', transactionToEdit.id),
                payload,
                {
                    onSuccess: () => {
                        onOpenChange(false);
                        form.reset();
                    },
                },
            );
        } else {
            router.post(route('asset-transactions.store'), payload, {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Edit Transaksi Aset'
                            : 'Catat Transaksi Aset'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Perbarui detail transaksi aset Anda di bawah ini.'
                            : 'Isi detail transaksi aset baru Anda di bawah ini.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* ROW 1: Date & Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Tanggal</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jenis Transaksi</FormLabel>
                                        <Select
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                form.setValue(
                                                    'asset_category_id',
                                                    '',
                                                ); // Reset kategori jika tipe berubah
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="INCOME">
                                                    Income (Masuk)
                                                </SelectItem>
                                                <SelectItem value="INVEST">
                                                    Invest (Nabung)
                                                </SelectItem>
                                                <SelectItem value="EXPENSE">
                                                    Expense (Keluar)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* AMOUNT */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jumlah (Rp)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            value={
                                                Number.isNaN(field.value)
                                                    ? ''
                                                    : field.value
                                            }
                                            onChange={(e) => {
                                                field.onChange(
                                                    e.target.valueAsNumber,
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CATEGORY SELECTOR (Filtered by Type) */}
                        <FormField
                            control={form.control}
                            name="asset_category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Pilih Kategori ({selectedType})
                                    </FormLabel>
                                    <FormControl>
                                        <div className="max-h-[240px] overflow-y-auto pr-1">
                                            {filteredCategories.length > 0 ? (
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-3 gap-3"
                                                >
                                                    {filteredCategories.map(
                                                        (cat: any) => {
                                                            const IconComponent =
                                                                getAssetIconComponent(
                                                                    cat.icon,
                                                                );
                                                            const isSelected =
                                                                field.value ===
                                                                String(cat.id);

                                                            return (
                                                                <FormItem
                                                                    key={cat.id}
                                                                >
                                                                    <FormControl>
                                                                        <RadioGroupItem
                                                                            value={String(
                                                                                cat.id,
                                                                            )}
                                                                            id={`cat-${cat.id}`}
                                                                            className="sr-only"
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel
                                                                        htmlFor={`cat-${cat.id}`}
                                                                        className={cn(
                                                                            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 p-2 transition-all hover:bg-accent',
                                                                            'h-24 text-center',
                                                                            isSelected
                                                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                                                : 'border-muted bg-background',
                                                                        )}
                                                                    >
                                                                        <div
                                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    isSelected
                                                                                        ? cat.color
                                                                                        : '#f1f5f9',
                                                                                color: isSelected
                                                                                    ? 'white'
                                                                                    : cat.color,
                                                                            }}
                                                                        >
                                                                            <IconComponent
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <span className="line-clamp-2 text-[10px] font-medium leading-tight">
                                                                            {
                                                                                cat.name
                                                                            }
                                                                        </span>
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        },
                                                    )}
                                                </RadioGroup>
                                            ) : (
                                                <div className="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">
                                                    Tidak ada kategori untuk
                                                    tipe {selectedType}.
                                                    <br />
                                                    Silakan buat kategori baru.
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* NOTE */}
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catatan (Opsional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Contoh: Gaji bulan Maret, Jual Saham BBRI"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {isEditing
                                    ? 'Simpan Perubahan'
                                    : 'Simpan Transaksi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
