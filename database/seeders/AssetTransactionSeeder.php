<?php

namespace Database\Seeders;

use App\Models\AssetCategory;
use App\Models\AssetTransaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssetTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('role', 'demo')->first();

        // Ambil ID Kategori (Pastikan AssetCategorySeeder sudah dijalankan)
        $catGaji = AssetCategory::where('user_id', $user->id)->where('name', 'Gaji Bulanan')->first();
        $catOps  = AssetCategory::where('user_id', $user->id)->where('name', 'Topup Operasional')->first();
        $catBeliSaham = AssetCategory::where('user_id', $user->id)->where('name', 'Beli Saham/Reksadana')->first();
        $catJualSaham = AssetCategory::where('user_id', $user->id)->where('name', 'Jual Saham/Aset')->first();

        // Loop 3 Bulan Terakhir (misal: Des, Jan, Feb jika skrg Maret)
        for ($i = 2; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);

            // 1. TERIMA GAJI (Awal Bulan - Tgl 1)
            if ($catGaji) {
                AssetTransaction::create([
                    'user_id' => $user->id,
                    'asset_category_id' => $catGaji->id,
                    'date' => $monthDate->copy()->startOfMonth(),
                    'amount' => 10000000, // 10 Juta
                    'note' => 'Gaji Bulan ' . $monthDate->format('F'),
                ]);
            }

            // 2. TRANSFER OPERASIONAL (Awal Bulan - Tgl 2)
            if ($catOps) {
                AssetTransaction::create([
                    'user_id' => $user->id,
                    'asset_category_id' => $catOps->id,
                    'date' => $monthDate->copy()->startOfMonth()->addDay(),
                    'amount' => 4000000, // 4 Juta
                    'note' => 'Bujet Operasional ' . $monthDate->format('F'),
                ]);
            }

            // 3. INVESTASI RUTIN (Pertengahan Bulan - Tgl 15)
            if ($catBeliSaham) {
                AssetTransaction::create([
                    'user_id' => $user->id,
                    'asset_category_id' => $catBeliSaham->id,
                    'date' => $monthDate->copy()->day(15),
                    'amount' => 3000000, // 3 Juta
                    'note' => 'Nabung Saham BBCA',
                ]);
            }

            // 4. KASUS KHUSUS: JUAL SAHAM (Hanya di bulan terakhir untuk simulasi Churning)
            if ($i === 0 && $catJualSaham) {
                AssetTransaction::create([
                    'user_id' => $user->id,
                    'asset_category_id' => $catJualSaham->id,
                    'date' => $monthDate->copy()->day(20),
                    'amount' => 3500000,
                    'note' => 'Jual sebagian saham (Butuh Cash)',
                ]);
            }
        }
    }
}
