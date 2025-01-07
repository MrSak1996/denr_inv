<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['/api/*', 'sanctum/csrf-cookie', '/login', '/logout'],


    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://172.18.45.191:8080',
        'http://192.168.0.173:8080',
        'http://localhost:8080',
        'http://localhost:8000',
        'http://127.0.0.1:8000/api/',
        'http://127.0.0.1:8000/api/login',
        'http://127.0.0.1:8000/api/logout',
        'http://127.0.0.1:8080/api/login',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
