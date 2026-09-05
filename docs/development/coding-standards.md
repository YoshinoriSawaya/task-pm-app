# コーディング規約

[ADR-0001](../adr/0001-vertical-slice-and-hexagonal-architecture.md)・[ADR-0002](../adr/0002-evm-progress-and-bug-tracking.md)のレイヤー構成・命名パターンを、実装時に迷わないよう規約として明文化する。CIでの静的解析([#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12)環境構築確認フェーズで導入)の基準にもなる。

## 全体方針
- 「意図が伝わる名前」を優先する(`data`や`temp`のような曖昧な名前を避ける)
- レイヤーごとの命名パターンを一貫させ、クラス名だけでどの層に属するか判別できるようにする(下記)
- フォーマッタ・静的解析で機械的に守れるルールはレビューで指摘せず、ツールに任せる

## PHP / Laravel(バックエンド)

### スタイル・静的解析
- コーディングスタイル: PSR-12準拠。フォーマッタは**Laravel Pint**(Laravel公式、設定不要ですぐ使える)を採用する
- 静的解析: **PHPStan level 8**(Larastanを併用してLaravel固有の型を解決する)。CIで`composer stan`相当のコマンドとして実行する([#16](https://github.com/YoshinoriSawaya/task-pm-app/issues/16))

### 命名規則(層で判別できるようにする)
| 対象 | 規則 | 例 |
|---|---|---|
| クラス全般 | StudlyCase(PascalCase) | `CreateTask`、`TaskRepositoryInterface` |
| メソッド・変数 | camelCase | `estimatedEffort` |
| DBカラム | snake_case(Eloquent既定) | `estimated_effort` |
| ユースケース(Application層) | 動詞+名詞 | `CreateTask`、`UpdateTaskStatus`、`CalculateEvmSummary` |
| ポート(インターフェース) | 末尾`Interface` | `TaskRepositoryInterface`、`BugRepositoryInterface` |
| Infrastructure実装 | 接頭辞`Eloquent` | `EloquentTaskRepository`、`EloquentTaskModel` |
| FormRequest(Presentation層) | `Store{Model}Request` / `Update{Model}Request` | `StoreTaskRequest` |
| Resource(Presentation層) | `{Model}Resource` | `TaskResource` |
| ドメイン例外 | 末尾`Exception` | `InvalidTaskHierarchyException` |

### テスト
- テストフレームワークは**Pest**(CI設定`.github/workflows/backend-ci.yml`で既に採用済み)。PHPUnitのクラスベース記法ではなく、Pestの`it()`/`test()`関数記法に統一する
- Feature Test(HTTP経由、`tests/Feature/`)とUnit Test(ユースケース/ドメイン単体、`tests/Unit/`)を分離する
- テスト名は日本語で「何を検証するか」を書く(例: `it('親タスク削除時に子タスクも論理削除される', function () { ... });`)
- Arrange-Act-Assertの3段構成をコメントで明示する

### ディレクトリ配置の例外
- マイグレーション(`database/migrations/`)はLaravelの仕組み上スライスをまたぐグローバルな場所に置く(Vertical Sliceの例外)。ファイル名にはスライス名を含めない(Laravel標準の命名規則に従う)
- ルーティング定義(`routes/api.php`)もLaravel標準の単一ファイルに集約し、各スライスのControllerを`use`する。スライスごとにルートファイルを分割しない(MVPの規模では過剰)

### エラーハンドリング
- ドメイン例外(例: `InvalidTaskHierarchyException`)はLaravelの例外ハンドラ(`bootstrap/app.php`の`withExceptions`)でキャッチし、[api-design.md](../architecture/api-design.md)の共通エラー形式(`{"message": ..., "errors": {...}}`)に変換した上で適切なHTTPステータス(バリデーション相当は422)を返す
- コントローラ内で`try/catch`を書かない。例外ハンドラへの委譲に統一する

### ログ
- Laravel標準のログ(`storage/logs/laravel.log`)をそのまま使う。個人開発・単一ユーザーのMVPでは専用のログ基盤(構造化ログ・外部送信等)は不要と判断し、導入しない

## TypeScript / React(フロントエンド)

### スタイル・静的解析
- フォーマッタ: **Prettier**
- Lint: ESLint strict(`@typescript-eslint`の型チェック込みルール)+ `tsconfig.json`の`strict: true`。CIで`npm run lint`として実行する([#21](https://github.com/YoshinoriSawaya/task-pm-app/issues/21))
- `any`型は禁止(ESLintルールで機械的に弾く)。APIレスポンスの型は[api-design.md](../architecture/api-design.md)のリソース定義と1対1で対応させる

### 命名規則
| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase、ファイル名もPascalCase.tsx | `TaskList.tsx` |
| カスタムフック | `use`接頭辞のcamelCase、ファイル名もcamelCase.ts | `useTasks.ts` |
| APIクライアント関数 | 動詞始まりのcamelCase | `fetchTasks`、`createTask` |
| 型・インターフェース | PascalCase | `Task`、`TaskStatus` |

### テスト
- Jest + React Testing Library。ファイル名は`{対象}.test.tsx`、対象コンポーネントと同階層に配置する
- ユーザー操作(クリック・入力)を起点にした振る舞いベースのテストを書く。実装の内部状態を直接検証しない

### 状態管理
- 外部の状態管理ライブラリ(Redux, Zustand, React Query等)は導入しない。単一ユーザー・単一画面ツリーというMVPの規模では過剰と判断し、**Reactの`useState`/`useEffect`をカスタムフックに閉じ込める**方針で統一する(ADR-0001のhooks層)
- サーバー状態のキャッシュ・再検証(SWR的な仕組み)は今回のスコープでは不要。カスタムフックが毎回APIを呼び直すシンプルな実装で十分とする

### スタイリング
- **CSS Modules**(`{Component}.module.css`、Viteに標準搭載でzero-config)を採用する。Tailwind等の追加ライブラリは、UIの複雑さに対して導入コストが見合わないため見送る

### APIクライアント
- 追加ライブラリ(axios等)は導入せず、ブラウザ標準の**`fetch`**を薄くラップした`api/{feature}ApiClient.ts`に統一する(依存を増やさずAPI設計([api-design.md](../architecture/api-design.md))の契約をそのまま反映できるため)

### 環境変数
- `VITE_API_BASE_URL`でバックエンドAPIのベースURLを指定する(`.env.example`参照)。ハードコードしない

### エラー表示
- APIクライアントを呼ぶカスタムフックは`{ data, error, isLoading }`の形を返す統一インターフェースとする
- `error`がある場合は、トースト等の通知ライブラリは導入せず、フォーム・一覧の近くにインラインで`<ErrorMessage>`コンポーネントを表示する(依存を増やさない方針、コーディング規約全体の一貫性)

## バックエンド/フロントエンド間の連携

### CORS
- ローカル開発ではフロント(Vite, `localhost:5173`)とバックエンド(Laravel, `localhost:8000`)が別オリジンになるため、`backend/config/cors.php`で`FRONTEND_URL`(`.env`で指定)からのアクセスを許可する。本番はEC2上で同一オリジン配信(nginxがフロントの静的ファイルと`/api`を両方さばく)を基本とし、CORS設定自体が不要になるようにする([ADR-0003](../adr/0003-deployment-architecture.md))

## 環境変数管理
- 各アプリケーション(`backend/`・`frontend/`)に`.env.example`をコミットし、実際の値を持つ`.env`は`.gitignore`対象のまま維持する
- `backend/.env.example`にはDB接続情報(docker-compose.ymlの値と一致させる)と、本番デプロイ時のみ使うインフラ層Basic認証用の`BASIC_AUTH_USER`/`BASIC_AUTH_PASSWORD`(値は空でコミットし、デプロイ時に実値を設定)を含める
- `frontend/.env.example`には`VITE_API_BASE_URL`を含める

## CI(GitHub Actions)
- トリガーは**`push`(mainブランチ)**。本プロジェクトはPRフローを取らないため、`pull_request`トリガーでは静的解析・テストが一度も実行されない。かつてワークフロー初期スキャフォールドが`pull_request`トリガーのままになっていたため、Git規約(下記)確定時に`push`へ修正した([change-log.md](../pmbok/change-log.md) C5)
- `backend-ci.yml`: Pint(フォーマットチェック、`--test`)→ PHPStan(静的解析)→ Pest(テスト)の順に実行
- `frontend-ci.yml`: Prettier(フォーマットチェック)→ ESLint → `tsc --noEmit`(型チェック)→ Jest(テスト)の順に実行

## Git規約
- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)形式(`feat:` `fix:` `docs:` `refactor:` `test:` `chore:`)を採用する。これまでの`docs:`プレフィックス運用の実績とも整合させる
- 1コミット1意図(CLAUDE.md既存方針)を継続する
- ブランチ運用: 本プロジェクトは1人開発のためPRフローは取らず、`main`に直接コミットする

## 適用先(既存Issueとの対応)
- [#11](https://github.com/YoshinoriSawaya/task-pm-app/issues/11) GitHub Actions CI疎通確認: 本規約通りCIトリガーを`push`に修正済み(`.github/workflows/`)。疎通確認はこの内容が前提
- [#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12) 環境構築確認: `.env.example`を作成済み(`backend/`・`frontend/`)。Pint/PHPStan/Larastan、ESLint/Prettier/TypeScript strictの実際の設定ファイル作成は[#52](https://github.com/YoshinoriSawaya/task-pm-app/issues/52)
- [#16](https://github.com/YoshinoriSawaya/task-pm-app/issues/16) PHPStan導入・静的解析通過: 本規約のlevel 8基準・Pest採用で通過させる
- [#21](https://github.com/YoshinoriSawaya/task-pm-app/issues/21) ESLint strict + TypeScript strict通過: 本規約のルールセット・CSS Modules・fetchベースAPIクライアントで通過させる
