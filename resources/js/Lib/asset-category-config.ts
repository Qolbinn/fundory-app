import { Bus, Shield, ShoppingBag, Tag, Utensils, Zap } from 'lucide-react';

// 1. Daftar Icon yang tersedia
export const AVAILABLE_ASSET_ICONS = [
    { name: 'tag', component: Tag, label: 'Umum' },
    { name: 'shopping-bag', component: ShoppingBag, label: 'Belanja' },
    { name: 'utensils', component: Utensils, label: 'Makan' },
    { name: 'bus', component: Bus, label: 'Transport' },
    { name: 'zap', component: Zap, label: 'Tagihan' },
    { name: 'shield', component: Shield, label: 'Asuransi' },
];

// 2. Daftar Warna yang tersedia (Tailwind Colors atau Hex)
export const AVAILABLE_ASSET_COLORS = [
    '#64748b', // Slate (Default)
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#ec4899', // Pink
];

// Helper untuk mengambil komponen icon berdasarkan string nama
export const getAssetIconComponent = (name: string) => {
    const found = AVAILABLE_ASSET_ICONS.find((i) => i.name === name);
    return found ? found.component : Tag; // Default ke Tag kalau tidak ketemu
};
