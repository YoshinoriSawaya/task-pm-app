<?php

namespace Tests\Unit\Task\Fakes;

use App\Features\Task\Domain\Task;
use App\Features\Task\Domain\TaskPriority;
use App\Features\Task\Domain\TaskStatus;

// Unitテスト間で重複していたTask組み立てロジックを1箇所に集約する(/code-review指摘の修正過程でDRYにした)。
final class TaskFactory
{
    public static function make(?int $parentTaskId = null): Task
    {
        return new Task(
            id: null,
            parentTaskId: $parentTaskId,
            title: 'タスク',
            description: null,
            status: TaskStatus::NotStarted,
            priority: TaskPriority::Medium,
            dueDate: null,
            definitionOfDone: null,
            estimatedEffort: null,
            actualEffort: null,
        );
    }
}
