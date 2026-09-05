<?php

namespace App\Features\Bug\Application\UseCases;

use App\Features\Bug\Application\Ports\BugRepositoryInterface;
use App\Features\Bug\Domain\Bug;
use App\Features\Bug\Domain\BugSeverity;
use App\Features\Bug\Domain\BugStatus;

final class CreateBug
{
    public function __construct(private readonly BugRepositoryInterface $bugs)
    {
    }

    public function handle(CreateBugInput $input): Bug
    {
        $bug = new Bug(
            id: null,
            relatedTaskId: $input->relatedTaskId,
            title: $input->title,
            description: $input->description,
            severity: $input->severity ?? BugSeverity::Medium,
            status: BugStatus::Open, // 登録時は常にopenから開始(api-design.md)
            discoveredAt: $input->discoveredAt,
            resolvedAt: null,
        );

        return $this->bugs->save($bug);
    }
}
