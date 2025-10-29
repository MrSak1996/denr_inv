<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemHistory extends Model
{
    use HasFactory;

    protected $table = 'tbl_item_history';

    protected $fillable = [
        'item_id',
        'date_transferred',
        'prev_owner',
        'prev_office',
        'new_owner',
        'new_office',
        'remarks',
        'recorded_by',
    ];
}
