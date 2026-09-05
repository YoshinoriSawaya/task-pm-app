# ADR-0002: 進捗指標(EVM)・バグ管理機能の追加とスライス構成

## Context(背景)

- 当初の[client-requirements.md](../requirements/client-requirements.md)では「コスト管理(EVM等)」を「単一ユーザー個人開発のため対象外」としてスコープ外にしていた。
- 一方、PMBOKの進捗管理(EAC等のEVM指標)やソフトウェア品質管理(バグ検知度)を、タスク管理アプリ自身の機能として実装できれば、面接での差別化要素として価値が大きいという判断により、スコープに追加することにした。
- 開発期間は1日8時間×2日(計16時間)という制約があり、[risk-register.md](../pmbok/risk-register.md) R1で既にスケジュール超過リスクを記録済み。今回のスコープ追加はこのリスクをさらに高める。承知の上での追加であることをリスク登録簿に反映する。
- [ADR-0001](0001-vertical-slice-and-hexagonal-architecture.md)でVertical Slice構成を採用済み。新機能をどのスライスに位置づけるかを決める必要がある。

## Decision(決定)

### 1. スコープ変更
[client-requirements.md](../requirements/client-requirements.md)の「スコープ外」から「コスト管理(EVM等)」を外し、**進捗指標(EVM風メトリクス)とバグ管理をスコープに追加する**。[change-log.md](../pmbok/change-log.md) C2として記録する。

### 2. データモデル
- `tasks`テーブルに`estimated_effort`(見積り工数、時間単位、nullable)・`actual_effort`(実績工数、時間単位、nullable)を追加する
- 新規`bugs`テーブルを作成する(詳細は[er-diagram.md](../architecture/er-diagram.md)参照)

### 3. 工数集計の単位: 末端タスクのみ
工数(見積り・実績)は**子タスクを持たない末端タスクにのみ集計対象として持たせる**。子タスクを持つ親タスク自身に工数が入力されていても、EVM集計からは除外し、常に末端タスクの値のみを合計する。これはWBSの標準的な考え方(作業パッケージ=末端の単位でのみ見積る)に準拠し、親子両方に値を持たせることによるダブルカウントを防ぐ。

### 4. 単位は「時間」
EVM指標の単位は通貨ではなく**工数時間**とする。個人開発でタスクに金額を割り当てる意味は薄く、工数時間をコストの代理指標として扱う簡略化は一般的である。

### 5. アーキテクチャ: 新規スライスを2つ追加
- **`app/Features/Bug/`**: バグのCRUD。`related_task_id`として関連タスクのIDのみを保持し、Taskスライスのドメインオブジェクトには依存しない(スライス間の疎結合を維持)
- **`app/Features/Progress/`**: 進捗指標(EVM)・バグ統計の算出。**CQRS的に読み取り専用のクエリモデル**として実装し、Task/Bugスライスのユースケース(Application層)には依存せず、`tasks`/`bugs`テーブルを直接集計する専用リードモデル(`Infrastructure/Query/ProgressQueryService`)を持つ。集計・レポーティングは書き込み側のドメインルールと関心が異なるため、他スライスのApplication層に依存すると不要な密結合を生む、という判断による

### 6. EVM計算式(`Progress`スライスの`CalculateEvmSummary`ユースケース)
末端タスクのみを対象に、基準日(今日)時点で以下を算出する。

| 指標 | 計算式 | 備考 |
|---|---|---|
| BAC(完成時総予算) | Σ estimated_effort(全末端タスク) | |
| PV(計画価値) | Σ estimated_effort(due_dateが基準日以前の末端タスク) | due_date未設定のタスクはPVに算入しない(スケジュール上のコミットがないため) |
| EV(出来高) | Σ estimated_effort(status=doneの末端タスク) | 実績ではなく見積り値で評価する(EVMの標準的な考え方) |
| AC(実コスト) | Σ actual_effort(全末端タスク) | |
| CV(コスト差異) | EV − AC | |
| SV(スケジュール差異) | EV − PV | |
| CPI(コスト効率指数) | EV ÷ AC | AC=0の場合は1として扱う(実績未計上時は「予定通り」とみなす) |
| SPI(スケジュール効率指数) | EV ÷ PV | PV=0の場合は1として扱う |
| EAC(完成時総見積り) | AC + (BAC − EV) ÷ CPI | 現在のコスト効率が今後も続く前提 |
| ETC(残作業見積り) | EAC − AC | |
| VAC(完成時差異) | BAC − EAC | |

### 7. バグ検知度
`Progress`スライスで以下を算出する。

- 累計バグ数、未解決バグ数(`status=open`)、解決率(解決済み ÷ 累計)
- バグ密度 = 累計バグ数 ÷ 完了済み末端タスク数(完了タスクが0件の場合はN/A)

## Alternatives Considered(検討した代替案)

| 代替案 | 却下理由 |
|---|---|
| EVMを金額ベースで実装(タスクに予算額を持たせる) | 単一ユーザー個人開発でタスクに実際の金額を割り当てる意味が薄い。工数(時間)の方が実態に即しており、schedule.mdの時間見積りとも単位が揃う |
| `Progress`機能を`Task`スライスの一部として実装(独立スライスにしない) | ADR-0001のVertical Slice方針、および集計ロジックが将来`Bug`スライスも横断することを踏まえ、独立したレポーティング用スライスとして切り出す方が責務が明確 |
| バグを`tasks`テーブルの一種(type列で機能/バグを区別)として扱う | バグ固有の属性(重大度、発見日、解消日)を持たせにくく、タスクのライフサイクル(3状態)と混同する。別エンティティとする方針を採用 |
| 親タスク・子タスク双方に工数を持たせ、親は子の合計を自動ロールアップ | 自動ロールアップの実装コストが高く、2日間の予算に見合わない。末端タスクのみに入力させる方がシンプルで、WBS的にも正しい |

## Consequences(結果・トレードオフ)

**メリット**
- PMBOKのEVM・品質管理という、実務で語れる材料が大幅に強化される
- CQRSの考え方を取り入れたスライス間疎結合の設計判断も、SOLID/アーキテクチャレビューのアピール材料になる

**デメリット・トレードオフ**
- 実装スコープが大きく増える(新規スライス2つ、新規テーブル1つ、新規カラム2つ、集計ロジック、フロントの新画面2つ)
- [risk-register.md](../pmbok/risk-register.md) R1(スケジュール超過リスク)がさらに高まる。承知の上での追加として、リスク登録簿を更新して明示的に受容する

**フォローアップ**
- [er-diagram.md](../architecture/er-diagram.md)・[api-design.md](../architecture/api-design.md)・[layer-diagram.md](../architecture/layer-diagram.md)・[client-requirements.md](../requirements/client-requirements.md)を本ADRに沿って更新する
- WBS([wbs.md](../pmbok/wbs.md))に新規Issueを追加する
