-- 開発用DB(task_pm_app)とは別に、テスト実行専用DBを用意する。
-- RefreshDatabaseはトランザクションでテスト間を分離するだけで、開発DBのシード済みデータとは
-- 別のDBにしないとテストが汚染される(change-log.md参照)。
CREATE DATABASE IF NOT EXISTS task_pm_app_testing;
GRANT ALL PRIVILEGES ON task_pm_app_testing.* TO 'task_pm_app'@'%';
FLUSH PRIVILEGES;
