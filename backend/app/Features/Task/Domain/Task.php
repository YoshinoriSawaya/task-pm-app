<?php

namespace App\Features\Task\Domain;

// フレームワーク非依存のエンティティ(ADR-0001)。Eloquentへの依存はInfrastructure層に閉じ込める。
final class Task
{
    public function __construct(
        public readonly ?int $id,
        public readonly ?int $parentTaskId,
        public readonly string $title,
        public readonly ?string $description,
        public readonly TaskStatus $status,
        public readonly TaskPriority $priority,
        public readonly ?string $dueDate,
        public readonly ?string $definitionOfDone,
        public readonly ?float $estimatedEffort,
        public readonly ?float $actualEffort,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
        /** @var array<Task> 親タスクの場合のみ意味を持つ。読み込んでいなければ空配列 */
        public readonly array $children = [],
    ) {
    }

    public function isChild(): bool
    {
        return $this->parentTaskId !== null;
    }
}
