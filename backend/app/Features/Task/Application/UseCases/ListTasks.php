<?php

namespace App\Features\Task\Application\UseCases;

use App\Features\Task\Application\Ports\TaskRepositoryInterface;

final class ListTasks
{
    public function __construct(private readonly TaskRepositoryInterface $tasks)
    {
    }

    /**
     * @return array<\App\Features\Task\Domain\Task>
     */
    public function handle(): array
    {
        return $this->tasks->allTopLevelWithChildren();
    }
}
