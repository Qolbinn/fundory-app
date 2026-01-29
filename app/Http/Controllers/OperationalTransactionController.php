<?php

namespace App\Http\Controllers;

use App\Models\OperationalTransaction;
use Illuminate\Http\Request;

class OperationalTransactionController extends Controller
{
    //

    public function index()
    {
        $transactions = OperationalTransaction::query()
            ->with('category') // Eager load biar gak N+1 Query
            ->latest('date')   // Urutkan tanggal terbaru
            ->paginate(10)     // Server-side pagination
            ->through(fn($txn) => [
                'id' => $txn->id,
                'date' => $txn->date, // Atau format di sini: $txn->date->format('d M Y')
                'amount' => $txn->amount,
                'type' => $txn->type, // Pastikan ini string/enum value
                'operational_category_id' => $txn->operational_category_id,
                'category' => $txn->category ? [
                    'name' => $txn->category->name,
                    'color' => $txn->category->color,
                    'icon' => $txn->category->icon,
                ] : null,
                'note' => $txn->note,
            ]);

        return inertia('Dashboard/Operational/OperationalTransaction', [
            'transactions' => $transactions,
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
        // dd($transaction);
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
}
