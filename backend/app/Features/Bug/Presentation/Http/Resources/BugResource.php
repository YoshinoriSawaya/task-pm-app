<?php

namespace App\Features\Bug\Presentation\Http\Resources;

use App\Features\Bug\Domain\Bug;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Bug $resource
 */
class BugResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $bug = $this->resource;

        return [
            'id' => $bug->id,
            'related_task_id' => $bug->relatedTaskId,
            'title' => $bug->title,
            'description' => $bug->description,
            'severity' => $bug->severity->value,
            'status' => $bug->status->value,
            'discovered_at' => $bug->discoveredAt,
            'resolved_at' => $bug->resolvedAt,
            'created_at' => $bug->createdAt,
            'updated_at' => $bug->updatedAt,
        ];
    }
}
