<?php

namespace App\Enums;

enum AssetCategoryType: string
{
    case INCOME = 'INCOME';
    case INVEST = 'INVEST';
    case EXPENSE = 'EXPENSE';
}
