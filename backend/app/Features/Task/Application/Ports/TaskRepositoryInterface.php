<?php

namespace App\Features\Task\Application\Ports;

use App\Features\Task\Domain\Task;

interface TaskRepositoryInterface
{
    public function save(Task $task): Task;

    public function findById(int $id): ?Task;

    /**
     * @return array<Task> トップレベル(親)タスク一覧。各要素のchildrenに子タスクを含む
     */
    public function allTopLevelWithChildren(): array;

    public function findByIdWithChildren(int $id): ?Task;

    /**
     * @param array<string, mixed> $attributes
     */
    public function updatePartial(int $id, array $attributes): ?Task;

    public function deleteWithChildren(int $id): bool;
}
