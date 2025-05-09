<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    use HasFactory;
    
    protected $connection = 'mysql';

    protected $table = 'inventory_transaction_logs';

    protected $fillable = [
        'id', 'transaction_type','gen_info_id', 'inventory_id', 'item_name','accountable_user', 'quantity', 'previous_quantity', 'current_quantity', 'source_location', 'destination_location', 'transaction_date', 'remarks', 'status','user_id', 'created_at', 'updated_at' 
    ];
}
