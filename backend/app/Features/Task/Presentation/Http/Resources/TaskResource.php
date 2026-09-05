<?php

namespace App\Features\Task\Presentation\Http\Resources;

use App\Features\Task\Domain\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Task $resource
 */
class TaskResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $task = $this->resource;

        $data = [
            'id' => $task->id,
            'parent_task_id' => $task->parentTaskId,
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status->value,
            'priority' => $task->priority->value,
            'due_date' => $task->dueDate,
            'definition_of_done' => $task->definitionOfDone,
            'estimated_effort' => $task->estimatedEffort,
            'actual_effort' => $task->actualEffort,
            'created_at' => $task->createdAt,
            'updated_at' => $task->updatedAt,
        ];

        // subtasksは親タスクのみ持つ(api-design.md)。
        if (! $task->isChild()) {
            $data['subtasks'] = array_map(
                fn ($child) => (new self($child))->toArray($request),
                $task->children,
            );
        }

        return $data;
    }
}
