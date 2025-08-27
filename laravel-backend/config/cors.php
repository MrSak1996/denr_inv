<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://10.201.12.102:8080',
        'http://10.201.12.196:8080',
        'http://10.201.12.48:8080',
        'https://riis.denrcalabarzon.com'
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    // 'supports_credentials' => false original,
    'supports_credentials' => true,
];
