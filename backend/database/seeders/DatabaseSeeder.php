<?php

namespace Database\Seeders;

use App\Features\Bug\Infrastructure\Persistence\EloquentBugModel;
use App\Features\Task\Infrastructure\Persistence\EloquentTaskModel;
use Illuminate\Database\Seeder;

// デモ用シーダー(change-log.md C6, #54)。進捗ダッシュボード(EVM)・バグ検知度が
// 空のDBでも意味のある数値を示せるよう、見積り/実績工数と期限にばらつきを持たせる。
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $today = now()->startOfDay();

        // フェーズ1: 環境構築確認(完了済み)
        $envSetup = EloquentTaskModel::create([
            'title' => '環境構築確認',
            'description' => 'docker-compose・CIの疎通確認',
            'status' => 'done',
            'priority' => 'high',
            'due_date' => $today->copy()->subDays(5),
            'definition_of_done' => 'docker compose upで全サービスが起動し、CIがグリーンであること',
            'estimated_effort' => 1.0,
            'actual_effort' => 1.5,
        ]);
        EloquentTaskModel::create([
            'parent_task_id' => $envSetup->id,
            'title' => 'docker-compose起動確認',
            'status' => 'done',
            'priority' => 'high',
            'due_date' => $today->copy()->subDays(6),
            'estimated_effort' => 0.5,
            'actual_effort' => 0.7,
        ]);
        EloquentTaskModel::create([
            'parent_task_id' => $envSetup->id,
            'title' => 'CI疎通確認',
            'status' => 'done',
            'priority' => 'medium',
            'due_date' => $today->copy()->subDays(5),
            'estimated_effort' => 0.5,
            'actual_effort' => 0.4,
        ]);

        // フェーズ2: バックエンド実装(進行中)
        $backend = EloquentTaskModel::create([
            'title' => 'バックエンド実装',
            'description' => 'Task/Bug/Progressスライスの実装',
            'status' => 'in_progress',
            'priority' => 'high',
            'due_date' => $today->copy()->subDay(),
            'definition_of_done' => 'Pest全テストGreen、PHPStan level 8通過',
            'estimated_effort' => 3.5,
            'actual_effort' => 3.0,
        ]);
        EloquentTaskModel::create([
            'parent_task_id' => $backend->id,
            'title' => 'Task CRUD API実装',
            'status' => 'done',
            'priority' => 'high',
            'due_date' => $today->copy()->subDays(2),
            'definition_of_done' => 'api-design.mdの5エンドポイントがすべてテスト付きで動作すること',
            'estimated_effort' => 1.5,
            'actual_effort' => 1.8,
        ]);
        EloquentTaskModel::create([
            'parent_task_id' => $backend->id,
            'title' => 'Bugスライス実装',
            'status' => 'done',
            'priority' => 'medium',
            'due_date' => $today->copy()->subDay(),
            'estimated_effort' => 1.0,
            'actual_effort' => 0.9,
        ]);
        EloquentTaskModel::create([
            'parent_task_id' => $backend->id,
            'title' => 'Progressスライス実装(EVM計算)',
            'status' => 'in_progress',
            'priority' => 'medium',
            'due_date' => $today,
            'estimated_effort' => 1.0,
            'actual_effort' => 0.3,
        ]);

        // フェーズ3: フロントエンド実装(未着手、期限は未来)
        $frontend = EloquentTaskModel::create([
            'title' => 'フロントエンド実装',
            'description' => 'タスク管理画面・バグ管理画面・進捗ダッシュボードの実装',
            'status' => 'not_started',
            'priority' => 'high',
            'due_date' => $today->copy()->addDays(2),
            'estimated_effort' => 3.5,
        ]);
        EloquentTaskModel::create([
            'parent_task_id' => $frontend->id,
            'title' => 'タスク一覧・詳細画面実装',
            'status' => 'not_started',
            'priority' => 'high',
            'due_date' => $today->copy()->addDays(2),
            'estimated_effort' => 1.5,
        ]);
        EloquentTaskModel::create([
            'parent_task_id' => $frontend->id,
            'title' => '進捗ダッシュボード画面実装',
            'status' => 'not_started',
            'priority' => 'medium',
            'due_date' => $today->copy()->addDays(3),
            'estimated_effort' => 1.0,
        ]);

        // 見積りのみで期限未設定のタスク(PVには算入されないバックログ的な例)
        EloquentTaskModel::create([
            'title' => 'README最終整備',
            'status' => 'not_started',
            'priority' => 'low',
            'estimated_effort' => 0.5,
        ]);

        // バグ(一部を上記タスクに関連付け)
        EloquentBugModel::create([
            'related_task_id' => $envSetup->id,
            'title' => 'CIトリガーがpull_requestのままでpushでは動かない',
            'description' => 'change-log.md C5で修正済み',
            'severity' => 'high',
            'status' => 'resolved',
            'discovered_at' => $today->copy()->subDays(6),
            'resolved_at' => $today->copy()->subDays(6),
        ]);
        EloquentBugModel::create([
            'title' => 'composer.lockがcomposer.jsonに追従していない',
            'severity' => 'medium',
            'status' => 'resolved',
            'discovered_at' => $today->copy()->subDays(5),
            'resolved_at' => $today->copy()->subDays(5),
        ]);
        EloquentBugModel::create([
            'title' => '論理削除済みタスクを親に指定すると孤立タスクが作成できる',
            'description' => 'code-reviewで検出、C10で修正済み',
            'severity' => 'high',
            'status' => 'resolved',
            'discovered_at' => $today->copy()->subDay(),
            'resolved_at' => $today->copy()->subDay(),
        ]);
        EloquentBugModel::create([
            'title' => 'estimated_effortの上限バリデーションが無くDBエラーになる',
            'severity' => 'medium',
            'status' => 'resolved',
            'discovered_at' => $today->copy()->subDay(),
            'resolved_at' => $today->copy()->subDay(),
        ]);
        EloquentBugModel::create([
            'title' => 'PHPStanのデフォルトメモリ上限でOOMになることがある',
            'description' => '--memory-limit=512Mで回避。根本対応は未定',
            'severity' => 'low',
            'status' => 'open',
            'discovered_at' => $today,
        ]);
    }
}
