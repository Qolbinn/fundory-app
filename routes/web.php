<?php

use App\Http\Controllers\OperationalCategoryController;
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
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Operational/OperationalDashboard');
    })->name('dashboard');


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
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
