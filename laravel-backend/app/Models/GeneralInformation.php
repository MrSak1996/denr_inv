<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneralInformation extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $table = 'tbl_general_info';
    protected $primaryKey = 'id';


    protected $fillable = [
        'id',
        'registered_loc',
        'control_no',
        'division_id',
        'section_id',
        
        'acct_person',
        'sex',
        'acct_status_of_employment',
        'acct_person_division_id',
        'acct_work_nature_id',

        'actual_user',
        'sex_2',
        'actual_employment_type',
        'actual_user_division_id',
        'work_nature_id',


        'qr_code',
        'equipment_type',
        'type_endpoint_protection',
        'computer_name',
        'os_installed',
        'ms_office_installed',
        'brand',
        'model',
        'property_no',
        'serial_no',
        'range_category',
        'acquisition_cost',
        'year_acquired',
        'shelf_life',
        'remarks',
        'status',
        'item_status',
        'softwareName',
        'softwareCategory',
        'updated_by',
        'created_at',
        'updated_at'
    ];
}
