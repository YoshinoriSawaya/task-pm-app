<?php

namespace App\Features\Bug\Domain;

// フレームワーク非依存のエンティティ(ADR-0001, ADR-0002)。
// related_task_idはTaskスライスへのID参照のみで、Taskのドメインオブジェクトには依存しない。
final class Bug
{
    public function __construct(
        public readonly ?int $id,
        public readonly ?int $relatedTaskId,
        public readonly string $title,
        public readonly ?string $description,
        public readonly BugSeverity $severity,
        public readonly BugStatus $status,
        public readonly string $discoveredAt,
        public readonly ?string $resolvedAt,
        public readonly ?string $createdAt = null,
        public readonly ?string $updatedAt = null,
    ) {
    }
}
