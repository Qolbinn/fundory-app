<?php

namespace App\Models;

use App\Traits\HasRedenominatedAmount;
use Illuminate\Database\Eloquent\Model;

class AssetTransaction extends Model
{
    use HasRedenominatedAmount;

    protected $fillable = ['user_id', 'asset_category_id', 'amount', 'date', 'note'];

    public function category()
    {
        return $this->belongsTo(AssetCategory::class, 'asset_category_id');
    }
}
