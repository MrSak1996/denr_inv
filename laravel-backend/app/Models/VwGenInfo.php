<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VwGenInfo extends Model
{
    use HasFactory;

    protected $table = 'vw_gen_info'; // Name of your database view

    protected $guarded = []; // Prevent mass assignment issues

    public $timestamps = false; // Views don’t usually have timestamps
}
