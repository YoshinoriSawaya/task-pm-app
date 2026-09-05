<?php

namespace App\Features\Bug\Application\UseCases;

use App\Features\Bug\Application\Ports\BugRepositoryInterface;
use App\Features\Bug\Domain\Bug;

final class GetBug
{
    public function __construct(private readonly BugRepositoryInterface $bugs)
    {
    }

    public function handle(int $id): ?Bug
    {
        return $this->bugs->findById($id);
    }
}
