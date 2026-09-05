# CLAUDE.md

このファイルはClaude Codeがプロジェクトを開いた際に読み込む前提コンテキストです。
以下の方針・制約を踏まえて提案・実装を行ってください。

## プロジェクトの目的

転職の面接対策として、PMBOKの考え方を反映したタスク管理アプリを構築する個人プロジェクト。
開発者が一人で「クライアント役」「PM役」「開発者役」の3役を演じ、実際のコード実装はClaudeに委任することで時短する。
最終目標は、アプリ自体の完成度に加えて、PMBOKの用語・プロセスを実体験として語れる状態、
かつSOLID原則に基づいた設計とそのレビュー能力を面接でアピールできる状態を作ること。

## 技術スタック(面接先の技術に合わせた意図的な制約)

- フロントエンド: React + TypeScript
- バックエンド: PHP + Laravel
- DB: MySQL
- テスト: TDD。Unitテスト・E2Eテストを自動化する(フロントはJest等を想定)
- CI: GitHub Actions(lint + test)

## 制約条件

- 開発期間: 1日8時間程度 × 2日が上限(Claudeとの対話時間も含む)
- 予算: 総額5000円ほど。うちClaudeの課金(Pro等)を除き、クラウド(AWS等)に使える金額は2000円以下
- AWSリソース(RDS/EC2等)は使い終わったら速やかに削除し、課金を止める運用とする

## アーキテクチャ方針

- モノレポ構成。クライアント要求・PMBOK成果物・ADR・フロント/バックエンド/DBの実装まで全てこの1リポジトリに含める
- Vertical Slice構成を基本とし、各スライスの内部はクリーンアーキテクチャ的、またはヘキサゴナルにする(スライスの規模に応じて使い分ける)
- ローカル開発は`docker-compose.yml`でfrontend/backend/mysqlを一括起動する。AWSは最終デプロイ段階のみ使用する

## 非機能要件の方針

- 性能: 単一ユーザーが使う想定のため高性能である必要はない。ただし方針として明文化はしておく
- セキュリティ: 一般的なベストプラクティスを採用する。「一般的であること」自体を選定理由として明確に言語化できるようにする
- ステークホルダー管理: 一人で行うプロジェクトのため今回は重視しない(PMBOKの他要素は反映するが、ここは簡略化する)

## 品質・レビューの進め方

- 設計判断は`docs/adr/`にADR(Architecture Decision Record)として記録する。1判断につき1ファイル、Context/Decision/Alternatives Considered/Consequencesの形式
- リファクタリングの工数を意図的に確保し、Before(密結合)→After(SOLID)の設計比較を残す(コードそのものより、クラス図やスライド等の「見せられる形」を重視)
- 静的解析を導入する(バックエンド: PHPStan、フロントエンド: ESLint strict + TypeScript strict)
- コミットは1コミット1意図を意識する

## PMBOK成果物の置き場所(`docs/pmbok/`)

- `project-charter.md` / `wbs.md` / `schedule.md` / `risk-register.md` / `change-log.md` / `retrospective.md`
- これらは「開発過程でPM役として作成するドキュメント」であり、アプリ自体の機能として実装するかどうかは別途スコープ判断が必要(下記「現在の状態」を参照)

## ディレクトリ構成

```
docs/requirements/   クライアント要求
docs/pmbok/           プロジェクト憲章・WBS・スケジュール・リスク登録簿・変更ログ・振り返り
docs/adr/             設計判断の記録
docs/architecture/    ER図・レイヤー構成図
frontend/             React + TypeScript(src/features配下にVertical Slice)
backend/              Laravel(app/Features配下にVertical Slice)
.github/workflows/    CI設定
```

## 現在の状態(未決定事項)

- `docs/requirements/client-requirements.md`はテンプレートのみで、**スコープ(やること/やらないこと)と受け入れ基準(Definition of Done)がまだ未記入**
- タスク管理アプリのMVP機能(タスクCRUD、ステータス管理、優先度、期限など、どこまで実装するか)が未確定
- PMBOKの要素(WBS階層、リスク登録簿など)を「アプリ自身の機能」として実装するのか、「開発過程でPMとして使うドキュメント」に留めるのかの切り分けも未確定
- 認証機能をスコープに含めるか(単一ユーザー前提なので不要な可能性もある)も未確定

**次のアクション**: 実装(WBSやER図などの設計)を進める前に、まず`docs/requirements/client-requirements.md`のスコープと受け入れ基準を確定させること。ここが決まらないと設計に着手できない。
