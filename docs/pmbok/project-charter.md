# プロジェクト憲章

## 目的
個人開発者(自分自身)が、PMBOKの考え方を反映したタスク管理アプリを構築する。開発者が一人で「クライアント役」「PM役」「開発者役」の3役を演じ、実際のコード実装はClaudeに委任することで時短する。最終目標は、アプリ自体の完成度に加えて、PMBOKの用語・プロセスを実体験として語れる状態、かつSOLID原則に基づいた設計とそのレビュー能力を面接でアピールできる状態を作ること。詳細は[CLAUDE.md](../../CLAUDE.md)を参照。

## スコープ概要
単一ユーザー向けタスク管理アプリ。タスクのCRUD、ステータス管理(3状態)、優先度(3段階)、期限、親子1階層のWBS的分解、タスクごとの受け入れ基準(DoD)を機能として実装する。認証機能、複数プロジェクト管理、タスク間の依存関係・クリティカルパス、コスト管理・調達管理・資源管理はスコープ外とする。詳細・決定経緯は[client-requirements.md](../requirements/client-requirements.md)を参照。

## 成功基準
- MVPスコープ通りにアプリが動作し、AWS上に本番デプロイされている([client-requirements.md](../requirements/client-requirements.md)の受け入れ基準を満たす)
- Vertical Slice + ヘキサゴナルアーキテクチャ([ADR-0001](../adr/0001-vertical-slice-and-hexagonal-architecture.md))に基づき実装され、SOLID原則に基づくBefore(密結合)→After(疎結合)の設計比較が資料として残っている
- PMBOKプロセス(要求定義・WBS・リスク管理・変更管理・振り返り)を、本リポジトリの記録(Issues・ADR・[wbs.md](wbs.md)・[risk-register.md](risk-register.md)・[change-log.md](change-log.md))を通じて実体験として語れる状態になっている

## 主要な制約(期間・予算・技術)
- **期間**: 1日8時間程度×2日が上限(Claudeとの対話時間も含む)。詳細な時間配分は[schedule.md](schedule.md)
- **予算**: 総額5000円ほど。うちClaude課金分を除き、AWS等クラウドに使える金額は2000円以下。AWSリソースは使い終わったら速やかに削除する
- **技術制約**: フロントエンド React + TypeScript、バックエンド PHP + Laravel、DB MySQL(面接先の技術スタックに合わせた意図的な制約)。詳細は[CLAUDE.md](../../CLAUDE.md)

## リスク・変更管理
プロジェクト進行中に識別されたリスクは[risk-register.md](risk-register.md)、設計・スコープの変更は[change-log.md](change-log.md)に記録する。
