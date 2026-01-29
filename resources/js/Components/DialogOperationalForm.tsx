import { OperationalFormValues, operationalSchema } from '@/schema/operational';
import { OperationalTransaction } from '@/types/model.d';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// UI Components (Shadcn)
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { getIconComponent } from '@/Lib/operational-category-config';
import { cn } from '@/Lib/utils';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transactionToEdit?: OperationalTransaction | null; // Kalau null = Create
}

export function OperationalDialog({
    open,
    onOpenChange,
    transactionToEdit,
}: Props) {
    // 1. Ambil data categories dari Shared Props (HandleInertiaRequests)
    const { options } = usePage<any>().props;
    const categories = options?.categories || [];

    const isEditing = !!transactionToEdit;

    // 2. Setup Form dengan Zod Resolver
    const form = useForm<OperationalFormValues>({
        resolver: zodResolver(operationalSchema),
        defaultValues: {
            date: new Date(),
            amount: 0,
            type: 'EXPENSE',
            operational_category_id: '',
            note: '',
        },
    });

    // 2. Watch Type untuk Logika Disable
    const transactionType = form.watch('type');
    const isIncome = transactionType === 'INCOME';

    // 3. Reset Form saat Modal Dibuka atau Mode Berubah
    useEffect(() => {
        if (open) {
            if (transactionToEdit) {
                // MODE EDIT & Casting Values
                form.reset({
                    // 1. Date: Ubah string "2023-01-01" menjadi Date Object
                    date: new Date(transactionToEdit.date),

                    // 2. Amount: Pastikan jadi Number (karena dari DB kadang string "10000.00")
                    amount: parseFloat(String(transactionToEdit.amount)),

                    // 3. Type: Casting ke specific string literal
                    type: transactionToEdit.type as 'INCOME' | 'EXPENSE',

                    // 4. Category ID: INI YANG SERING BUG.
                    // Dari DB dia Integer, tapi Select Value butuh String. Wajib String()
                    // operational_category_id: String(
                    //     transactionToEdit.operational_category_id,
                    // ),
                    operational_category_id:
                        transactionToEdit.operational_category_id
                            ? String(transactionToEdit.operational_category_id)
                            : '',

                    // 5. Note: Handle null
                    note: transactionToEdit.note || '',
                });
            } else {
                // MODE CREATE: Reset ke default
                form.reset({
                    date: new Date(),
                    amount: 0,
                    type: 'EXPENSE',
                    operational_category_id: '',
                    note: '',
                });
            }
        }
    }, [open, transactionToEdit, form]);

    // 4. Handle Submit
    const onSubmit = (values: OperationalFormValues) => {
        // Format tanggal ke Y-m-d untuk Laravel
        const payload = {
            ...values,
            date: format(values.date, 'yyyy-MM-dd'),
            operational_category_id:
                values.type === 'INCOME'
                    ? null
                    : values.operational_category_id,
        };

        if (isEditing && transactionToEdit) {
            // UPDATE
            router.put(
                route('operational.update', transactionToEdit.id),
                payload,
                {
                    onSuccess: () => {
                        onOpenChange(false);
                        form.reset();
                    },
                },
            );
        } else {
            // CREATE
            router.post(route('operational.store'), payload, {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Transaksi' : 'Catat Transaksi Baru'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* TYPE (Income/Expense) */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenis Transaksi</FormLabel>
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            // Opsional: Clear kategori jika pindah ke Income
                                            if (val === 'INCOME')
                                                form.setValue(
                                                    'operational_category_id',
                                                    '',
                                                );
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="EXPENSE">
                                                Pengeluaran
                                            </SelectItem>
                                            <SelectItem value="INCOME">
                                                Pemasukan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* --- VISUAL CATEGORY SELECTOR --- */}
                        <div
                            className={cn(
                                'space-y-3',
                                isIncome &&
                                    'pointer-events-none opacity-50 grayscale',
                            )}
                        >
                            <FormField
                                control={form.control}
                                name="operational_category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className={cn(
                                                isIncome &&
                                                    'text-muted-foreground',
                                            )}
                                        >
                                            {isIncome
                                                ? 'Kategori (Tidak perlu untuk Pemasukan)'
                                                : 'Pilih Kategori'}
                                        </FormLabel>
                                        <FormControl>
                                            {/* Scroll area mini jika kategori banyak */}
                                            <div className="max-h-[240px] overflow-y-auto pr-2">
                                                <RadioGroup
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-3 gap-3"
                                                    disabled={isIncome} // Matikan input radio jika Income
                                                >
                                                    {categories.map(
                                                        (cat: any) => {
                                                            const IconComponent =
                                                                getIconComponent(
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
                                                                            className="sr-only" // Hide default radio circle
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel
                                                                        htmlFor={`cat-${cat.id}`}
                                                                        className={cn(
                                                                            'flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 p-3 transition-all hover:border-accent-foreground/50 hover:bg-accent',
                                                                            'h-24', // Tinggi fix card
                                                                            isSelected
                                                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                                                : 'border-muted bg-background',
                                                                        )}
                                                                    >
                                                                        {/* Icon Circle */}
                                                                        <div
                                                                            className="mb-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
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
                                                                                    20
                                                                                }
                                                                            />
                                                                        </div>

                                                                        {/* Category Name */}
                                                                        <span className="line-clamp-2 text-center text-xs font-medium leading-tight">
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
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Pesan jika kategori kosong */}
                            {!isIncome && categories.length === 0 && (
                                <p className="rounded-md border border-dashed py-4 text-center text-sm text-muted-foreground">
                                    Belum ada kategori. <br />
                                    <span className="text-xs">
                                        Silakan buat di menu Kategori.
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* AMOUNT */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jumlah (Rp)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* TANGGAL (Opsional: Bisa tambah DatePicker Shadcn disini) */}
                        {/* NOTE */}
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catatan</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
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
                                {isEditing ? 'Simpan Perubahan' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
