<?php

namespace App\Features\Task\Application\UseCases;

use App\Features\Task\Application\Ports\TaskRepositoryInterface;

final class DeleteTask
{
    public function __construct(private readonly TaskRepositoryInterface $tasks)
    {
    }

    /**
     * @return bool 削除できた場合true、対象が存在しない場合false
     */
    public function handle(int $id): bool
    {
        // 親タスクの場合は子タスクも合わせて論理削除する(er-diagram.md)
        return $this->tasks->deleteWithChildren($id);
    }
}
