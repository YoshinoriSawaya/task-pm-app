# スケジュール

## 運用ルール
- 「1日目」「2日目」という大枠だけでは進捗も遅延も判断できないため、[wbs.md](wbs.md)のフェーズ単位で時間を見積り、フェーズ完了時に実績を下表へ追記する
- 要件定義・設計フェーズ([#1](https://github.com/YoshinoriSawaya/task-pm-app/issues/1)〜[#9](https://github.com/YoshinoriSawaya/task-pm-app/issues/9))は本スケジュール表を作る前に完了しており、正確な所要時間の実績が残っていない。これは運用上の反省点であり、以降は必ず記録する([risk-register.md](risk-register.md) R1とも関連)

## 制約(前提)
開発期間は1日8時間×2日=計16時間(Claudeとの対話時間を含む、[CLAUDE.md](../../CLAUDE.md)参照)。要件定義・設計フェーズで一部を消費済みのため、以下は残りフェーズ([#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12)〜[#40](https://github.com/YoshinoriSawaya/task-pm-app/issues/40))を対象に、1日目後半+2日目のイメージで配分した計画。

## 計画

### 1日目(環境構築 〜 フロントエンド実装)

| 見積り | フェーズ | Issue | 内容 |
|---|---|---|---|
| 0.5h | 環境構築確認 | [#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12) | docker-compose起動確認、GitHub Actions CI疎通確認 |
| 3.5h | バックエンド実装 | [#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17) | マイグレーション、Task CRUD API(TDD)、PHPStan |
| 3.5h | フロントエンド実装 | [#22](https://github.com/YoshinoriSawaya/task-pm-app/issues/22) | 画面実装(TDD)、ESLint strict + TypeScript strict |
| 0.5h | 統合・E2Eテスト(着手) | [#25](https://github.com/YoshinoriSawaya/task-pm-app/issues/25) | 主要フローのE2E実装に着手 |
| **8.0h** | | | **1日目 計** |

### 2日目(統合テスト 〜 振り返り)

| 見積り | フェーズ | Issue | 内容 |
|---|---|---|---|
| 1.0h | 統合・E2Eテスト(完了) | [#25](https://github.com/YoshinoriSawaya/task-pm-app/issues/25) | 結合動作確認、E2E仕上げ |
| 3.0h | リファクタリング・設計比較 | [#29](https://github.com/YoshinoriSawaya/task-pm-app/issues/29) | Before(密結合)実装→After(SOLID)実装→比較資料作成。面接での見せ場のため厚めに確保 |
| 2.0h | デプロイ | [#34](https://github.com/YoshinoriSawaya/task-pm-app/issues/34) | AWS構築(必要最小限)、Basic認証設定、本番動作確認、リソース削除 |
| 1.5h | PMBOKドキュメント整備・振り返り | [#40](https://github.com/YoshinoriSawaya/task-pm-app/issues/40) | project-charter最終化、risk-register/change-log最終更新、retrospective記入、README整備 |
| 0.5h | バッファ | - | 遅延吸収用 |
| **8.0h** | | | **2日目 計** |

## 実績

各フェーズ完了時に実際の所要時間を追記していく。

| フェーズ | 見積り | 実績 | 差分・備考 |
|---|---|---|---|
| 要件定義+設計(#1〜#9) | (未計測) | 記録なし | 本表策定前に完了。実績記録がなかったこと自体を[retrospective.md](retrospective.md)に教訓として残す |
| 環境構築確認(#12) | 0.5h | | |
| バックエンド実装(#17) | 3.5h | | |
| フロントエンド実装(#22) | 3.5h | | |
| 統合・E2Eテスト(#25) | 1.0h | | |
| リファクタリング・設計比較(#29) | 3.0h | | |
| デプロイ(#34) | 2.0h | | |
| PMBOKドキュメント整備・振り返り(#40) | 1.5h | | |
