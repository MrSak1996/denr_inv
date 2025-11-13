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
        'prev_acct_owner',
        'prev_actual_owner',
        'prev_acct_user_office',
        'prev_actual_user_office',
        'new_actual_owner',
        'new_actual_user_office',
        'new_acct_owner',
        'new_acct_user_office',
        'remarks',
        'recorded_by',
        'created_at',
        'updated_at', 
       ];
}
