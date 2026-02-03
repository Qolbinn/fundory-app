<?php

namespace App\Models;

use App\Enums\AssetCategoryType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetCategory extends Model
{
    protected $fillable = ['user_id', 'name', 'type', 'is_rotation', 'icon', 'color'];

    protected $casts = [
        'type' => AssetCategoryType::class,
        'is_rotation' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function transactions(): HasMany
    {
        return $this->hasMany(AssetTransaction::class);
    }
}
