<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeripheralInformation extends Model
{
    use HasFactory;
    protected $connection = 'mysql';

    protected $table = 'tbl_peripherals';
    protected $fillable = [
        'id',
        'control_id',
        'division_id',
        'mon_brand_model1',
        'mon_brand_model2',
        'mon_sn1',
        'mon_sn2',
        'mon_qr_code1',
        'mon_qr_code2',
        'mon_pro_no1',
        'mon_pro_no2',
        'mon_acct_user1',
        'mon_acct_user2',
        'mon_actual_user1',
        'mon_actual_user2',
        'ups_qr_code',
        'ups_brand',
        'ups_model',
        'ups_acct_user',
        'ups_actual_user',
        'ups_property_no',
        'ups_sn',
        'monitor1Status',
        'monitor2Status',
        'ups_status',
        'created_at',
        'updated_at'
    ];
}
