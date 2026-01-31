<?php

namespace App\Http\Controllers;

use App\Models\OperationalTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OperationalTransactionController extends Controller
{

    public function index(Request $request)
    {
        // 1. Tentukan Range Tanggal
        // Jika user kirim params, pakai itu. Jika tidak, pakai Default (Awal Bulan - Hari Ini).
        if ($request->filled(['start_date', 'end_date'])) {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
        } else {
            $startDate = Carbon::now()->startOfMonth()->format('Y-m-d');
            $endDate = Carbon::now()->format('Y-m-d');
        }

        // 2. Build Query
        $transactions = OperationalTransaction::query()
            ->with('category')
            // Filter berdasarkan range tanggal yang sudah ditentukan di atas
            ->whereDate('date', '>=', $startDate)
            ->whereDate('date', '<=', $endDate)
            ->latest('date')
            ->get()
            ->map(fn($txn) => [
                'id' => $txn->id,
                'date' => $txn->date,
                'amount' => $txn->amount,
                'type' => $txn->type,
                'operational_category_id' => $txn->operational_category_id,
                'category' => $txn->category ? [
                    'name' => $txn->category->name,
                    'color' => $txn->category->color,
                    'icon' => $txn->category->icon,
                ] : null,
                'note' => $txn->note,
            ]);

        // 3. Return Inertia
        return inertia('Dashboard/Operational/OperationalTransaction', [
            'transactions' => $transactions,
            // (Opsional tapi Recommended) Kirim balik range tanggal ke Frontend
            // agar DatePicker UI tahu tanggal apa yang sedang aktif/default.
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        // Validasi
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:1',
            'type' => 'required|in:INCOME,EXPENSE',
            'operational_category_id' => 'required|exists:operational_categories,id',
            'note' => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = auth()->id();

        OperationalTransaction::create($validated);

        // Redirect (Otomatis trigger update di Inertia Page)
        return redirect()->back()->with('success', 'Transaksi berhasil disimpan.');
    }

    public function update(Request $request, OperationalTransaction $transaction)
    {
        // Pastikan user hanya bisa edit punya sendiri
        if ($transaction->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:1',
            'type' => 'required|in:INCOME,EXPENSE',
            'operational_category_id' => 'nullable|exists:operational_categories,id',
            'note' => 'nullable|string|max:255',
        ]);

        $transaction->update($validated);


        return redirect()->back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function bulkDelete(Request $request)
    {
        // Validasi input harus berupa array ID
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:operational_transactions,id', // Pastikan ID valid
        ]);

        OperationalTransaction::whereIn('id', $request->input('ids'))->delete();

        return redirect()->back()->with('message', 'Data berhasil dihapus.');
    }
}
