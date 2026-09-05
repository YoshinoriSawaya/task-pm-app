<?php

namespace App\Features\Bug\Application\Ports;

use App\Features\Bug\Domain\Bug;

interface BugRepositoryInterface
{
    /** 新規作成専用。更新はupdatePartial()を使う */
    public function save(Bug $bug): Bug;

    public function findById(int $id): ?Bug;

    /**
     * @return array<Bug>
     */
    public function all(): array;

    /**
     * @param array<string, mixed> $attributes
     */
    public function updatePartial(int $id, array $attributes): ?Bug;

    public function delete(int $id): bool;
}
