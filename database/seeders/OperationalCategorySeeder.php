<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OperationalCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan nama 'icon' sesuai dengan 'name' di file category-config.tsx frontend
        DB::table('operational_categories')->insert([
            [
                'user_id' => 1,
                'name' => 'Makan & Minum',
                'budget_limit' => 1500,
                'icon' => 'utensils', // Sebelumnya pi-shopping-cart -> ganti jadi 'utensils' (Lucide)
                'color' => '#22c55e', // Green
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 1,
                'name' => 'Transportasi',
                'budget_limit' => 800,
                'icon' => 'bus', // Sebelumnya pi-car -> ganti jadi 'bus' (sesuai config)
                'color' => '#3b82f6', // Blue
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 1,
                'name' => 'Tagihan Rutin',
                'budget_limit' => 2000,
                'icon' => 'zap', // Sebelumnya pi-wallet -> ganti jadi 'zap' (listrik/tagihan)
                'color' => '#f97316', // Orange
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
