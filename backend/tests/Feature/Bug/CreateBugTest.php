<?php

// api-design.md「POST /api/bugs」の契約に対するテスト。

it('バグを登録すると201とバグリソースを返す', function () {
    // Act
    $response = $this->postJson('/api/bugs', [
        'title' => 'ステータス更新後に画面が再描画されない',
        'description' => 'PATCH成功後、一覧の該当行が古いステータスのまま表示される',
        'severity' => 'high',
        'discovered_at' => '2026-09-05',
    ]);

    // Assert
    $response->assertCreated()->assertJson([
        'related_task_id' => null,
        'title' => 'ステータス更新後に画面が再描画されない',
        'severity' => 'high',
        'status' => 'open', // 登録時は常にopenから開始
        'discovered_at' => '2026-09-05',
        'resolved_at' => null,
    ]);
    $this->assertDatabaseHas('bugs', ['title' => 'ステータス更新後に画面が再描画されない']);
});

it('severityを省略するとmediumになる', function () {
    // Act
    $response = $this->postJson('/api/bugs', [
        'title' => '重大度未指定',
        'discovered_at' => '2026-09-05',
    ]);

    // Assert
    $response->assertCreated()->assertJson(['severity' => 'medium']);
});

it('関連タスクを指定できる', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '関連タスク'])->json();

    // Act
    $response = $this->postJson('/api/bugs', [
        'title' => 'related_task_idありバグ',
        'discovered_at' => '2026-09-05',
        'related_task_id' => $task['id'],
    ]);

    // Assert
    $response->assertCreated()->assertJson(['related_task_id' => $task['id']]);
});

it('titleが無いと422を返す', function () {
    // Act
    $response = $this->postJson('/api/bugs', ['discovered_at' => '2026-09-05']);

    // Assert
    $response->assertUnprocessable()->assertJsonValidationErrors('title');
});

it('discovered_atが無いと422を返す', function () {
    // Act
    $response = $this->postJson('/api/bugs', ['title' => '発見日無し']);

    // Assert
    $response->assertUnprocessable()->assertJsonValidationErrors('discovered_at');
});

it('論理削除済みタスクを関連タスクに指定すると422を返す', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '削除予定'])->json();
    $this->deleteJson("/api/tasks/{$task['id']}");

    // Act
    $response = $this->postJson('/api/bugs', [
        'title' => '孤立バグ',
        'discovered_at' => '2026-09-05',
        'related_task_id' => $task['id'],
    ]);

    // Assert
    $response->assertUnprocessable()->assertJsonValidationErrors('related_task_id');
});
