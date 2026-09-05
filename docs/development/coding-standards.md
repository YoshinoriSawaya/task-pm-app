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
- Feature Test(HTTP経由、`tests/Feature/`)とUnit Test(ユースケース/ドメイン単体、`tests/Unit/`)を分離する
- テストメソッド名は`test_`接頭辞のsnake_caseで「何を検証するか」を書く(例: `test_親タスク削除時に子タスクも論理削除される`)
- Arrange-Act-Assertの3段構成をコメントで明示する

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

## Git規約
- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)形式(`feat:` `fix:` `docs:` `refactor:` `test:` `chore:`)を採用する。これまでの`docs:`プレフィックス運用の実績とも整合させる
- 1コミット1意図(CLAUDE.md既存方針)を継続する
- ブランチ運用: 本プロジェクトは1人開発のためPRフローは取らず、`main`に直接コミットする

## 適用先(既存Issueとの対応)
- [#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12) 環境構築確認: Pint/PHPStan/Larastan、ESLint/Prettier/TypeScript strictの設定ファイルを作成する
- [#16](https://github.com/YoshinoriSawaya/task-pm-app/issues/16) PHPStan導入・静的解析通過: 本規約のlevel 8基準で通過させる
- [#21](https://github.com/YoshinoriSawaya/task-pm-app/issues/21) ESLint strict + TypeScript strict通過: 本規約のルールセットで通過させる
