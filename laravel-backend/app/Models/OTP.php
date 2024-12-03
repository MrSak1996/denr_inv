<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OTP extends Model
{
    use HasFactory;
    
    protected $connection = 'mysql';

    protected $table = 'otps';

    protected $fillable = ['id','email','otp','is_verified','expires_at','created_at','updated_at'];

}
