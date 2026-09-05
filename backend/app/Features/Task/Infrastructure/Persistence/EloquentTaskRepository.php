<?php

namespace App\Features\Task\Infrastructure\Persistence;

use App\Features\Task\Application\Ports\TaskRepositoryInterface;
use App\Features\Task\Domain\Task;

final class EloquentTaskRepository implements TaskRepositoryInterface
{
    public function __construct(private readonly TaskMapper $mapper)
    {
    }

    public function save(Task $task): Task
    {
        if ($task->id === null) {
            $model = EloquentTaskModel::create($this->mapper->toAttributes($task));
        } else {
            $model = EloquentTaskModel::findOrFail($task->id);
            $model->fill($this->mapper->toAttributes($task));
            $model->save();
        }

        return $this->mapper->toDomain($model);
    }

    public function findById(int $id): ?Task
    {
        $model = EloquentTaskModel::find($id);

        return $model !== null ? $this->mapper->toDomain($model) : null;
    }

    public function allTopLevelWithChildren(): array
    {
        $models = EloquentTaskModel::whereNull('parent_task_id')->with('children')->get();

        return $models->map(fn (EloquentTaskModel $model) => $this->mapper->toDomain($model))->all();
    }

    public function findByIdWithChildren(int $id): ?Task
    {
        $model = EloquentTaskModel::with('children')->find($id);

        return $model !== null ? $this->mapper->toDomain($model) : null;
    }

    public function updatePartial(int $id, array $attributes): ?Task
    {
        $model = EloquentTaskModel::find($id);

        if ($model === null) {
            return null;
        }

        $model->fill($attributes);
        $model->save();

        return $this->mapper->toDomain($model);
    }

    public function deleteWithChildren(int $id): bool
    {
        $model = EloquentTaskModel::find($id);

        if ($model === null) {
            return false;
        }

        EloquentTaskModel::where('parent_task_id', $id)->delete();
        $model->delete();

        return true;
    }
}
