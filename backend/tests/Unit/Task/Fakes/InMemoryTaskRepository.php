<?php

namespace Tests\Unit\Task\Fakes;

use App\Features\Task\Application\Ports\TaskRepositoryInterface;
use App\Features\Task\Domain\Task;

// DB・フレームワークに一切依存しないTaskRepositoryInterfaceの実装(DIPの実証)。
// CreateTask等のApplication層のユースケースを、実DBを介さずに検証するために使う。
final class InMemoryTaskRepository implements TaskRepositoryInterface
{
    /** @var array<int, Task> */
    private array $tasks = [];

    private int $nextId = 1;

    public function save(Task $task): Task
    {
        $saved = new Task(
            id: $this->nextId,
            parentTaskId: $task->parentTaskId,
            title: $task->title,
            description: $task->description,
            status: $task->status,
            priority: $task->priority,
            dueDate: $task->dueDate,
            definitionOfDone: $task->definitionOfDone,
            estimatedEffort: $task->estimatedEffort,
            actualEffort: $task->actualEffort,
        );
        $this->tasks[$this->nextId] = $saved;
        $this->nextId++;

        return $saved;
    }

    public function findById(int $id): ?Task
    {
        return $this->tasks[$id] ?? null;
    }

    /**
     * @return array<Task>
     */
    public function allTopLevelWithChildren(): array
    {
        $topLevel = array_filter($this->tasks, fn (Task $task) => $task->parentTaskId === null);

        return array_values(array_map($this->withChildren(...), $topLevel));
    }

    public function findByIdWithChildren(int $id): ?Task
    {
        $task = $this->findById($id);

        return $task !== null ? $this->withChildren($task) : null;
    }

    // EloquentTaskRepositoryが`with('children')`で行う子タスクの読み込みを
    // インメモリ版でも再現する(/code-review指摘: LSP違反の修正)。
    private function withChildren(Task $task): Task
    {
        $children = array_values(
            array_filter($this->tasks, fn (Task $candidate) => $candidate->parentTaskId === $task->id)
        );

        return new Task(
            id: $task->id,
            parentTaskId: $task->parentTaskId,
            title: $task->title,
            description: $task->description,
            status: $task->status,
            priority: $task->priority,
            dueDate: $task->dueDate,
            definitionOfDone: $task->definitionOfDone,
            estimatedEffort: $task->estimatedEffort,
            actualEffort: $task->actualEffort,
            children: $children,
        );
    }

    /**
     * @param array<string, mixed> $attributes
     */
    public function updatePartial(int $id, array $attributes): ?Task
    {
        $existing = $this->findById($id);
        if ($existing === null) {
            return null;
        }

        $updated = new Task(
            id: $existing->id,
            parentTaskId: $existing->parentTaskId,
            title: $attributes['title'] ?? $existing->title,
            description: array_key_exists('description', $attributes) ? $attributes['description'] : $existing->description,
            status: $attributes['status'] ?? $existing->status,
            priority: $attributes['priority'] ?? $existing->priority,
            dueDate: array_key_exists('due_date', $attributes) ? $attributes['due_date'] : $existing->dueDate,
            definitionOfDone: array_key_exists('definition_of_done', $attributes) ? $attributes['definition_of_done'] : $existing->definitionOfDone,
            estimatedEffort: array_key_exists('estimated_effort', $attributes) ? $attributes['estimated_effort'] : $existing->estimatedEffort,
            actualEffort: array_key_exists('actual_effort', $attributes) ? $attributes['actual_effort'] : $existing->actualEffort,
        );
        $this->tasks[$id] = $updated;

        return $updated;
    }

    public function deleteWithChildren(int $id): bool
    {
        if (! isset($this->tasks[$id])) {
            return false;
        }

        foreach ($this->tasks as $taskId => $task) {
            if ($task->parentTaskId === $id) {
                unset($this->tasks[$taskId]);
            }
        }
        unset($this->tasks[$id]);

        return true;
    }
}
