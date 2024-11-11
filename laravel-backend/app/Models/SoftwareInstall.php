<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoftwareInstall extends Model
{
    // Specify the table name if it's not the default (plural of model name)
    protected $table = 'tbl_software_install';
    
    // Define fillable columns
    protected $fillable = ['id', 'control_id', 'software', 'remarks'];
}