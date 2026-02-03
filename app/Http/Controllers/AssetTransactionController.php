<?php

namespace App\Http\Controllers;

use App\Models\AssetTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetTransactionController extends Controller
{
    // AssetTransactionController.php

    public function index(Request $request)
    {
        // Filter tanggal dsb...
        $query = AssetTransaction::with('category')->where('user_id', $request->user()->id);
        // ... logic filter ...

        return Inertia::render('Dashboard/Asset/AssetTransaction', [
            'transactions' => $query->latest('date')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:1',
            'asset_category_id' => 'required|exists:asset_categories,id',
            'note' => 'nullable|string',
        ]);

        $request->user()->assetTransactions()->create($validated);

        return redirect()->back()->with('success', 'Transaksi berhasil dicatat.');
    }

    public function update(Request $request, AssetTransaction $assetTransaction)
    {
        // Authorize & Validate...
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:1',
            'asset_category_id' => 'required|exists:asset_categories,id',
            'note' => 'nullable|string',
        ]);

        $assetTransaction->update($validated);

        return redirect()->back()->with('success', 'Transaksi berhasil diupdate.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        AssetTransaction::whereIn('id', $request->ids)
            ->where('user_id', $request->user()->id)
            ->delete();

        return redirect()->back()->with('success', 'Transaksi dihapus.');
    }
}
