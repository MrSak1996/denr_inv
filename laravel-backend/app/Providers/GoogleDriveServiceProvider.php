<?php

namespace App\Providers;

use Masbug\Flysystem\GoogleDriveAdapter;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;

class GoogleDriveServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    
     public function boot(): void
     {
        \Storage::extend('google', function ($app, $config) {
            $client = new \Google_Client();
            $client->setClientId(env('GOOGLE_CLIENT_ID')); // Ensure this matches
            $client->setClientSecret(env('GOOGLE_CLIENT_SECRET')); // Ensure this matches
            $client->setAccessType('offline');
    
        
            if ($client->isAccessTokenExpired()) {
                $newToken = $client->fetchAccessTokenWithRefreshToken(env('GOOGLE_REFRESH_TOKEN'));
                $client->setAccessToken($newToken);
            }
        
            $service = new \Google_Service_Drive($client);
            $adapter = new GoogleDriveAdapter($service, env('GOOGLE_DRIVE_FOLDER_ID')); // Ensure this matches
        
            return new \League\Flysystem\Filesystem($adapter);
        });
        
     }
     
}
