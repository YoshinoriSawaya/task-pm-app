<?php

namespace App\Features\Task\Application\UseCases;

use App\Features\Task\Domain\TaskPriority;

final class CreateTaskInput
{
    public function __construct(
        public readonly ?int $parentTaskId,
        public readonly string $title,
        public readonly ?string $description,
        public readonly ?TaskPriority $priority,
        public readonly ?string $dueDate,
        public readonly ?string $definitionOfDone,
        public readonly ?float $estimatedEffort,
    ) {
    }
}
