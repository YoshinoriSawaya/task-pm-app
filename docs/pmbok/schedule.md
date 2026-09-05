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

## EVM(自己適用): この開発プロジェクト自身への進捗指標の適用

[ADR-0002](../adr/0002-evm-progress-and-bug-tracking.md)でアプリに実装するEVM計算式を、開発プロジェクトそのもの(このtask-pm-app開発)自身にもセルフドッグフーディングとして適用する。1人・2日間のミニプロジェクトに厳密なEVMを回すことの統計的な意味は薄いが、「PMBOKプロセスを実際に運用した」という実体験の価値を優先する判断による([change-log.md](change-log.md) C3)。

### 前提・BAC
- 対象は残りフェーズ([#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12)〜[#40](https://github.com/YoshinoriSawaya/task-pm-app/issues/40))の計画16.0hのみ。要件定義・設計フェーズ(#1〜#9, #41〜#43)は実績時間の記録がなく計測不能なため、このEVM追跡の対象外とする
- BAC(完成時総予算) = **16.0h**
- AC(実コスト=実績時間)はClaudeには直接分からないため、**フェーズの開始・完了時にユーザーが自己申告した時間**を下表「実績」列に記録する運用とする

### 計算式
アプリの`Progress`スライス(ADR-0002)と同じ式を、「タスク」の代わりに「WBSフェーズ」に適用する。

| 指標 | 定義 |
|---|---|
| PV(計画価値) | この時点までに計画上完了しているべきフェーズの見積り時間の累計 |
| EV(出来高) | 実際にクローズ済みのフェーズの見積り時間の累計(実績時間ではなく見積り値で評価するのはADR-0002と同じ考え方) |
| AC(実コスト) | 着手済み・完了済みフェーズの実績時間の累計(下表「実績」列の合計) |
| CV / SV / CPI / SPI / EAC / ETC / VAC | ADR-0002と同じ式(AC=0またはPV=0のときはCPI/SPIをそれぞれ1として扱う) |

### EVMサマリ(フェーズ完了ごとに更新)

| 指標 | 値 | 更新日 |
|---|---|---|
| BAC | 16.0h | - |
| PV | 4.0h(環境構築確認0.5h+バックエンド実装3.5hが計画上完了しているべき時点) | 2026-09-05 |
| EV | 4.0h(同上2フェーズがクローズ済み) | 2026-09-05 |
| AC | **8.0h**(ユーザー自己申告、体感値) | 2026-09-05 |
| CV | **-4.0h**(EV-AC。出来高よりコストが超過) | 2026-09-05 |
| SV | 0.0h(EV=PVで計画通り) | 2026-09-05 |
| CPI | **0.5**(EV/AC。見積りの2倍の時間がかかっているペース) | 2026-09-05 |
| SPI | 1.0(フェーズの順序・範囲は計画通り) | 2026-09-05 |
| EAC | **32.0h**(AC+(BAC-EV)/CPI。現在のペースが続くと想定される完成時総時間) | 2026-09-05 |
| ETC | **24.0h**(EAC-AC。残作業の見積り) | 2026-09-05 |
| VAC | **-16.0h**(BAC-EAC。予算に対して16時間の超過見込み) | 2026-09-05 |

**現状の読み方**: フェーズの**順序・範囲**(SPI=1.0)は計画通りだが、**コスト効率**(CPI=0.5)は見積りの半分しか出ておらず、このペースが続くと完成時には当初16時間予算の**倍(32時間)**かかる計算になる。[risk-register.md](risk-register.md) R1が既に「スケジュール超過は承知の上」としていた通りの傾向が、数値としても裏付けられた形。単発の悪い数値で判断せず、次フェーズ(フロントエンド実装)完了時にもう一度計測し、トレンドとして継続するか確認する。

## 実績

各フェーズ完了時に実際の所要時間を追記していく。

| フェーズ | 見積り | 実績 | 差分・備考 |
|---|---|---|---|
| 要件定義+設計(#1〜#9) | (未計測) | 記録なし | 本表策定前に完了。実績記録がなかったこと自体を[retrospective.md](retrospective.md)に教訓として残す |
| 環境構築確認+バックエンド実装(#12, #17) | 4.0h | 8.0h(自己申告、2フェーズ合算) | 見積りの2倍。CPI=0.5。フェーズ単位の内訳は自己申告のため分離できていない |
| フロントエンド実装(#22) | 3.5h | | |
| 統合・E2Eテスト(#25) | 1.0h | | |
| リファクタリング・設計比較(#29) | 3.0h | | |
| デプロイ(#34) | 2.0h | | |
| PMBOKドキュメント整備・振り返り(#40) | 1.5h | | |
