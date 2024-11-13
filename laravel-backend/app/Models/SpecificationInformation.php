<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpecificationInformation extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $table = 'tbl_specification';

    protected $fillable = [
        'id',
        'control_id',
        'processor',
        'ram_type',
        'ram_capacity',
        'dedicated_information',
        'no_of_hdd',
        'hdd_capacity',
        'no_of_ssd',
        'ssd_capacity',
        'specs_gpu',
        'specs_net',
        'wireless_type',
        'created_at',
        'updated_at'
    ];
}
