<?php

namespace App\Models;

use App\Traits\HasRedenominatedBudgetLimit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OperationalCategory extends Model
{
    use HasRedenominatedBudgetLimit;

    protected $fillable = ['user_id', 'name', 'budget_limit', 'icon', 'color'];

    // Relasi ke User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke daftar transaksi harian
    public function transactions(): HasMany
    {
        return $this->hasMany(OperationalTransaction::class);
    }
}
