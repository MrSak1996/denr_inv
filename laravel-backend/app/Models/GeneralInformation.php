<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneralInformation extends Model
{
    use HasFactory;
    
    protected $connection = 'mysql';

    protected $table = 'tbl_general_info';

    protected $fillable = [
       'id', 'control_no', 'division_id', 'section_id', 'acct_person', 'acct_person_division_id', 'actual_user', 'sex', 'actual_user_division_id', 'actual_employment_type', 'work_nature_id', 'qr_code', 'equipment_type','os_installed','ms_office_installed', 'brand', 'model', 'property_no', 'serial_no', 'range_category', 'acquisition_cost', 'year_acquired','shelf_life','remarks','status', 'created_at', 'updated_at'
    ];
}
