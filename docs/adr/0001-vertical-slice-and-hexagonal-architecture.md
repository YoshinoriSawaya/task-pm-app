# ADR-0001: Vertical Slice構成 + スライス内ヘキサゴナルアーキテクチャの採用

## Context(背景)

- 本プロジェクトはモノレポで、フロントエンド(React + TypeScript)・バックエンド(Laravel)・DB(MySQL)を扱う個人開発。
- CLAUDE.mdのアーキテクチャ方針として「Vertical Slice構成を基本とし、各スライスの内部はクリーンアーキテクチャ的、またはヘキサゴナルにする(スライスの規模に応じて使い分ける)」と定めている。
- `client-requirements.md`でMVPスコープが確定済み: タスクCRUD、ステータス(3状態)、優先度(3段階)、期限、親子1階層のWBS的分解、タスクごとのDoDテキスト。プロジェクト概念は持たず、タスク管理という単一のドメインのみを扱う。
- ER図([#6](https://github.com/YoshinoriSawaya/task-pm-app/issues/6))・API設計([#7](https://github.com/YoshinoriSawaya/task-pm-app/issues/7))の着手前に、テーブル設計・API境界がスライス構成に依存するため、先に本方針を確定する必要がある。
- プロジェクトの目的の一つに「SOLID原則に基づいた設計とそのレビュー能力を面接でアピールできる状態を作ること」があり、Before(密結合)→After(SOLID)の比較資料を作る計画([#26](https://github.com/YoshinoriSawaya/task-pm-app/issues/26)〜[#28](https://github.com/YoshinoriSawaya/task-pm-app/issues/28))がある。本ADRの構成が「After」側の基準になる。

## Decision(決定)

**バックエンド(Laravel)**は `app/Features/<SliceName>/` 配下にVertical Sliceを切る。MVPスコープでは主要スライスは「タスク管理(Task)」の1つ。各スライス内部は軽量なヘキサゴナル(ポート&アダプタ)構成とする。

- **Domain層**: `Task`エンティティ、値オブジェクト(`TaskStatus`、`TaskPriority`等)、ドメインサービス。フレームワーク非依存。
- **Application層**: ユースケース(`CreateTask`、`UpdateTaskStatus`等)と、リポジトリ等のポート(インターフェース)を定義。
- **Infrastructure層**: Eloquentモデル・ポートのアダプタ実装(例: `EloquentTaskRepository`)。Laravel標準機能への依存はここに閉じ込める。
- **Presentation層**: Controller・FormRequest・API Resource(HTTP境界)。

依存の向きはDomain/ApplicationがInfrastructure/Presentationに依存しないよう統一する(依存性逆転の原則)。

「クリーンアーキテクチャ的、またはヘキサゴナル」の選択について、今回は**ヘキサゴナル(ポート&アダプタ)**を採用する。スライスが小規模(タスク管理1つ)なため、クリーンアーキテクチャの多層同心円構造をフルに導入するより、ポート(インターフェース)を明示してテスト容易性を確保するヘキサゴナルの方が過剰設計になりにくいと判断した。

**フロントエンド(React + TypeScript)**は `frontend/src/features/<SliceName>/` 配下にスライスを切る。バックエンドほど厳密な多層化はせず、UIコンポーネント / カスタムフック(ユースケース相当) / APIクライアント(インフラ相当)の3層程度に留める。

## Alternatives Considered(検討した代替案)

1. **素朴なMVC(Laravel標準のController/Model構成のみ)**
   却下。SOLID原則やアーキテクチャ設計をアピールする目的に合わず、最初からBefore(密結合)に近いためBefore/After比較の題材にもなりにくい。

2. **フル・クリーンアーキテクチャ(Entities/UseCases/InterfaceAdapters/Frameworks & Driversの4層同心円を厳密に踏襲)**
   却下。スライスが実質1つ(タスク管理)しかない小規模なドメインに対して過剰設計になり、2日間という開発期間で完走できないリスクが高い。

3. **フィーチャーごとに分割しないHorizontal Slice(controllers/、services/、repositories/を機能横断で持つ)**
   却下。CLAUDE.mdが明示する「Vertical Slice構成を基本とする」方針に反する。

## Consequences(結果・トレードオフ)

**メリット**
- スライス内で完結するため、単一機能(タスク管理)の理解・変更がしやすい。
- ポート(インターフェース)を明示することで、ユニットテスト時にInfrastructure層をモックしやすく、TDD方針([client-requirements.md](../requirements/client-requirements.md)の非機能要件)と整合する。
- Before/After比較の「After」側の基準が明確になる。

**デメリット・トレードオフ**
- スライスが実質1つしかないため、「Vertical Slice構成」本来の恩恵(機能追加時に他スライスへ影響しない等)を十分には実演できない。面接では「将来的な機能拡張(例: 別ドメインの追加)を見据えた構成である」という説明に留める。
- タスク管理という単一機能に対してポート定義を持ち込むのは、絶対的な複雑度で見ればオーバーエンジニアリングに見える可能性がある。これもBefore/After比較で「なぜ導入したか」を語れる材料とする。

**フォローアップ**
- ER図([#6](https://github.com/YoshinoriSawaya/task-pm-app/issues/6))、API設計([#7](https://github.com/YoshinoriSawaya/task-pm-app/issues/7))、レイヤー構成図([#8](https://github.com/YoshinoriSawaya/task-pm-app/issues/8))は本ADRの層構造に従って作成する。
