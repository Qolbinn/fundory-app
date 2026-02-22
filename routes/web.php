<?php

use App\Http\Controllers\AssetCategoryController;
use App\Http\Controllers\AssetPageController;
use App\Http\Controllers\AssetTransactionController;
use App\Http\Controllers\OperationalCategoryController;
use App\Http\Controllers\OperationalPageController;
use App\Http\Controllers\OperationalTransactionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // --- DASHBOARD UTAMA ---
    Route::get('/dashboard/operational', OperationalPageController::class . '@showOperationalDashboard')->name('dashboard.operational');

    // --- OPERATIONAL TRANSACTIONS ---
    Route::controller(OperationalTransactionController::class)->group(function () {
        Route::get('/dashboard/operational/transaction', 'index')
            ->name('operational.transaction');

        // Group Prefix '/operational' untuk Action (Store, Update, Destroy)
        Route::prefix('operational')->name('operational.')->group(function () {
            Route::post('/', 'store')->name('store');
            Route::put('/{transaction}', 'update')->name('update');
            Route::delete('/destroy/bulk', OperationalTransactionController::class . '@bulkDelete')
                ->name('bulk-delete');
        });
    });

    // --- OPERATIONAL CATEGORIES ---
    Route::controller(OperationalCategoryController::class)->group(function () {
        Route::get('/dashboard/operational/category', 'index')
            ->name('operational.category');
        Route::post('/operational-category', 'store')->name('operational-categories.store');
        Route::put('/operational-category/{operational_category}', 'update')
            ->name('operational-categories.update');
    });



    Route::get('/dashboard/asset', AssetPageController::class . '@showAssetDashboard')->name('dashboard.asset');

    // --- ASSET TRANSACTIONS ---
    Route::controller(AssetTransactionController::class)->group(function () {
        Route::get('/dashboard/asset/transaction', 'index')
            ->name('asset.transaction');
        Route::post('/asset-transaction', 'store')->name('asset-transactions.store');
        Route::put('/asset-transaction/{asset_transaction}', 'update')
            ->name('asset-transactions.update');
        Route::delete('/asset-transaction/destroy/bulk', AssetTransactionController::class . '@bulkDelete')
            ->name('asset-transactions.bulk-delete');
    });


    // --- ASSET CATEGORIES ---
    Route::controller(AssetCategoryController::class)->group(function () {
        Route::get('/dashboard/asset/category', 'index')
            ->name('asset.category');
        Route::post('/asset-category', 'store')->name('asset-categories.store');
        Route::put('/asset-category/{asset_category}', 'update')
            ->name('asset-categories.update');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
