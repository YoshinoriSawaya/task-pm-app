<?php

namespace App\Features\Bug\Application\UseCases;

use App\Features\Bug\Application\Ports\BugRepositoryInterface;

final class ListBugs
{
    public function __construct(private readonly BugRepositoryInterface $bugs)
    {
    }

    /**
     * @return array<\App\Features\Bug\Domain\Bug>
     */
    public function handle(): array
    {
        return $this->bugs->all();
    }
}
