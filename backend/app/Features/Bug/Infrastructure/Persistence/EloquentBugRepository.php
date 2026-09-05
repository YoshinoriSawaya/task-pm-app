<?php

namespace App\Features\Bug\Infrastructure\Persistence;

use App\Features\Bug\Application\Ports\BugRepositoryInterface;
use App\Features\Bug\Domain\Bug;

final class EloquentBugRepository implements BugRepositoryInterface
{
    public function __construct(private readonly BugMapper $mapper)
    {
    }

    public function save(Bug $bug): Bug
    {
        $model = EloquentBugModel::create($this->mapper->toAttributes($bug));

        return $this->mapper->toDomain($model);
    }

    public function findById(int $id): ?Bug
    {
        $model = EloquentBugModel::find($id);

        return $model !== null ? $this->mapper->toDomain($model) : null;
    }

    public function all(): array
    {
        return EloquentBugModel::all()
            ->map(fn (EloquentBugModel $model) => $this->mapper->toDomain($model))
            ->all();
    }

    public function updatePartial(int $id, array $attributes): ?Bug
    {
        $model = EloquentBugModel::find($id);

        if ($model === null) {
            return null;
        }

        $model->fill($attributes);
        $model->save();

        return $this->mapper->toDomain($model);
    }

    public function delete(int $id): bool
    {
        $model = EloquentBugModel::find($id);

        if ($model === null) {
            return false;
        }

        $model->delete();

        return true;
    }
}
