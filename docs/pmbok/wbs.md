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
| 2 | 環境構築確認 | 完了 | [#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12) |
| 3 | バックエンド実装 | 完了 | [#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17) |
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
- [#52](https://github.com/YoshinoriSawaya/task-pm-app/issues/52) 静的解析・フォーマッタの設定ファイル作成([docs/development/coding-standards.md](../development/coding-standards.md)、change-log.md C4)
- [#55](https://github.com/YoshinoriSawaya/task-pm-app/issues/55) CORS設定(change-log.md C6)

### 3. バックエンド実装 ([#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17))
- [#13](https://github.com/YoshinoriSawaya/task-pm-app/issues/13) マイグレーション作成(tasksテーブル)
- [#14](https://github.com/YoshinoriSawaya/task-pm-app/issues/14) Task CRUD API実装(TDD: テスト先行。旧#15を統合、change-log.md C9)
- [#16](https://github.com/YoshinoriSawaya/task-pm-app/issues/16) PHPStan導入・静的解析通過
- [#44](https://github.com/YoshinoriSawaya/task-pm-app/issues/44)〜[#46](https://github.com/YoshinoriSawaya/task-pm-app/issues/46) マイグレーション追加・Bug/Progressスライス実装(change-log.md C2)
- [#54](https://github.com/YoshinoriSawaya/task-pm-app/issues/54) デモ用シーダー作成(change-log.md C6)

### 4. フロントエンド実装 ([#22](https://github.com/YoshinoriSawaya/task-pm-app/issues/22))
**Must(MVP)。#47〜#49はShouldとして本フェーズの後回しにする(change-log.md C12)**
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
- [#53](https://github.com/YoshinoriSawaya/task-pm-app/issues/53) デプロイ前セキュリティレビュー(change-log.md C6)
- [#30](https://github.com/YoshinoriSawaya/task-pm-app/issues/30) AWSインフラ構築(EC2単体、RDS不使用、[ADR-0003](../adr/0003-deployment-architecture.md))
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
- **実装系のフェーズ(バックエンド実装[#17]、フロントエンド実装[#22]、統合・E2Eテスト[#25]等)は、親Issueをクローズする前に`/code-review`スキルで軽くレビューする。** バグ・重複・効率の観点をチェックしてから次フェーズへ進む(change-log.md C6)

## 変更履歴: スコープ拡張(change-log.md C2)

[ADR-0002](../adr/0002-evm-progress-and-bug-tracking.md)により、進捗指標(EVM)・バグ管理をスコープに追加。以下の子Issueを各フェーズに追加した。

- 設計フェーズ([#9](https://github.com/YoshinoriSawaya/task-pm-app/issues/9)): [#41](https://github.com/YoshinoriSawaya/task-pm-app/issues/41) ADR-0002作成 / [#42](https://github.com/YoshinoriSawaya/task-pm-app/issues/42) ER図・API設計・レイヤー構成図の更新 / [#43](https://github.com/YoshinoriSawaya/task-pm-app/issues/43) client-requirements.md改訂(いずれも完了)
- バックエンド実装フェーズ([#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17)): [#44](https://github.com/YoshinoriSawaya/task-pm-app/issues/44) マイグレーション追加 / [#45](https://github.com/YoshinoriSawaya/task-pm-app/issues/45) Bugスライス実装 / [#46](https://github.com/YoshinoriSawaya/task-pm-app/issues/46) Progressスライス実装
- フロントエンド実装フェーズ([#22](https://github.com/YoshinoriSawaya/task-pm-app/issues/22)): [#47](https://github.com/YoshinoriSawaya/task-pm-app/issues/47) タスクフォームへの工数入力欄追加 / [#48](https://github.com/YoshinoriSawaya/task-pm-app/issues/48) バグ管理画面 / [#49](https://github.com/YoshinoriSawaya/task-pm-app/issues/49) 進捗ダッシュボード画面 **(3件ともShould。change-log.md C12によりMVP完成後の余剰時間で着手する)**
- 統合・E2Eテストフェーズ([#25](https://github.com/YoshinoriSawaya/task-pm-app/issues/25)): [#50](https://github.com/YoshinoriSawaya/task-pm-app/issues/50) EVM計算ロジックの境界値ユニットテスト

[risk-register.md](risk-register.md) R1の通り、このスコープ拡張は16時間予算に対するスケジュールリスクを承知の上で追加したもの。フェーズ3完了時点でCPI=0.5が実測されたことを受け、時間逼迫時に周辺部分から削るという方針を実際のMust/Should仕分けとして確定させた(change-log.md C12)。

## 変更履歴: PMレビューで発見した見落とし(change-log.md C6, C7)

- コーディング規約策定([#51](https://github.com/YoshinoriSawaya/task-pm-app/issues/51))に伴い、環境構築確認フェーズ([#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12))に[#52](https://github.com/YoshinoriSawaya/task-pm-app/issues/52) 静的解析・フォーマッタ設定ファイル作成を追加(完了)
- PMレビューにより以下を追加
  - 環境構築確認フェーズ([#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12)): [#55](https://github.com/YoshinoriSawaya/task-pm-app/issues/55) CORS設定
  - バックエンド実装フェーズ([#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17)): [#54](https://github.com/YoshinoriSawaya/task-pm-app/issues/54) デモ用シーダー作成
  - デプロイフェーズ([#34](https://github.com/YoshinoriSawaya/task-pm-app/issues/34)): [#53](https://github.com/YoshinoriSawaya/task-pm-app/issues/53) デプロイ前セキュリティレビュー、[#30](https://github.com/YoshinoriSawaya/task-pm-app/issues/30)を[ADR-0003](../adr/0003-deployment-architecture.md)(EC2単体構成)に基づき具体化
- 実装系フェーズ完了時の軽量コードレビュー(`/code-review`)を運用ルールに追加(上記「運用ルール」参照)
