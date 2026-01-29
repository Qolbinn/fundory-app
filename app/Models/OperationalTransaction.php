<?php

namespace App\Models;

use App\Enums\OperationalTransactionType;
use App\Traits\HasRedenominatedAmount;
use Illuminate\Database\Eloquent\Model;

class OperationalTransaction extends Model
{
    use HasRedenominatedAmount;

    protected $casts = [
        'type' => OperationalTransactionType::class,
    ];

    protected $fillable = [
        'user_id',
        'operational_category_id',
        'amount',
        'date',
        'source_fund_label',
        'is_initial_balance',
        'note',
        'type',
    ];

    public function category()
    {
        return $this->belongsTo(OperationalCategory::class, 'operational_category_id');
    }
}
