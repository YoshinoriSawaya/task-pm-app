# ADR-0003: デプロイアーキテクチャ(単一EC2構成)

## Context(背景)

- [client-requirements.md](../requirements/client-requirements.md)の受け入れ基準(DoD)により、AWSへの本番デプロイが必須。予算はクラウド全体で2000円以下([CLAUDE.md](../../CLAUDE.md))
- [risk-register.md](../pmbok/risk-register.md) R2で「AWS予算超過リスク」を登録済みだが、具体的なインフラ構成・コスト試算がまだ決まっていなかった
- ローカル開発は`docker-compose.yml`でfrontend/backend/mysqlを一括起動する構成が既にある([CLAUDE.md](../../CLAUDE.md)アーキテクチャ方針)

## Decision(決定)

**EC2インスタンス1台(`t3.micro`程度)の上で、ローカルと同じ`docker-compose`構成(frontend/backend/mysql)をそのまま起動する。** RDSは使わず、MySQLもEC2上のコンテナとして動かす。

- インスタンスタイプ: `t3.micro`(東京リージョン、オンデマンドで概算1〜2円/時間程度)。デモに必要な数時間の稼働であれば2000円予算に対して十分な余裕がある
- ネットワーク: パブリックサブネットにEC2を1台配置し、セキュリティグループでHTTP(S)ポートのみ許可
- アクセス制限: [ADR-0002](0002-evm-progress-and-bug-tracking.md)より前に確定済みの通り、インフラ層のBasic認証(nginx等のリバースプロキシ経由)で保護する
- 運用: 動作確認が終わったら**インスタンスごと即座に削除**する([risk-register.md](../pmbok/risk-register.md) R2の対応策)

## Alternatives Considered(検討した代替案)

| 代替案 | 却下理由 |
|---|---|
| EC2 + RDS(MySQL)の分離構成 | 本番環境としてはより一般的な構成だが、RDSは最安インスタンス(`db.t3.micro`)でも時間単価がEC2単体より高く、2000円予算を圧迫しやすい。単一ユーザー・数時間のデモ利用ではDBを分離する可用性上のメリットが薄い |
| ECS/Fargate等のコンテナオーケストレーション | 個人の小規模デモに対して構成・学習コストが過剰。予算・期間(2日)にも見合わない |
| サーバーレス(Lambda + API Gateway) | Laravelのフルスタックアプリをサーバーレス化する変換コストが高く、2日間の予算に見合わない。ローカルのdocker-compose構成とも乖離する |

## Consequences(結果・トレードオフ)

**メリット**
- ローカル開発と同じ`docker-compose.yml`をほぼそのまま使い回せるため、デプロイ作業の実装コストが低い
- コスト試算が明確になり、[risk-register.md](../pmbok/risk-register.md) R2に対する具体的な対応策になる

**デメリット・トレードオフ**
- DBとアプリが同一インスタンスに同居するため、本番運用としての可用性・スケーラビリティは考慮しない(単一ユーザーの短期デモ用途と割り切る)
- この割り切りの理由(コスト最優先、可用性は不要)を面接で明確に説明できるようにしておく

**フォローアップ**
- [#30](https://github.com/YoshinoriSawaya/task-pm-app/issues/30)(AWSインフラ構築)を本ADRの構成で進める
