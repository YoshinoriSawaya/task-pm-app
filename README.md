# Task PM App

転職面接対策として、PMBOKの考え方を反映したタスク管理アプリを構築する個人プロジェクト。
開発者が一人で「クライアント役」「PM役」「開発者役」の3役を演じ、実装はClaude Codeに委任しながら進めた。
アプリ自体の完成度に加え、**PMBOKプロセスの実体験**と**SOLID原則に基づく設計・レビュー能力**を
面接でアピールできる状態を作ることを最終目標としている。

## 機能

- タスク管理(階層構造・論理削除・工数入力に対応したCRUD)
- バグ管理(重要度・ステータス管理、関連タスクの紐付け)
- 進捗ダッシュボード(EVM風メトリクス・バグ統計を自動計算)

進捗指標(EVM)・バグ管理は本来PM成果物として`docs/pmbok/`配下に置く想定だったが、
[ADR-0002](docs/adr/0002-evm-progress-and-bug-tracking.md)の判断でスコープを拡大し、アプリ機能として実装した。

## 技術スタック

- フロントエンド: React + TypeScript(Vite、Vertical Slice構成)
- バックエンド: PHP 8.3 + Laravel(Vertical Slice + 各スライス内はクリーンアーキテクチャ/ヘキサゴナル)
- DB: MySQL 8.0
- テスト: TDD(バックエンド: Pest、フロントエンド: Jest、E2E: Playwright)
- 静的解析: PHPStan(バックエンド)、ESLint strict + TypeScript strict(フロントエンド)
- CI: GitHub Actions(lint + test、push時に自動実行)
- インフラ: Docker Compose(ローカル)、AWS EC2単体 + nginx(Basic認証)(本番デプロイ時のみ、[ADR-0003](docs/adr/0003-deployment-architecture.md))

## ディレクトリ構成

```
docs/requirements/   クライアント要求
docs/pmbok/          プロジェクト憲章・WBS・スケジュール・リスク登録簿・変更ログ・振り返り
docs/adr/            設計判断の記録(Architecture Decision Record)
docs/architecture/   ER図・API設計・レイヤー構成図・Before/After設計比較資料
docs/development/    コーディング規約
frontend/            React + TypeScript(src/features配下にVertical Slice)
backend/             Laravel(app/Features配下にVertical Slice)
e2e/                 Playwright E2Eテスト(独立したpackage.json)
docker/nginx/        本番用リバースプロキシ・Basic認証設定
.github/workflows/   CI設定
```

## ローカルでの動かし方

```bash
docker compose up
```

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8000/api

初回起動時、backendコンテナが自動でcomposer install・マイグレーション・起動まで行う。
デモ用データを投入する場合は以下を実行する。

```bash
docker exec task-pm-app-backend-1 php artisan db:seed --force
```

## テストの実行

```bash
# バックエンド(コンテナ内)
docker exec task-pm-app-backend-1 vendor/bin/pest

# フロントエンド
cd frontend && npx jest

# E2E(docker compose upが起動している状態で)
cd e2e && npm install && npx playwright test
```

## ドキュメント

このプロジェクトの本体は、アプリのコードそのものと同じくらい`docs/`配下のPMBOK成果物・設計判断記録にある。

- **要求・非機能要件**: [docs/requirements/client-requirements.md](docs/requirements/client-requirements.md)
- **プロジェクト憲章**: [docs/pmbok/project-charter.md](docs/pmbok/project-charter.md)
- **WBS(進捗の起点)**: [docs/pmbok/wbs.md](docs/pmbok/wbs.md)
- **スケジュール・自己適用EVM**: [docs/pmbok/schedule.md](docs/pmbok/schedule.md)
- **リスク登録簿**: [docs/pmbok/risk-register.md](docs/pmbok/risk-register.md)
- **変更履歴(全25件の意思決定・発見したバグの記録)**: [docs/pmbok/change-log.md](docs/pmbok/change-log.md)
- **振り返り(フェーズごと+総括)**: [docs/pmbok/retrospective.md](docs/pmbok/retrospective.md)
- **設計判断記録(ADR)**: [docs/adr/](docs/adr/)
- **Before/After SOLID設計比較**: [docs/architecture/refactoring-comparison.md](docs/architecture/refactoring-comparison.md)
- **コーディング規約**: [docs/development/coding-standards.md](docs/development/coding-standards.md)

進捗管理は[GitHub Issues](https://github.com/YoshinoriSawaya/task-pm-app/issues)で行った(全フェーズクローズ済み)。

## 予算・制約

- 開発期間: 1日8時間程度 × 2日(実績: [docs/pmbok/schedule.md](docs/pmbok/schedule.md)参照。ほぼ計画通りに収束)
- クラウド予算: 2000円以下(本番デプロイは検証後に速やかにリソース削除、実績スペンドはごく僅少)
- 技術制約: React + TypeScript / Laravel / MySQL(面接先の技術スタックに合わせた意図的な制約)
