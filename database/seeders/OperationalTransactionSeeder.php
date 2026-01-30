<?php

namespace Database\Seeders;

use App\Models\OperationalCategory;
use App\Models\OperationalTransaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OperationalTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('role', 'demo')->first();
        if (! $user) return;

        $categories = OperationalCategory::where('user_id', $user->id)->get();

        // 3 bulan terakhir
        for ($i = 0; $i < 3; $i++) {
            $month = now()->subMonths($i)->startOfMonth();

            // INCOME tanggal 1
            $this->seedMonthlyIncome($user, $month);

            foreach ($categories as $category) {
                match ($category->name) {
                    'Makan & Minum'  => $this->seedMakanMinum($user, $category, $month),
                    'Transportasi'  => $this->seedTransportasi($user, $category, $month),
                    'Tagihan Rutin' => $this->seedTagihanRutin($user, $category, $month),
                    default => null,
                };
            }
        }
    }

    protected function seedMonthlyIncome(User $user, Carbon $month): void
    {
        OperationalTransaction::create([
            'user_id' => $user->id,
            'amount' => 2000000,
            'date' => $month->copy()->day(1),
            'type' => 'INCOME',
            'is_initial_balance' => false,
            'note' => 'Bujet Bulanan',
        ]);
    }

    protected function seedMakanMinum(User $user, OperationalCategory $category, Carbon $month): void
    {
        $ranges = [
            'Makan siang' => [10000, 20000],
            'Makan malam' => [15000, 25000],
            'Jajan'       => [5000, 15000],
        ];

        $budget = $category->budget_limit;
        $date = $month->copy();

        while ($date->month === $month->month && $budget > 0) {

            foreach (['Makan siang', 'Makan malam'] as $note) {
                if ($budget <= 0) break 2;

                $amount = $this->randomAmount($ranges[$note], $budget);
                $this->createExpense($user, $category, $date, $amount, $note);
                $budget -= $amount;
            }

            // Jajan opsional (50%)
            if ($budget > 0 && rand(0, 1)) {
                $amount = $this->randomAmount($ranges['Jajan'], $budget);
                $this->createExpense($user, $category, $date, $amount, 'Jajan');
                $budget -= $amount;
            }

            $date->addDay();
        }
    }


    protected function seedTransportasi(User $user, OperationalCategory $category, Carbon $month): void
    {
        $ranges = [
            'Bensin' => [15000, 30000],
            'Parkir' => [2000, 5000],
            'Transport harian' => [5000, 15000],
        ];

        $budget = $category->budget_limit;

        while ($budget > 0) {
            $note = array_rand($ranges);
            $amount = $this->randomAmount($ranges[$note], $budget);

            $this->createExpense(
                $user,
                $category,
                $this->randomDateInMonth($month),
                $amount,
                $note
            );

            $budget -= $amount;
        }
    }

    protected function seedTagihanRutin(User $user, OperationalCategory $category, Carbon $month): void
    {
        $ranges = [
            'Listrik'  => [150000, 300000],
            'Internet' => [100000, 200000],
            'Air'      => [50000, 100000],
        ];

        $budget = $category->budget_limit;
        $dates = [13, 14, 15];

        foreach ($ranges as $note => $range) {
            if ($budget <= 0) break;

            $amount = $this->randomAmount($range, $budget);

            $this->createExpense(
                $user,
                $category,
                $month->copy()->day($dates[array_rand($dates)]),
                $amount,
                $note
            );

            $budget -= $amount;
        }
    }

    protected function randomAmount(array $range, int $budget): int
    {
        [$min, $max] = $range;

        if ($budget < $min) {
            return $budget;
        }

        return rand($min, min($max, $budget));
    }


    protected function randomDateInMonth(Carbon $month): Carbon
    {
        return $month->copy()->day(rand(1, $month->daysInMonth));
    }

    protected function createExpense(
        User $user,
        OperationalCategory $category,
        Carbon $date,
        float $amount,
        string $note
    ): void {
        OperationalTransaction::create([
            'user_id' => $user->id,
            'operational_category_id' => $category->id,
            'amount' => $amount,
            'date' => $date,
            'type' => 'EXPENSE',
            'note' => $note,
        ]);
    }
}
