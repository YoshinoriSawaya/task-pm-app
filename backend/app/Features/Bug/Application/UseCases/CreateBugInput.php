<?php

namespace App\Features\Bug\Application\UseCases;

use App\Features\Bug\Domain\BugSeverity;

final class CreateBugInput
{
    public function __construct(
        public readonly ?int $relatedTaskId,
        public readonly string $title,
        public readonly ?string $description,
        public readonly ?BugSeverity $severity,
        public readonly string $discoveredAt,
    ) {
    }
}
