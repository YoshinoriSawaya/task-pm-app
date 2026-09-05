<?php

namespace App\Features\Task\Application\UseCases;

use App\Features\Task\Application\Ports\TaskRepositoryInterface;
use App\Features\Task\Domain\Task;

final class GetTask
{
    public function __construct(private readonly TaskRepositoryInterface $tasks)
    {
    }

    public function handle(int $id): ?Task
    {
        return $this->tasks->findByIdWithChildren($id);
    }
}
