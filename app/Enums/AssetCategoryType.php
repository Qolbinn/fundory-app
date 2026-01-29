<?php

namespace App\Enums;

enum AssetCategoryType: string
{
    case INCOME = 'INCOME';
    case GROWTH = 'GROWTH';
    case DRAIN  = 'DRAIN';
}
