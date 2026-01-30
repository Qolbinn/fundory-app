<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait HasRedenominatedBudgetLimit
{
    protected function budgetLimit(): Attribute
    {
        return Attribute::make(
            get: fn($value) => (float) $value * 1000,
            set: fn($value) => (float) $value / 1000,
        );
    }
}
