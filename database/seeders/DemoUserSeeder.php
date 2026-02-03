<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $demoUser = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'password' => bcrypt('password123'),
                'role' => 'demo',
            ]
        );

        $this->call([
            OperationalCategorySeeder::class,
            OperationalTransactionSeeder::class,
            AssetCategorySeeder::class,
            AssetTransactionSeeder::class,
        ]);
    }
}
