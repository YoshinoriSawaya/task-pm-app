<?php

// api-design.md「PATCH /api/tasks/{id}」の契約に対するテスト。

it('ステータスのみ部分更新できる', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    // Act
    $response = $this->patchJson("/api/tasks/{$task['id']}", ['status' => 'in_progress']);

    // Assert
    $response->assertOk()->assertJson(['status' => 'in_progress', 'title' => '対象']);
});

it('複数フィールドを部分更新できる', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    // Act
    $response = $this->patchJson("/api/tasks/{$task['id']}", [
        'priority' => 'low',
        'actual_effort' => 2.5,
    ]);

    // Assert
    $response->assertOk()->assertJson(['priority' => 'low', 'actual_effort' => 2.5]);
});

it('存在しないタスクの更新は404を返す', function () {
    // Act
    $response = $this->patchJson('/api/tasks/99999', ['title' => 'x']);

    // Assert
    $response->assertNotFound();
});

it('不正なstatusは422を返す', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    // Act
    $response = $this->patchJson("/api/tasks/{$task['id']}", ['status' => 'invalid']);

    // Assert
    $response->assertUnprocessable();
});
