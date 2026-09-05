<?php

namespace App\Features\Bug\Providers;

use App\Features\Bug\Application\Ports\BugRepositoryInterface;
use App\Features\Bug\Infrastructure\Persistence\EloquentBugRepository;
use Illuminate\Support\ServiceProvider;

class BugServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(BugRepositoryInterface::class, EloquentBugRepository::class);
    }
}
