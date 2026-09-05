<?php

namespace App\Features\Task\Application\UseCases;

use App\Features\Task\Application\Ports\TaskRepositoryInterface;
use App\Features\Task\Domain\Task;

final class UpdateTask
{
    public function __construct(private readonly TaskRepositoryInterface $tasks)
    {
    }

    public function handle(int $id, UpdateTaskInput $input): ?Task
    {
        return $this->tasks->updatePartial($id, $input->attributes);
    }
}
