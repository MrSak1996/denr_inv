<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Hypweb\Flysystem\GoogleDrive\GoogleDriveAdapter;
use League\Flysystem\Filesystem;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
{
    $this->app->singleton('google', function ($app) {
        $client = new \Google\Client();
        $client->setClientId(config('filesystems.disks.google.client_id'));
        $client->setClientSecret(config('filesystems.disks.google.client_secret'));
        $client->refreshToken(config('filesystems.disks.google.refresh_token'));

        $service = new \Google\Service\Drive($client);

        $adapter = new GoogleDriveAdapter($service, config('filesystems.disks.google.folder_id'));
        return new Filesystem($adapter);
    });
}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
