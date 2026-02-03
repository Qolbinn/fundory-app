<?php

namespace App\Http\Controllers;

use App\Enums\AssetCategoryType;
use App\Models\AssetCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AssetCategoryController extends Controller
{
    public function index()
    {
        // Tampilkan semua kategori milik user
        $categories = AssetCategory::where('user_id', auth()->id())
            ->latest()
            ->get();

        return inertia('Dashboard/Asset/AssetCategory', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(AssetCategoryType::class)],
            'is_rotation' => ['required', 'boolean'],
            'icon' => ['required', 'string', 'max:50'],
            'color' => ['required', 'string', 'max:20'],
        ]);

        // --- BACKEND LOGIC ENFORCEMENT ---
        // Kita timpa nilai is_rotation sesuai aturan bisnis agar aman
        $type = AssetCategoryType::from($validated['type']);

        if ($type === AssetCategoryType::INVEST) {
            $validated['is_rotation'] = true; // Investasi PASTI rotasi
        } elseif ($type === AssetCategoryType::EXPENSE) {
            $validated['is_rotation'] = false; // Pengeluaran PASTI uang hilang (Real Flow)
        }
        // Jika INCOME, kita biarkan nilai sesuai input user (bisa true/false)

        $request->user()->assetCategories()->create($validated);

        return redirect()->back()->with('success', 'Kategori aset berhasil dibuat.');
    }

    public function update(Request $request, AssetCategory $assetCategory)
    {
        // Pastikan user hanya bisa edit kategori miliknya sendiri
        if ($assetCategory->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(AssetCategoryType::class)],
            'is_rotation' => ['required', 'boolean'],
            'icon' => ['required', 'string', 'max:50'],
            'color' => ['required', 'string', 'max:20'],
        ]);

        // --- BACKEND LOGIC ENFORCEMENT ---
        $type = AssetCategoryType::from($validated['type']);

        if ($type === AssetCategoryType::INVEST) {
            $validated['is_rotation'] = true;
        } elseif ($type === AssetCategoryType::EXPENSE) {
            $validated['is_rotation'] = false;
        }

        $assetCategory->update($validated);

        return redirect()->back()->with('success', 'Kategori aset berhasil diperbarui.');
    }

    // Method destroy (Opsional, jika dibutuhkan)
    public function destroy(Request $request, AssetCategory $assetCategory)
    {
        if ($assetCategory->user_id !== $request->user()->id) {
            abort(403);
        }

        // Cek apakah kategori sudah dipakai transaksi
        if ($assetCategory->transactions()->exists()) {
            return redirect()->back()->withErrors(['error' => 'Kategori tidak bisa dihapus karena sudah memiliki transaksi.']);
        }

        $assetCategory->delete();

        return redirect()->back()->with('success', 'Kategori dihapus.');
    }
}
