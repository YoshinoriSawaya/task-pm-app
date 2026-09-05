<?php

// api-design.md「DELETE /api/tasks/{id}」の契約に対するテスト。

it('タスクを削除すると204を返し一覧から消える', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    // Act
    $response = $this->deleteJson("/api/tasks/{$task['id']}");

    // Assert
    $response->assertNoContent();
    $this->getJson("/api/tasks/{$task['id']}")->assertNotFound();
});

it('タスクは論理削除される(DBには残る)', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    // Act
    $this->deleteJson("/api/tasks/{$task['id']}");

    // Assert
    $this->assertSoftDeleted('tasks', ['id' => $task['id']]);
});

it('親タスク削除時は子タスクも論理削除される', function () {
    // Arrange
    $parent = $this->postJson('/api/tasks', ['title' => '親'])->json();
    $child = $this->postJson('/api/tasks', ['title' => '子', 'parent_task_id' => $parent['id']])->json();

    // Act
    $this->deleteJson("/api/tasks/{$parent['id']}");

    // Assert
    $this->assertSoftDeleted('tasks', ['id' => $child['id']]);
});

it('存在しないタスクの削除は404を返す', function () {
    // Act
    $response = $this->deleteJson('/api/tasks/99999');

    // Assert
    $response->assertNotFound();
});
