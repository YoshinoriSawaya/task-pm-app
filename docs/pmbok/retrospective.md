# 振り返り(レトロスペクティブ)

## 運用ルール
教訓登録簿(Lessons Learned Register)は本来、プロジェクト完了時に一度だけ作るものではなく、進行中随時更新し、完了時に組織の資産として蓄積する性質のもの。この考え方に基づき、**WBSの各フェーズが完了するごとに振り返りを追記**し、プロジェクト完了時(フェーズ8, [#40](https://github.com/YoshinoriSawaya/task-pm-app/issues/40))には個別の振り返りを書き起こすのではなく、蓄積した内容を通した**総括**のみを書く。

---

## フェーズ0-1: 要件定義・設計([#1](https://github.com/YoshinoriSawaya/task-pm-app/issues/1)〜[#9](https://github.com/YoshinoriSawaya/task-pm-app/issues/9))

### うまくいったこと
- ADR([#5](https://github.com/YoshinoriSawaya/task-pm-app/issues/5))→ER図([#6](https://github.com/YoshinoriSawaya/task-pm-app/issues/6))→API設計([#7](https://github.com/YoshinoriSawaya/task-pm-app/issues/7))→レイヤー構成図([#8](https://github.com/YoshinoriSawaya/task-pm-app/issues/8))の順で進めたことで、後工程が前工程を素直に参照でき、手戻りがほぼ発生しなかった
- 都度の指摘(タスク依存関係を実装するか、削除を物理/論理どちらにするか、WBSの粒度、CLAUDE.mdの陳腐化)が、そのつど設計をより手堅くする方向に働いた

### 課題
- [#2](https://github.com/YoshinoriSawaya/task-pm-app/issues/2)・[#4](https://github.com/YoshinoriSawaya/task-pm-app/issues/4)のクローズ忘れ。フェーズ完了時に「子Issueが全てクローズされたか」を機械的に確認していなかった
- ER図設計で物理削除→論理削除への手戻りが発生。ADR-0001の時点で「削除」というユースケースの意味論まで詰めていなかったことが原因
- リスク登録簿・変更ログが、要件定義・設計フェーズの間一度も更新されなかった(フェーズ8まで先送りする設計になっていたため)
- CLAUDE.mdの「現在の状態」が、要件定義完了後も更新されず実態と乖離したまま放置されていた

### 教訓(Lessons Learned)
- フェーズ完了時は「子Issueが全てクローズされているか」を確認する一手間を運用ルール化する
- ドメインモデリング(ADR)の段階で、CRUD操作の意味論(特に削除のような破壊的操作)まで踏み込んで検討する
- リスク登録簿・変更ログ・振り返りは"最後にまとめて書く"ものではなく、フェーズ完了ごとに都度追記する(このことに気づいたのがフェーズ1完了後だった点は、次のフェーズ以降で活かす)
- CLAUDE.md(前提コンテキスト)は、意思決定が確定した直後に更新する。後回しにすると陳腐化に気づくタイミングが遅れる

---

## フェーズ2: 環境構築確認([#12](https://github.com/YoshinoriSawaya/task-pm-app/issues/12))

### うまくいったこと
- Laravel/Viteスケルトンを実際にスキャフォールドし、CIをグリーンにし、`docker compose up`で実機起動確認するところまで、実装着手前にやり切れた。おかげでバックエンド実装(#17)は「動く土台の上に機能を積む」状態から始められる
- ローカルPHPが古く実行できない問題を、Docker/CI検証中心の方針に頼るだけでなく、実際にローカルPHP 8.3を導入して解決した(ユーザー判断)。結果としてローカルでもartisan/Pint/PHPStanが直接検証できるようになり、開発体験が上がった

### 課題
- `composer create-project`をローカルの古いPHPで実行し、`composer.json`を後から手編集したため、`composer.lock`が追従せず`composer install`が2回失敗した
- ローカルcomposerがバージョン制約を無視して依存解決した結果、CIのPHP 8.3では動かないロックファイルを一度コミットしてしまった(`config.platform.php`を固定していなかったのが原因)
- 空ディレクトリ(`tests/Unit`, `tests/Feature`)がGitに追跡されないことを見落とし、CIで「テストディレクトリが見つからない」失敗を1回出した
- ルートの`.gitignore`が、Laravelが自前で用意する入れ子`.gitignore`(ディレクトリ構造だけ残す標準パターン)と衝突していた

### 教訓(Lessons Learned)
- `composer.json`を手編集したら、その場で(同じ実行環境で)`composer.lock`も更新する。ズレたまま先に進まない
- 依存解決を行う環境(ローカル/CI/本番)でPHPバージョンが異なる場合は`config.platform.php`を明示的に固定し、意図しないバージョンの依存が紛れ込むのを防ぐ
- 「ディレクトリの存在」自体がGitでは保証されない(空ディレクトリは追跡されない)ことを、スキャフォールド系の作業では常に意識する
- フレームワークが自前で用意する規約(Laravelの入れ子`.gitignore`等)を、プロジェクト独自の設定で安易に上書き・重複させない

## フェーズ3: バックエンド実装([#17](https://github.com/YoshinoriSawaya/task-pm-app/issues/17))

### うまくいったこと
- TDD(Red→Green→Refactor)を徹底したことで、Task/Bug/Progressの3スライスとも実装後の手戻りがほぼなかった。特にProgressスライスのEVM計算式は、テストで数値を手計算して検証したことで正しさに確信を持てた
- `/code-review`を実施した結果、実際に3件の正当性バグ(論理削除回避、decimal超過、規約違反)を発見・修正できた。レビュー能力アピールという目的に直結する実体験になった
- 一つのスライス(Task)で見つけた問題(論理削除済みレコードへの参照)を、Bugスライスの実装時に先回りして同じ対策を横展開できた

### 課題
- デモ用シーダー作成の際、開発DBとテスト用DBを同一にしていたため、シード投入後にFeatureテストが原因不明に失敗する事態が発生した(件数を決め打ちしたアサーションがシードデータの影響を受けた)
- `DatabaseSeeder`が削除済みの`App\Models\User`を参照したまま放置されており、実行時エラーになる状態だった(スケルトンマージ時の見落とし)
- ローカルPHPが8.0.3のままではLaravel実行・composerの依存解決すら満足にできず、環境構築フェーズ(#12)で対応が必要だった

### 教訓(Lessons Learned)
- 開発用DBとテスト用DBは、シーダーを書く前の時点で分離しておく。「あとで困る」ことが分かってから直すのではなく、環境構築の時点で分離しておくべきだった
- スケルトンをマージ・トリミングする際は、削除したクラスへの参照が他のファイル(シーダー等)に残っていないか、grep等で機械的に確認する
- `/code-review`は「実装が終わってから念のため」ではなく、実際にバグを捕まえる実効性のあるステップだと確認できた。今後のフェーズでも欠かさず実施する

## フェーズ4: フロントエンド実装([#22](https://github.com/YoshinoriSawaya/task-pm-app/issues/22))
_(未実施)_

## フェーズ5: 統合・E2Eテスト([#25](https://github.com/YoshinoriSawaya/task-pm-app/issues/25))
_(未実施)_

## フェーズ6: リファクタリング・設計比較([#29](https://github.com/YoshinoriSawaya/task-pm-app/issues/29))
_(未実施)_

## フェーズ7: デプロイ([#34](https://github.com/YoshinoriSawaya/task-pm-app/issues/34))
_(未実施)_

---

## 総括(プロジェクト完了時に記入)
_(フェーズ8, [#40](https://github.com/YoshinoriSawaya/task-pm-app/issues/40)完了時に、上記フェーズごとの教訓を通して全体総括を記入する)_
