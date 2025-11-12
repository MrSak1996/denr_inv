<?php

/**
 * This file has not changed since the first installed version
 */
return [
    'defaults' => [
        'guard' => 'sanctum',
        // 'guard' => 'web',
        'passwords' => 'users',
    ],
    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        'api' => [
            'driver' => 'token', // This should be the erroring line, in Illuminate\Auth\AuthManager it checks for the existence of a method 'create'.ucfirst($config['driver']).'Driver' which does not exist
            'provider' => 'users',
            'hash' => false,
        ],
        'sanctum' => [
            'driver' => 'sanctum',
            'provider' => 'users',
        ],
    ],
    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],
    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_resets',
            'expire' => 60,
        ],
    ],
];