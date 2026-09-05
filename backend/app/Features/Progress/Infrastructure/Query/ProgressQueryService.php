<?php

namespace App\Features\Progress\Infrastructure\Query;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

// CQRS的な読み取り専用クエリサービス(ADR-0002)。tasks/bugsを直接クエリし、
// Task/Bugスライスのユースケース・リポジトリは経由しない。
final class ProgressQueryService
{
    /**
     * @return Collection<int, \stdClass> 末端タスク(子タスクを持たないタスク)
     */
    public function leafTasks(): Collection
    {
        $parentIdsWithChildren = DB::table('tasks')
            ->whereNotNull('parent_task_id')
            ->whereNull('deleted_at')
            ->distinct()
            ->pluck('parent_task_id');

        return DB::table('tasks')
            ->whereNull('deleted_at')
            ->whereNotIn('id', $parentIdsWithChildren)
            ->get();
    }

    /**
     * @return Collection<int, \stdClass>
     */
    public function bugs(): Collection
    {
        return DB::table('bugs')->whereNull('deleted_at')->get();
    }
}
