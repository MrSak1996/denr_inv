<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        $headers = [
            'Access-Control-Allow-Origin'      => '*',
            'Access-Control-Allow-Methods'     => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers'     => 'Authorization, Content-Type, X-Requested-With, X-Token-Auth, Accept',
            'Access-Control-Allow-Credentials' => 'true',
        ];

        // Handle preflight OPTIONS request and return early
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json('OK', 200, $headers);
        }

        // Process the actual request
        $response = $next($request);

        // Add headers to the response safely
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
