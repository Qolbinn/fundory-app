<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OperationalCategorySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('role', 'demo')->first();

        DB::table('operational_categories')->insert([
            [
                'user_id' => $user->id,
                'name' => 'Makan & Minum',
                'budget_limit' => 1500,
                'icon' => 'utensils',
                'color' => '#22c55e',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $user->id,
                'name' => 'Transportasi',
                'budget_limit' => 300,
                'icon' => 'bus',
                'color' => '#3b82f6',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $user->id,
                'name' => 'Tagihan Rutin',
                'budget_limit' => 1000,
                'icon' => 'zap',
                'color' => '#f97316',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
