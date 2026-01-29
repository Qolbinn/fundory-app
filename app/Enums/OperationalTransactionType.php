<?php

namespace App\Enums;

enum OperationalTransactionType: string
{
    case INCOME = 'INCOME';
    case EXPENSE = 'EXPENSE';
}
