<?php

namespace Database\Seeders;

use App\Enums\OperationalTransactionType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OperationalTransactionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('operational_transactions')->insert([
            [
                'user_id' => 1,
                'operational_category_id' => null,
                'amount' => 5000,
                'date' => now()->subDays(10)->toDateString(),
                'source_fund_label' => 'Saldo Awal',
                'type' => OperationalTransactionType::INCOME,
                'is_initial_balance' => true,
                'note' => 'Bujet bulan Januari',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 1,
                'operational_category_id' => 1, // Makan & Minum
                'amount' => 75,
                'date' => now()->subDays(8)->toDateString(),
                'source_fund_label' => null,
                'type' => OperationalTransactionType::EXPENSE,
                'is_initial_balance' => false,
                'note' => 'Makan siang',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 1,
                'operational_category_id' => 2, // Transportasi
                'amount' => 50,
                'date' => now()->subDays(6)->toDateString(),
                'source_fund_label' => null,
                'type' => OperationalTransactionType::EXPENSE,
                'is_initial_balance' => false,
                'note' => 'Bensin motor',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 1,
                'operational_category_id' => 3, // Tagihan Rutin
                'amount' => 35,
                'date' => now()->subDays(4)->toDateString(),
                'source_fund_label' => null,
                'type' => OperationalTransactionType::EXPENSE,
                'is_initial_balance' => false,
                'note' => 'Tagihan listrik',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
