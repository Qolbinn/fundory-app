<?php

namespace App\Http\Controllers;

use App\Models\OperationalCategory;
use App\Models\OperationalTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Database\Eloquent\Builder;

class PageController extends Controller
{
    public function showOperationalDashboard(Request $request)
    {
        // 1. SETUP FILTER DATE
        if ($request->filled(['start_date', 'end_date'])) {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
        } else {
            $startDate = Carbon::now()->startOfMonth()->format('Y-m-d');
            $endDate = Carbon::now()->format('Y-m-d');
        }

        // 2. BASE QUERY (Untuk Metrics & Pie Chart)
        $baseQuery = OperationalTransaction::query()
            ->whereDate('date', '>=', $startDate)
            ->whereDate('date', '<=', $endDate);

        // 3. HITUNG METRICS (Data Ringan - Langsung Load)
        $totalExpense = (clone $baseQuery)->where('type', 'EXPENSE')->sum('amount');
        $totalIncome = (clone $baseQuery)->where('type', 'INCOME')->sum('amount');
        $totalTransactions = (clone $baseQuery)->count();
        $currentBalance = $totalIncome - $totalExpense;

        return inertia('Dashboard/Operational/OperationalDashboard', [
            // A. Data Instan
            'metrics' => [
                'balance' => $currentBalance,
                'total_expense' => $totalExpense,
                'total_transactions' => $totalTransactions,
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],

            // B. Data Berat (Deferred) -> Panggil Private Method
            'expense_pie_chart' => Inertia::defer(
                fn() =>
                $this->getPieChartData($baseQuery)
            ),

            'expense_line_chart' => Inertia::defer(
                fn() =>
                $this->getLineChartData($startDate, $endDate)
            ),

            // 1. Budget Realization
            'budget_realization' => $this->getBudgetRealization($startDate, $endDate),

            // 2. Recent Transactions (Top 5 up to End Date)
            'recent_transactions' => $this->getRecentTransactions($endDate),
        ]);
    }

    /**
     * Logic Pengambilan Data Pie Chart (Kategori Pengeluaran)
     */
    private function getPieChartData(Builder $baseQuery): array
    {
        return (clone $baseQuery)
            ->where('type', 'EXPENSE')
            ->with('category')
            ->selectRaw('operational_category_id, sum(amount) as total_amount, count(*) as transaction_count')
            ->groupBy('operational_category_id')
            ->get()
            ->map(function ($item) {
                // Handle Kategori yang dihapus / null
                if (!$item->operational_category_id || !$item->category) {
                    return [
                        'name' => 'Lainnya',
                        'amount' => (float) $item->total_amount,
                        'count' => $item->transaction_count,
                        'fill' => '#94a3b8', // Slate-400
                    ];
                }

                return [
                    'name' => $item->category->name,
                    'amount' => (float) $item->total_amount,
                    'count' => $item->transaction_count,
                    'fill' => $item->category->color,
                ];
            })
            // Gabungkan jika ada multiple "Lainnya" atau nama kategori duplikat (opsional safety)
            ->groupBy('name')
            ->map(function ($group) {
                return [
                    'name' => $group->first()['name'],
                    'amount' => $group->sum('amount'),
                    'count' => $group->sum('count'),
                    'fill' => $group->first()['fill'],
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Logic Pengambilan Data Line Chart (Tren Bulanan)
     */
    private function getLineChartData(string $startDate, string $endDate): array
    {
        $cStart = Carbon::parse($startDate);
        $cEnd   = Carbon::parse($endDate);

        // Logic Range: Jika selisih < 12 bulan, mundur 11 bulan dari End Date
        $diffInMonths = $cStart->diffInMonths($cEnd);

        if ($diffInMonths < 12) {
            $chartStart = $cEnd->copy()->subMonths(11)->startOfMonth();
            $chartEnd   = $cEnd->copy()->endOfMonth();
        } else {
            $chartStart = $cStart->copy()->startOfMonth();
            $chartEnd   = $cEnd->copy()->endOfMonth();
        }

        // Query Aggregat per Bulan
        $expensesByMonth = OperationalTransaction::query()
            ->where('type', 'EXPENSE')
            ->whereBetween('date', [$chartStart->format('Y-m-d'), $chartEnd->format('Y-m-d')])
            // Gunakan DATE_FORMAT MySQL (Sesuaikan jika pakai DB lain)
            ->selectRaw("DATE_FORMAT(date, '%Y-%m') as month_year, sum(amount) as total")
            ->groupBy('month_year')
            ->pluck('total', 'month_year')
            ->toArray();

        // Looping untuk mengisi bulan yang kosong dengan 0
        $lineChartData = [];
        $period = $chartStart->copy();

        while ($period <= $chartEnd) {
            $key = $period->format('Y-m');

            $lineChartData[] = [
                'month'  => $period->translatedFormat('M y'), // Label X-Axis (Jan 24)
                'amount' => (int) ($expensesByMonth[$key] ?? 0),
                'full_date' => $period->translatedFormat('F Y') // Tooltip Info
            ];

            $period->addMonth();
        }

        return $lineChartData;
    }

    private function getBudgetRealization(string $startDate, string $endDate): array
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        // 1. FIX LOGIC BULAN (Calendar Month Logic)
        // Menggunakan selisih tahun dan bulan, bukan diffInMonths (hari).
        // Rumus: (BedaTahun * 12) + BedaBulan + 1 (inklusif)
        $monthMultiplier = (($end->year - $start->year) * 12) + ($end->month - $start->month) + 1;

        // Safety: Minimal 1 bulan
        $monthMultiplier = max(1, $monthMultiplier);

        return OperationalCategory::query()
            ->where('budget_limit', '>', 0)
            ->withSum(['transactions' => function ($query) use ($startDate, $endDate) {
                $query->where('type', 'EXPENSE')
                    ->whereBetween('date', [$startDate, $endDate]);
            }], 'amount')
            ->get()
            ->map(function ($category) use ($monthMultiplier) {
                // 2. AMBIL RAW VALUE (Ambil nilai DB: 5000)
                // Pakai getRawOriginal agar tidak tertukar jika Trait sudah otomatis mengalikan
                $rawBudgetLimit = $category->getRawOriginal('budget_limit') ?? $category->budget_limit;
                $rawUsedAmount = $category->transactions_sum_amount ?? 0;

                // Hitung Total Budget sesuai durasi bulan (Misal: 3 bulan x 5000 = 15000)
                $totalRawBudget = $rawBudgetLimit * $monthMultiplier;

                // 3. HITUNG PERSENTASE (Raw vs Raw = Aman)
                $percentage = $totalRawBudget > 0
                    ? ($rawUsedAmount / $totalRawBudget) * 100
                    : 0;

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'color' => $category->color,

                    // 4. FORMAT OUTPUT KE FRONTEND (Kali 1000 agar jadi Rupiah Penuh)
                    // DB: 15.0 -> Frontend: 15.000 (Rp 15.000)
                    'target' => (float) ($totalRawBudget * 1000),
                    'used' => (float) ($rawUsedAmount * 1000),

                    'percentage' => round($percentage, 1),
                    'is_over_budget' => $rawUsedAmount > $totalRawBudget
                ];
            })
            ->sortByDesc('percentage')
            ->values()
            ->toArray();
    }

    /**
     * Data 2: 5 Transaksi Terakhir (Berdasarkan End Date)
     */
    private function getRecentTransactions(string $endDate): array
    {
        return OperationalTransaction::query()
            ->with('category')
            ->whereDate('date', '<=', $endDate) // Rule: Berdasarkan end date filter
            ->latest('date') // Urutkan tanggal terbaru
            ->latest('id')   // Fallback jika tanggal sama
            ->limit(5)
            ->get()
            ->map(fn($txn) => [
                'id' => $txn->id,
                // 'date' => $txn->date->format('d M Y'),
                'note' => $txn->note,
                'amount' => (float) $txn->amount,
                'type' => $txn->type,
                'category_name' => $txn->category->name ?? 'Lainnya',
                'category_color' => $txn->category->color ?? '#94a3b8',
            ])
            ->toArray();
    }
}
