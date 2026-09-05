<?php

namespace App\Features\Task\Providers;

use App\Features\Task\Application\Ports\TaskRepositoryInterface;
use App\Features\Task\Infrastructure\Persistence\EloquentTaskRepository;
use Illuminate\Support\ServiceProvider;

// コンポジションルート(ADR-0001)。Domain/ApplicationはInfrastructureを直接参照しない。
class TaskServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TaskRepositoryInterface::class, EloquentTaskRepository::class);
    }
}
