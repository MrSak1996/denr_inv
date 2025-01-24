<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'users';

    protected $fillable = [
        'id',
        'geo_id',
        'region_c',
        'province_c',
        'city_mun_c',
        'first_name',
        'middle_name',
        'last_name',
        'ext_name',
        'division_id',
        'position_id',
        'name',
        'sex',
        'mobile_no',
        'complete_address',
        'email',
        'email_verified_at',
        'username',
        'password',
        'remember_token',
        'api_token',
        'employment_status',
        'roles',
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'id',
        'region_c',
        'province_c',
        'city_mun_c',
        'first_name',
        'middle_name',
        'last_name',
        'ext_name',
        'division_id',
        'position_id',
        'name',
        'sex',
        'mobile_no',
        'complete_address',
        'email',
        'email_verified_at',
        'username',
        'password',
        'remember_token',
        'api_token',
        'employment_status',
        'roles',
        'created_at',
        'updated_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
