<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnbintModel extends Model
{
    use HasFactory;
    protected $connection = 'mysql';


    // Table name
    protected $table = 'db_ict_temp_data';

    // Primary key (if not 'id')
    protected $primaryKey = 'id';

    // Disable auto-increment if your primary key is not an integer
    public $incrementing = true;

    // If primary key is not an integer (e.g., string)
    protected $keyType = 'int';

    // Allow mass assignment for these columns
    protected $fillable = [
        'office_division',
        'type_of_ict_equipment',
        'year_acquired',
        'shelf_life',
        'brand',
        'model',
        'processor',
        'installed_memory_ram_size', 
        'installed_gpu',
        'range_category',
        'operating_system_version',
        'office_productivity',
        'microsoft_office_version',
        'office_productivity_version',
        'type_endpoint_protection',
        'computer_name',
        'serial_number',
        'property_number',
        'accountable_person',
        'sex',
        'status_of_employment',
        'actual_user',
        'sex_2',
        'status_of_employment_2',
        'nature_of_work',
        'remarks',
        'rict_code_local',
    ];

    // Optional: timestamps (created_at, updated_at)
    public $timestamps = true;
}
