# Task PM App

転職面接対策として、PMBOKの考え方を反映したタスク管理アプリを構築するプロジェクト。
一人3役(クライアント / PM / 開発者)を演じ、実装はClaudeに委任しながら進める。

## 技術スタック

- フロントエンド: React + TypeScript(Vertical Slice構成)
- バックエンド: PHP + Laravel(Vertical Slice + 各スライス内はクリーンアーキテクチャ/ヘキサゴナル)
- DB: MySQL
- テスト: TDD(Unit / E2E自動化)
- CI: GitHub Actions(lint + test)

## ディレクトリ構成

```
docs/requirements/   クライアント要求
docs/pmbok/           プロジェクト憲章・WBS・スケジュール・リスク登録簿・変更ログ・振り返り
docs/adr/             設計判断の記録(Architecture Decision Record)
docs/architecture/    ER図・API設計・レイヤー構成図
frontend/             React + TypeScript
backend/              Laravel(app/Features配下にVertical Slice)
.github/workflows/    CI設定
```

## 開発の進め方

1. `docs/requirements/client-requirements.md` にクライアント要求を書く
2. `docs/pmbok/` にPM成果物(憲章・WBS・スケジュール・リスク登録簿)を作成する
3. `docs/adr/` に設計判断を都度記録する
4. `docker-compose up` でローカル環境(frontend/backend/mysql)を起動し実装を進める
5. AWSへのデプロイは最終段階のみ行い、使用後は速やかにリソースを削除する

## 予算・制約

- 開発期間: 1日8時間程度 × 2日
- クラウド予算: 2000円以下(RDS等は使い終わったら削除)
- 技術制約: React + TypeScript / Laravel / MySQL(面接先の技術スタックに合わせる)
