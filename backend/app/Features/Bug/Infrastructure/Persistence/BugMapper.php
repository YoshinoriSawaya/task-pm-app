<?php

namespace App\Features\Bug\Infrastructure\Persistence;

use App\Features\Bug\Domain\Bug;
use App\Features\Bug\Domain\BugSeverity;
use App\Features\Bug\Domain\BugStatus;

final class BugMapper
{
    public function toDomain(EloquentBugModel $model): Bug
    {
        return new Bug(
            id: $model->id,
            relatedTaskId: $model->related_task_id,
            title: $model->title,
            description: $model->description,
            severity: BugSeverity::from($model->severity),
            status: BugStatus::from($model->status),
            discoveredAt: $model->discovered_at->format('Y-m-d'),
            resolvedAt: $model->resolved_at?->format('Y-m-d'),
            createdAt: $model->created_at?->toJSON(),
            updatedAt: $model->updated_at?->toJSON(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toAttributes(Bug $bug): array
    {
        return [
            'related_task_id' => $bug->relatedTaskId,
            'title' => $bug->title,
            'description' => $bug->description,
            'severity' => $bug->severity->value,
            'status' => $bug->status->value,
            'discovered_at' => $bug->discoveredAt,
            'resolved_at' => $bug->resolvedAt,
        ];
    }
}
