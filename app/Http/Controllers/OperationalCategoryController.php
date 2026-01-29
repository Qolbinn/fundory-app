<?php

namespace App\Http\Controllers;

use App\Models\OperationalCategory;
use Illuminate\Http\Request;

class OperationalCategoryController extends Controller
{
    public function index()
    {
        // Tampilkan semua kategori milik user
        $categories = OperationalCategory::where('user_id', auth()->id())
            ->latest()
            ->get();

        return inertia('Dashboard/Operational/OperationalCategory', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'budget_limit' => 'nullable|numeric|min:0',
            'icon' => 'required|string',
            'color' => 'required|string',
        ]);

        $request->user()->operationalCategories()->create($validated);

        return redirect()->back();
    }

    public function update(Request $request, OperationalCategory $operational_category)
    {
        // dd($operational->exists, $operational->id, $operational->toArray());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'budget_limit' => 'nullable|numeric|min:0',
            'icon' => 'required|string',
            'color' => 'required|string',
        ]);

        $operational_category->update($validated);

        return redirect()->back();
    }

    public function destroy(OperationalCategory $operational)
    {
        $operational->delete();
        return redirect()->back();
    }
}
