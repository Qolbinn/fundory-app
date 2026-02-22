<?php

namespace App\Http\Controllers;

use App\Enums\AssetCategoryType;
use App\Models\AssetTransaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetPageController extends Controller
{
    public function showAssetDashboard(Request $request)
    {
        $user = $request->user();

        // 1. Parsing Tanggal
        if ($request->filled(['start_date', 'end_date'])) {
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
        } else {
            $startDate = Carbon::now()->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();
        }

        // 2. Fetch Data Terpisah
        $allTimeStats = $this->getAllTimeStats($user);
        $periodStats = $this->getPeriodStats($user, $startDate, $endDate);
        $allocationChart = $this->getAllocationChartData($periodStats);
        $recentTransactions = $this->getRecentTransactions($user);

        return inertia('Dashboard/Asset/AssetDashboard', [
            'filters' => [
                'startDate' => $startDate->format('Y-m-d'),
                'endDate' => $endDate->format('Y-m-d'),
            ],
            'cards' => array_merge($allTimeStats, $periodStats),
            'allocationChart' => $allocationChart,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    // --- PRIVATE METHODS (The Brains) ---

    private function parseDate($dateString, $type)
    {
        if (!$dateString) {
            return $type === 'start'
                ? Carbon::now()->startOfMonth()
                : Carbon::now()->endOfMonth();
        }
        return $type === 'start'
            ? Carbon::parse($dateString)->startOfDay()
            : Carbon::parse($dateString)->endOfDay();
    }

    private function getAllTimeStats(User $user)
    {
        // Query Agregat Cepat (Satu kali query lebih baik, tapi ini agar readable kita pecah logicnya)

        // A. Saldo Liquid (Cash di Tangan)
        $income = AssetTransaction::where('user_id', $user->id)
            ->whereHas('category', fn($q) => $q->where('type', AssetCategoryType::INCOME))
            ->sum('amount');

        $expense = AssetTransaction::where('user_id', $user->id)
            ->whereHas('category', fn($q) => $q->where('type', AssetCategoryType::EXPENSE))
            ->sum('amount');

        $invest = AssetTransaction::where('user_id', $user->id)
            ->whereHas('category', fn($q) => $q->where('type', AssetCategoryType::INVEST))
            ->sum('amount');

        $liquidBalance = $income - $expense - $invest;

        // B. Total Aset Investasi (Nilai Buku)
        $soldRotation = AssetTransaction::where('user_id', $user->id)
            ->whereHas('category', fn($q) => $q->where('type', AssetCategoryType::INCOME)->where('is_rotation', true))
            ->sum('amount');

        $currentAssetValue = $invest - $soldRotation;

        return [
            'netWorth' => $liquidBalance + $currentAssetValue,
            'liquidBalance' => $liquidBalance,
        ];
    }

    private function getPeriodStats(User $user, Carbon $startDate, Carbon $endDate)
    {
        $query = AssetTransaction::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate]);

        // Gunakan Conditional Aggregation (Single Query) agar cepat
        $stats = $query->with('category')->get()->reduce(function ($carry, $trx) {
            $type = $trx->category->type;
            $isRotation = $trx->category->is_rotation;
            $amount = $trx->amount;

            // 1. Real Income (Gaji)
            if ($type === AssetCategoryType::INCOME && !$isRotation) {
                $carry['realIncome'] += $amount;
            }
            // 2. Living Cost (Expense)
            if ($type === AssetCategoryType::EXPENSE) {
                $carry['livingCost'] += $amount;
            }
            // 3. Investment Flow
            if ($type === AssetCategoryType::INVEST) {
                $carry['grossInvest'] += $amount;
            }
            if ($type === AssetCategoryType::INCOME && $isRotation) {
                $carry['rotationSell'] += $amount;
            }
            // 4. Cash Flow (In/Out)
            if ($type === AssetCategoryType::INCOME) {
                $carry['totalIn'] += $amount;
            } else {
                $carry['totalOut'] += $amount;
            }

            return $carry;
        }, [
            'realIncome' => 0,
            'livingCost' => 0,
            'grossInvest' => 0,
            'rotationSell' => 0,
            'totalIn' => 0,
            'totalOut' => 0,
        ]);

        return [
            'realIncome' => $stats['realIncome'],
            'livingCost' => $stats['livingCost'],
            'netSaving' => $stats['grossInvest'] - $stats['rotationSell'],
            'changeInCash' => $stats['totalIn'] - $stats['totalOut'],
        ];
    }

    private function getAllocationChartData(array $periodStats)
    {
        // Logic Alokasi Gaji (Pie Chart)
        $living = (float) $periodStats['livingCost'];
        $netInvest = max(0, $periodStats['netSaving']); // Jika minus (Divestasi), set 0
        $income = (float) $periodStats['realIncome'];

        // Sisa Kas (Unallocated)
        $unallocated = max(0, $income - ($living + $netInvest));

        // Format data sesuai props DonutChartCategory
        return [
            [
                'name' => 'Biaya Hidup',
                'amount' => $living,
                'fill' => '#f97316', // Orange
            ],
            [
                'name' => 'Investasi (Net)',
                'amount' => $netInvest,
                'fill' => '#3b82f6', // Blue
            ],
            [
                'name' => 'Sisa Kas',
                'amount' => $unallocated,
                'fill' => '#cbd5e1', // Slate
            ],
        ];
    }

    private function getRecentTransactions(User $user)
    {
        return AssetTransaction::with('category')
            ->where('user_id', $user->id)
            ->latest('date')
            ->take(5)
            ->get();
    }
}
