import { z } from 'zod';

export const assetSchema = z.object({
    date: z.date({ required_error: 'Tanggal wajib diisi' }),
    type: z.enum(['INCOME', 'EXPENSE', 'INVEST'], {
        required_error: 'Jenis transaksi wajib dipilih',
    }),
    amount: z
        .number({ invalid_type_error: 'Jumlah harus berupa angka' })
        .min(1, 'Jumlah minimal 1'),
    asset_category_id: z.string().min(1, 'Kategori wajib dipilih'), // Kita simpan sbg string di form value
    note: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;

export const assetCategorySchema = z.object({
    name: z.string().min(1, 'Nama kategori wajib diisi'),
    type: z.enum(['INCOME', 'INVEST', 'EXPENSE'], {
        required_error: 'Tipe kategori wajib dipilih',
    }),
    is_rotation: z.boolean(),
    icon: z.string(),
    color: z.string(),
});

export type AssetCategoryFormValues = z.infer<typeof assetCategorySchema>;
