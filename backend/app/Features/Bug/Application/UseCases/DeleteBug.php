<?php

namespace App\Features\Bug\Application\UseCases;

use App\Features\Bug\Application\Ports\BugRepositoryInterface;

final class DeleteBug
{
    public function __construct(private readonly BugRepositoryInterface $bugs)
    {
    }

    public function handle(int $id): bool
    {
        return $this->bugs->delete($id);
    }
}
