import { z } from 'zod';

export const operationalSchema = z
    .object({
        date: z.date({ required_error: 'Tanggal wajib diisi' }),
        amount: z.coerce.number().min(1, 'Jumlah harus lebih dari 0'),
        type: z.enum(['INCOME', 'EXPENSE']),
        // 1. Buat field ini optional secara default (agar lolos validasi awal)
        operational_category_id: z.string().optional(),
        note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // 2. Logic: Jika tipe EXPENSE, cek apakah category ada
        if (data.type === 'EXPENSE') {
            if (
                !data.operational_category_id ||
                data.operational_category_id.length === 0
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Kategori wajib dipilih untuk pengeluaran',
                    path: ['operational_category_id'], // <-- Error akan muncul di field ini
                });
            }
        }

        // 3. Logic: Jika tipe INCOME, kita bisa abaikan category (atau force null nanti di controller)
        // Tidak perlu validasi error disini, karena income memang boleh kosong.
    });

// Export type-nya biar bisa dipakai di Form
export type OperationalFormValues = z.infer<typeof operationalSchema>;

export const categorySchema = z
    .object({
        name: z.string().min(1, 'Nama kategori wajib diisi'),

        // Icon & Color wajib string
        icon: z.string(),
        color: z.string(),

        // Logic Bujet:
        // Kita buat field pembantu 'has_budget' (boolean) untuk UI Switch
        has_budget: z.boolean().default(false),

        // Budget limit boleh null
        budget_limit: z.coerce.number().optional().nullable(),
    })
    .superRefine((data, ctx) => {
        // Jika switch ON tapi budget 0 atau kosong -> Error
        if (data.has_budget && (!data.budget_limit || data.budget_limit <= 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Nominal bujet harus diisi jika diaktifkan',
                path: ['budget_limit'],
            });
        }
    });

export type CategoryFormValues = z.infer<typeof categorySchema>;
