<?php

namespace Database\Seeders;

use App\Enums\AssetCategoryType;
use App\Models\AssetCategory;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssetCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('role', 'demo')->first();

        $categories = [
            // ------------------------------------------------------------------
            // 1. REAL INCOME (is_rotation = FALSE)
            // Menambah Net Worth. Sumber daya beli utama.
            // ------------------------------------------------------------------
            [
                'name' => 'Gaji Bulanan',
                'type' => AssetCategoryType::INCOME,
                'is_rotation' => false,
                'icon' => 'utensils',
                'color' => '#10b981', // Emerald-500
            ],
            [
                'name' => 'Bonus & Tunjangan',
                'type' => AssetCategoryType::INCOME,
                'is_rotation' => false,
                'icon' => 'utensils',
                'color' => '#34d399', // Emerald-400
            ],
            [
                'name' => 'Dividen & Bunga',
                'type' => AssetCategoryType::INCOME,
                'is_rotation' => false,
                'icon' => 'utensils',
                'color' => '#6ee7b7', // Emerald-300
            ],

            // ------------------------------------------------------------------
            // 2. ROTATION INCOME (is_rotation = TRUE)
            // Mencairkan Aset (Divestasi). Tidak dianggap gaji.
            // ------------------------------------------------------------------
            [
                'name' => 'Jual Saham/Aset',
                'type' => AssetCategoryType::INCOME,
                'is_rotation' => true,
                'icon' => 'utensils',
                'color' => '#60a5fa', // Blue-400 (Warna senada dgn Invest)
            ],

            // ------------------------------------------------------------------
            // 3. INVESTMENT (is_rotation = TRUE)
            // Memindahkan Kas -> Aset. Bukan pengeluaran hangus.
            // ------------------------------------------------------------------
            [
                'name' => 'Beli Saham/Reksadana',
                'type' => AssetCategoryType::INVEST,
                'is_rotation' => true,
                'icon' => 'utensils',
                'color' => '#2563eb', // Blue-600
            ],
            [
                'name' => 'Tabungan/Deposito',
                'type' => AssetCategoryType::INVEST,
                'is_rotation' => true,
                'icon' => 'utensils',
                'color' => '#4f46e5', // Indigo-600
            ],
            [
                'name' => 'Tabungan Emas',
                'type' => AssetCategoryType::INVEST,
                'is_rotation' => true,
                'icon' => 'utensils',
                'color' => '#ca8a04', // Yellow-600
            ],

            // ------------------------------------------------------------------
            // 4. REAL EXPENSE (is_rotation = FALSE)
            // Mengurangi Net Worth. Uang keluar dari sistem Asset.
            // ------------------------------------------------------------------
            [
                'name' => 'Topup Operasional', // INI KATEGORI PALING PENTING
                'type' => AssetCategoryType::EXPENSE,
                'is_rotation' => false,
                'icon' => 'utensils',
                'color' => '#f97316', // Orange-500
            ],
            [
                'name' => 'Cicilan Besar (Rumah/Mobil)',
                'type' => AssetCategoryType::EXPENSE,
                'is_rotation' => false,
                'icon' => 'utensils',
                'color' => '#ea580c', // Orange-600
            ],
            [
                'name' => 'Biaya Admin/Pajak',
                'type' => AssetCategoryType::EXPENSE,
                'is_rotation' => false,
                'icon' => 'utensils',
                'color' => '#ef4444', // Red-500
            ],
        ];

        foreach ($categories as $category) {
            AssetCategory::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'name' => $category['name']
                ],
                $category
            );
        }
    }
}
