<?php
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://10.201.12.189:8000',
        'http://10.201.12.189:8080',
        'http://10.201.12.189:8000/api/export',
        'https://riis.denrcalabarzon.com/api/login',
        'https://riis.denrcalabarzon.com',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
