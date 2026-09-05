# WBS(作業分解構成図)

プロジェクト全体を9つのフェーズに分解する。各フェーズはGitHubの親Issue(フェーズ)として登録し、
その内訳を子Issueとして紐付ける。親Issueの本文にある `- [ ] #番号` は子Issueの状態と自動連動する
(子Issueがクローズされると親のチェックが自動でオンになる)。

作業は上から順に進めるが、フェーズをまたぐ手戻り(例: 実装中にER図の見直しが必要になる等)は
`docs/pmbok/change-log.md` に変更として記録する。子Issueは開発途中で追加してよい
(WBSは初回で完成させず、必要に応じて更新する)。

## フェーズ一覧

| # | フェーズ | 状態 | Issue |
|---|---|---|---|
| 0 | 要件定義 | 完了 | [#4](https://github.com/YoshinoriSawaya/task-pm-app/issues/4)(内訳: [#1](https://github.com/YoshinoriSawaya/task-pm-app/issues/1) [#2](https://github.com/YoshinoriSawaya/task-pm-app/issues/2) [#3](https://github.com/YoshinoriSawaya/task-pm-app/issues/3)) |
| 1 | 設計 | 完了 | [#9](https://github.com/YoshinoriSawaya/task-pm-app/issues/9)(内訳: [#5](https://github.com/YoshinoriSawaya/task-pm-app/issues/5)〜[#8](https://github.com/YoshinoriSawaya/task-pm-app/issues/8) + 拡張分[#41](https://github.com/YoshinoriSawaya/task-pm-app/issues/41)〜[#43](https://github.com/YoshinoriSawaya/task-pm-app/issues/43)) |
| 2 | 環境構築確認 | 未着手 | [#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12) |
| 3 | バックエンド実装 | 未着手 | [#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17) |
| 4 | フロントエンド実装 | 未着手 | [#22](https://github.com/YoshinoriSawaya/task-pm-app/issues/22) |
| 5 | 統合・E2Eテスト | 未着手 | [#25](https://github.com/YoshinoriSawaya/task-pm-app/issues/25) |
| 6 | リファクタリング・設計比較 | 未着手 | [#29](https://github.com/YoshinoriSawaya/task-pm-app/issues/29) |
| 7 | デプロイ | 未着手 | [#34](https://github.com/YoshinoriSawaya/task-pm-app/issues/34) |
| 8 | PMBOKドキュメント整備・振り返り | 未着手 | [#40](https://github.com/YoshinoriSawaya/task-pm-app/issues/40) |

## フェーズ内訳

### 1. 設計 ([#9](https://github.com/YoshinoriSawaya/task-pm-app/issues/9))
ER図・API設計を含む、実装着手前の設計一式を確定する。
- [#5](https://github.com/YoshinoriSawaya/task-pm-app/issues/5) ADR: Vertical Slice + Clean/Hexagonalアーキテクチャ方針の確定
- [#6](https://github.com/YoshinoriSawaya/task-pm-app/issues/6) ER図の作成
- [#7](https://github.com/YoshinoriSawaya/task-pm-app/issues/7) API設計(エンドポイント一覧・リクエスト/レスポンス定義)
- [#8](https://github.com/YoshinoriSawaya/task-pm-app/issues/8) レイヤー構成図の確定

### 2. 環境構築確認 ([#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12))
- [#10](https://github.com/YoshinoriSawaya/task-pm-app/issues/10) docker-compose起動確認
- [#11](https://github.com/YoshinoriSawaya/task-pm-app/issues/11) GitHub Actions CI疎通確認

### 3. バックエンド実装 ([#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17))
- [#13](https://github.com/YoshinoriSawaya/task-pm-app/issues/13) マイグレーション作成(tasksテーブル)
- [#14](https://github.com/YoshinoriSawaya/task-pm-app/issues/14) Task CRUD API実装
- [#15](https://github.com/YoshinoriSawaya/task-pm-app/issues/15) バックエンドユニットテスト(PHPUnit)実装
- [#16](https://github.com/YoshinoriSawaya/task-pm-app/issues/16) PHPStan導入・静的解析通過

### 4. フロントエンド実装 ([#22](https://github.com/YoshinoriSawaya/task-pm-app/issues/22))
- [#18](https://github.com/YoshinoriSawaya/task-pm-app/issues/18) タスク一覧・詳細画面実装
- [#19](https://github.com/YoshinoriSawaya/task-pm-app/issues/19) タスク作成・編集フォーム実装
- [#20](https://github.com/YoshinoriSawaya/task-pm-app/issues/20) フロントエンドユニットテスト(Jest)実装
- [#21](https://github.com/YoshinoriSawaya/task-pm-app/issues/21) ESLint strict + TypeScript strict通過

### 5. 統合・E2Eテスト ([#25](https://github.com/YoshinoriSawaya/task-pm-app/issues/25))
- [#23](https://github.com/YoshinoriSawaya/task-pm-app/issues/23) E2Eテスト実装(タスクCRUD主要フロー)
- [#24](https://github.com/YoshinoriSawaya/task-pm-app/issues/24) フロント/バックエンド結合動作確認

### 6. リファクタリング・設計比較 ([#29](https://github.com/YoshinoriSawaya/task-pm-app/issues/29))
面接で見せる資料として重視するフェーズ。
- [#26](https://github.com/YoshinoriSawaya/task-pm-app/issues/26) Before実装(意図的に密結合な設計)の作成・レビュー対象特定
- [#27](https://github.com/YoshinoriSawaya/task-pm-app/issues/27) After実装(SOLID原則適用)へのリファクタリング
- [#28](https://github.com/YoshinoriSawaya/task-pm-app/issues/28) Before/After比較資料(クラス図等)の作成

### 7. デプロイ ([#34](https://github.com/YoshinoriSawaya/task-pm-app/issues/34))
- [#30](https://github.com/YoshinoriSawaya/task-pm-app/issues/30) AWSインフラ構築(必要最小限、予算2000円以下)
- [#31](https://github.com/YoshinoriSawaya/task-pm-app/issues/31) インフラ層Basic認証設定
- [#32](https://github.com/YoshinoriSawaya/task-pm-app/issues/32) 本番動作確認
- [#33](https://github.com/YoshinoriSawaya/task-pm-app/issues/33) AWSリソース削除(課金停止)

### 8. PMBOKドキュメント整備・振り返り ([#40](https://github.com/YoshinoriSawaya/task-pm-app/issues/40))
- [#35](https://github.com/YoshinoriSawaya/task-pm-app/issues/35) project-charter.mdの確定
- [#36](https://github.com/YoshinoriSawaya/task-pm-app/issues/36) risk-register.mdへのリスク洗い出し・記録
- [#37](https://github.com/YoshinoriSawaya/task-pm-app/issues/37) change-log.mdの整理
- [#38](https://github.com/YoshinoriSawaya/task-pm-app/issues/38) retrospective.mdの記入
- [#39](https://github.com/YoshinoriSawaya/task-pm-app/issues/39) README最終整備

## 運用ルール
- 子Issueはフェーズ実行中に必要に応じて追加してよい。追加した場合は親Issue本文のチェックリストにも追記する
- フェーズの順序は上記の通りだが、厳密なウォーターフォールではない。設計フェーズの手戻りが発生した場合はchange-log.mdに記録した上で該当フェーズに戻る
- スケジュール(2日間への時間配分)は`docs/pmbok/schedule.md`で別途管理する

## 変更履歴: スコープ拡張(change-log.md C2)

[ADR-0002](../adr/0002-evm-progress-and-bug-tracking.md)により、進捗指標(EVM)・バグ管理をスコープに追加。以下の子Issueを各フェーズに追加した。

- 設計フェーズ([#9](https://github.com/YoshinoriSawaya/task-pm-app/issues/9)): [#41](https://github.com/YoshinoriSawaya/task-pm-app/issues/41) ADR-0002作成 / [#42](https://github.com/YoshinoriSawaya/task-pm-app/issues/42) ER図・API設計・レイヤー構成図の更新 / [#43](https://github.com/YoshinoriSawaya/task-pm-app/issues/43) client-requirements.md改訂(いずれも完了)
- バックエンド実装フェーズ([#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17)): [#44](https://github.com/YoshinoriSawaya/task-pm-app/issues/44) マイグレーション追加 / [#45](https://github.com/YoshinoriSawaya/task-pm-app/issues/45) Bugスライス実装 / [#46](https://github.com/YoshinoriSawaya/task-pm-app/issues/46) Progressスライス実装
- フロントエンド実装フェーズ([#22](https://github.com/YoshinoriSawaya/task-pm-app/issues/22)): [#47](https://github.com/YoshinoriSawaya/task-pm-app/issues/47) タスクフォームへの工数入力欄追加 / [#48](https://github.com/YoshinoriSawaya/task-pm-app/issues/48) バグ管理画面 / [#49](https://github.com/YoshinoriSawaya/task-pm-app/issues/49) 進捗ダッシュボード画面
- 統合・E2Eテストフェーズ([#25](https://github.com/YoshinoriSawaya/task-pm-app/issues/25)): [#50](https://github.com/YoshinoriSawaya/task-pm-app/issues/50) EVM計算ロジックの境界値ユニットテスト

[risk-register.md](risk-register.md) R1の通り、このスコープ拡張は16時間予算に対するスケジュールリスクを承知の上で追加したもの。時間逼迫時は`Progress`スライスのUI装飾等、周辺部分から優先的に削る。
