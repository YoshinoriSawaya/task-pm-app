<?php

// ============================================================================
// これは実際に動作するアプリケーションコードではありません。
// docs/architecture/refactoring-comparison.md の「Before」として、
// もしADR-0001(Vertical Slice + Hexagonal)を採用せず、Laravelの
// デフォルトの発想(app/Http/Controllers に素朴に実装する)のまま
// タスク作成機能を書いていたら、という思考実験の例示コードです。
// composerのオートロード対象にも、ルーティングにも含めていません。
// ============================================================================

namespace App\Http\Controllers;

use App\Models\Task; // Eloquentモデルを直接参照(Domain層が存在しない)
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    // タスク作成という1つの操作のために、①リクエスト処理②入力検証
    // ③ビジネスルール(2階層制約)④永続化⑤レスポンス整形、という
    // 5つの異なる関心事すべてを、この1メソッドが背負っている(SRP違反)。
    public function store(Request $request): JsonResponse
    {
        // ① + ② HTTP入力の取得とバリデーションがベタ書きされている。
        // FormRequestのような独立した検証層が存在しない。
        $validated = $request->validate([
            'parent_task_id' => 'nullable|integer|exists:tasks,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|in:high,medium,low',
            'due_date' => 'nullable|date',
            'definition_of_done' => 'nullable|string',
            'estimated_effort' => 'nullable|numeric|min:0',
        ]);

        // ③ ビジネスルール(2階層制約)がコントローラーの中に直接書かれ、
        // かつEloquentの具象クラス(Task)に直接依存している(DIP違反)。
        // 「論理削除済みタスクを親に指定できてしまう」というバグも、
        // ここでは`whereNull('deleted_at')`を書き忘れると即座に混入する。
        if (isset($validated['parent_task_id'])) {
            $parent = Task::find($validated['parent_task_id']);
            if ($parent !== null && $parent->parent_task_id !== null) {
                return response()->json([
                    'message' => "指定した親タスクは既に子タスクのため、これ以上ネストできません。",
                ], 422);
            }
        }

        // ④ 永続化もEloquentへの直接依存。テスト時にDBを避ける手段がない
        // (インターフェースが存在しないため、Fakeに差し替えられない)。
        $task = Task::create([
            'parent_task_id' => $validated['parent_task_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => 'not_started', // マジックストリングが散らばる
            'priority' => $validated['priority'] ?? 'medium',
            'due_date' => $validated['due_date'] ?? null,
            'definition_of_done' => $validated['definition_of_done'] ?? null,
            'estimated_effort' => $validated['estimated_effort'] ?? null,
        ]);

        // ⑤ レスポンス整形もこの場でベタ書き。他のエンドポイント
        // (詳細取得等)とレスポンス形式を共通化する仕組みがない。
        return response()->json([
            'id' => $task->id,
            'parent_task_id' => $task->parent_task_id,
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status,
            'priority' => $task->priority,
            'due_date' => $task->due_date,
            'definition_of_done' => $task->definition_of_done,
            'estimated_effort' => $task->estimated_effort,
            'actual_effort' => $task->actual_effort,
            'created_at' => $task->created_at,
            'updated_at' => $task->updated_at,
        ], 201);
    }
}

// 【このコードをユニットテストしようとすると何が起きるか】
// - Task::find() / Task::create() がEloquentの静的メソッド呼び出しのため、
//   差し替え(モック)ができない。テストは必ず実DB(またはSQLiteインメモリ)を
//   起動し、HTTPリクエストを模したTestCase経由でしか検証できない。
// - 「2階層制約に違反したら422を返す」というビジネスルールだけを
//   検証したくても、必ずDB接続・マイグレーション・HTTPレイヤー一式が
//   前提になり、テストが遅く、依存関係も重くなる。
