<?php

namespace App\Features\Task\Infrastructure\Persistence;

use App\Features\Task\Domain\Task;
use App\Features\Task\Domain\TaskPriority;
use App\Features\Task\Domain\TaskStatus;

// EloquentモデルとDomainエンティティの相互変換(ADR-0001)。
final class TaskMapper
{
    public function toDomain(EloquentTaskModel $model): Task
    {
        return new Task(
            id: $model->id,
            parentTaskId: $model->parent_task_id,
            title: $model->title,
            description: $model->description,
            status: TaskStatus::from($model->status),
            priority: TaskPriority::from($model->priority),
            dueDate: $model->due_date?->format('Y-m-d'),
            definitionOfDone: $model->definition_of_done,
            estimatedEffort: $model->estimated_effort,
            actualEffort: $model->actual_effort,
            createdAt: $model->created_at?->toJSON(),
            updatedAt: $model->updated_at?->toJSON(),
            children: $model->relationLoaded('children')
                ? $model->children->map(fn (EloquentTaskModel $child) => $this->toDomain($child))->all()
                : [],
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toAttributes(Task $task): array
    {
        return [
            'parent_task_id' => $task->parentTaskId,
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status->value,
            'priority' => $task->priority->value,
            'due_date' => $task->dueDate,
            'definition_of_done' => $task->definitionOfDone,
            'estimated_effort' => $task->estimatedEffort,
            'actual_effort' => $task->actualEffort,
        ];
    }
}
