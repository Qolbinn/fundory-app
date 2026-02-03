// resources/js/types/models.d.ts

// 1. Definisikan Category (Sub-type)
export interface OperationalCategory {
    id: number;
    name: string;
    icon: string;
    color: string;
}

// 2. Definisikan Transaksi Utama
export interface OperationalTransaction {
    category: OperationalCategory | null;
    id: number;
    user_id: number;
    date: string; // Tanggal dari JSON biasanya string
    amount: number;
    type: 'INCOME' | 'EXPENSE'; // Enum
    note: string | null;

    // Relasi (Optional karena bisa jadi null atau belum di-load)
    operational_category_id?: OperationalCategory | null;

    // Field tambahan dari formatting Controller (hasil 'through')
    formatted_date?: string;
}

export interface AssetTransaction {
    id: number;
    user_id: number;
    date: string; // Tanggal dari JSON biasanya string
    amount: number;
    type: 'INCOME' | 'EXPENSE' | 'INVEST';
    note: string | null;
    formatted_date?: string;
}
