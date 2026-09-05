<?php

namespace App\Features\Bug\Application\UseCases;

use App\Features\Bug\Application\Ports\BugRepositoryInterface;
use App\Features\Bug\Domain\Bug;

final class UpdateBug
{
    public function __construct(private readonly BugRepositoryInterface $bugs)
    {
    }

    public function handle(int $id, UpdateBugInput $input): ?Bug
    {
        return $this->bugs->updatePartial($id, $input->attributes);
    }
}
