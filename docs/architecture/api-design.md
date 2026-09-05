# API設計

[ER図](er-diagram.md)のテーブル設計と、[client-requirements.md](../requirements/client-requirements.md)のスコープ(タスクCRUD一式)に基づくAPI設計。
[ADR-0001](../adr/0001-vertical-slice-and-hexagonal-architecture.md)のPresentation層(Controller/FormRequest/Resource)がこの契約を実装する。
[ADR-0002](../adr/0002-evm-progress-and-bug-tracking.md)により、バグ管理(`/api/bugs`)と進捗指標(`/api/progress`)を追加している。

## 設計方針・決定事項

- **エンドポイントは`/api/tasks`一系統のみ。** 「プロジェクト」概念を持たないスコープ決定と整合させ、階層(親子)は個別リソース化せず`parent_task_id`で表現する。
- **一覧はトップレベル(親)タスクを返し、各要素に子タスクを`subtasks`としてネストする。** 2階層までしか存在しないため、フロントは1回のリクエストでWBSツリー全体を描画できる。フィルタ・検索・ページネーションは[client-requirements.md](../requirements/client-requirements.md)のスコープに含まれていないため、今回は実装しない(YAGNI)。
- **編集はPATCH(部分更新)を採用する。** ステータスのみの変更・優先度のみの変更など、フィールド単位の更新が主なユースケースであるため、PUT(全体置換)ではなくPATCHが実態に合う(一般的なREST設計のベストプラクティス)。
- **新規作成時、`status`はクライアントから指定不可。** 常に`not_started`から開始するドメイン不変条件とし、状態遷移はPATCHでのみ行う。
- **親子関係の付け替え(`parent_task_id`の変更)はスコープ外。** 作成時にのみ指定可能とし、作成後のツリー組み替えは今回のMVPでは扱わない。移動を認めると「子タスクを親に昇格させたら孫が生まれる」等の階層不変条件の再検証が必要になり、2日間の予算に見合わないため。
- **`deleted_at`はAPIレスポンスに含めない。** 論理削除されたタスクはEloquentの`SoftDeletes`グローバルスコープにより一覧・詳細から自動的に除外される。

## エンドポイント一覧

| メソッド | パス | 用途 | 対応ユースケース(Application層) |
|---|---|---|---|
| GET | `/api/tasks` | トップレベルタスク一覧(子タスクをネストして含む) | `ListTasks` |
| GET | `/api/tasks/{id}` | タスク詳細(親タスクなら`subtasks`を含む) | `GetTask` |
| POST | `/api/tasks` | タスク作成(`parent_task_id`指定で子タスクとして作成) | `CreateTask` |
| PATCH | `/api/tasks/{id}` | タスク編集(部分更新。ステータス変更も含む) | `UpdateTask` |
| DELETE | `/api/tasks/{id}` | タスク論理削除(親なら子タスクもカスケード論理削除) | `DeleteTask` |
| GET | `/api/bugs` | バグ一覧 | `ListBugs`(Bugスライス) |
| GET | `/api/bugs/{id}` | バグ詳細 | `GetBug`(Bugスライス) |
| POST | `/api/bugs` | バグ登録 | `CreateBug`(Bugスライス) |
| PATCH | `/api/bugs/{id}` | バグ編集(解決時の`status`/`resolved_at`更新含む) | `UpdateBug`(Bugスライス) |
| DELETE | `/api/bugs/{id}` | バグ論理削除 | `DeleteBug`(Bugスライス) |
| GET | `/api/progress` | 進捗指標(EVM)・バグ統計の取得 | `CalculateEvmSummary`(Progressスライス、読み取り専用) |

## リクエスト/レスポンス定義

### Taskリソース(共通レスポンス形式)

```json
{
  "id": 1,
  "parent_task_id": null,
  "title": "要件定義",
  "description": "スコープとDoDを確定する",
  "status": "done",
  "priority": "high",
  "due_date": "2026-09-05",
  "definition_of_done": "client-requirements.mdが確定していること",
  "created_at": "2026-09-05T02:00:00Z",
  "updated_at": "2026-09-05T03:00:00Z",
  "subtasks": []
}
```

`subtasks`は親タスク(`parent_task_id`が`null`)の場合のみ配列を持つ。子タスク自身のレスポンスには`subtasks`キーを含めない。

### GET /api/tasks

- リクエスト: なし
- レスポンス: `200 OK`

```json
{
  "data": [
    { "id": 1, "parent_task_id": null, "title": "要件定義", "...": "...", "subtasks": [
      { "id": 2, "parent_task_id": 1, "title": "スコープ確定", "...": "..." }
    ]}
  ]
}
```

### GET /api/tasks/{id}

- レスポンス: `200 OK`(Taskリソース) / `404 Not Found`(存在しない、または論理削除済み)

### POST /api/tasks

- リクエストボディ

| フィールド | 型 | 必須 | バリデーション |
|---|---|---|---|
| `parent_task_id` | integer, nullable | 任意(省略時は親タスクとして作成) | 存在するタスクのIDであること。かつ、指定先タスク自身が子タスク(`parent_task_id`が非null)でないこと(2階層制約) |
| `title` | string | 必須 | 255文字以内 |
| `description` | string, nullable | 任意 | |
| `priority` | string, nullable | 任意(省略時`medium`) | `high`\|`medium`\|`low` |
| `due_date` | date, nullable | 任意 | `YYYY-MM-DD` |
| `definition_of_done` | string, nullable | 任意 | |

- レスポンス: `201 Created`(作成されたTaskリソース)
- バリデーションエラー: `422 Unprocessable Entity`(Laravel標準形式 `{"message": "...", "errors": {...}}`)。2階層制約違反時は`parent_task_id`に対するエラーとして返す

### PATCH /api/tasks/{id}

- リクエストボディ(すべて任意。指定したフィールドのみ更新)

| フィールド | 型 | バリデーション |
|---|---|---|
| `title` | string | 255文字以内 |
| `description` | string, nullable | |
| `status` | string | `not_started`\|`in_progress`\|`done` |
| `priority` | string | `high`\|`medium`\|`low` |
| `due_date` | date, nullable | `YYYY-MM-DD` |
| `definition_of_done` | string, nullable | |

`parent_task_id`は受け付けない(送られても無視、または`422`で拒否。実装時にどちらにするかは[#14](https://github.com/YoshinoriSawaya/task-pm-app/issues/14)で決定)。

- レスポンス: `200 OK`(更新後のTaskリソース) / `404 Not Found` / `422 Unprocessable Entity`

### DELETE /api/tasks/{id}

- リクエスト: なし
- 処理: 対象タスクを論理削除。対象が親タスク(子タスクを持つ)の場合、配下の子タスクも合わせて論理削除する
- レスポンス: `204 No Content` / `404 Not Found`

### Bugリソース(共通レスポンス形式)

```json
{
  "id": 1,
  "related_task_id": 2,
  "title": "ステータス更新後に画面が再描画されない",
  "description": "PATCH成功後、一覧の該当行が古いステータスのまま表示される",
  "severity": "medium",
  "status": "open",
  "discovered_at": "2026-09-05",
  "resolved_at": null,
  "created_at": "2026-09-05T04:00:00Z",
  "updated_at": "2026-09-05T04:00:00Z"
}
```

### GET /api/bugs / GET /api/bugs/{id} / POST /api/bugs / PATCH /api/bugs/{id} / DELETE /api/bugs/{id}

`/api/tasks`と同じ形式(一覧は`{"data": [...]}`、詳細・作成・編集はBugリソース単体、削除は`204`)。バリデーションは以下。

| フィールド | 型 | 必須 | バリデーション |
|---|---|---|---|
| `related_task_id` | integer, nullable | 任意 | 存在するタスクのIDであること |
| `title` | string | 必須(POST時) | 255文字以内 |
| `description` | string, nullable | 任意 | |
| `severity` | string | 任意(省略時`medium`) | `high`\|`medium`\|`low` |
| `status` | string | 任意(省略時`open`) | `open`\|`resolved`。`resolved`にする場合は`resolved_at`も併せて指定する |
| `discovered_at` | date | 必須(POST時) | `YYYY-MM-DD` |
| `resolved_at` | date, nullable | 任意 | `YYYY-MM-DD`。`status=open`のとき`resolved_at`が指定されていたら`422` |

### GET /api/progress

- リクエスト: なし
- レスポンス: `200 OK`

```json
{
  "evm": {
    "bac": 40.0,
    "pv": 18.0,
    "ev": 15.0,
    "ac": 17.0,
    "cv": -2.0,
    "sv": -3.0,
    "cpi": 0.88,
    "spi": 0.83,
    "eac": 45.5,
    "etc": 28.5,
    "vac": -5.5
  },
  "bugs": {
    "total": 6,
    "open": 2,
    "resolved": 4,
    "resolution_rate": 0.67,
    "defect_density": 0.75
  },
  "calculated_at": "2026-09-05T04:00:00Z"
}
```

計算式は[ADR-0002](../adr/0002-evm-progress-and-bug-tracking.md)参照。`ac=0`のとき`cpi=1`、`pv=0`のとき`spi=1`、完了済み末端タスクが0件のとき`defect_density`は`null`を返す。

## エラーレスポンス共通形式

Laravel標準のバリデーションエラー形式をそのまま採用する(独自フォーマットを設けない = 一般的なベストプラクティスの踏襲)。

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "title": ["titleは必須です。"]
  }
}
```

## フォローアップ

- 本設計に基づきバックエンド実装([#14](https://github.com/YoshinoriSawaya/task-pm-app/issues/14) Task CRUD API実装)を進める
- フロントエンドのAPIクライアント設計([#18](https://github.com/YoshinoriSawaya/task-pm-app/issues/18)以降)も本契約に従う
- Bug/Progressスライスの実装は、WBSに追加する新規Issue(バックエンド実装フェーズ[#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17)配下)で管理する
