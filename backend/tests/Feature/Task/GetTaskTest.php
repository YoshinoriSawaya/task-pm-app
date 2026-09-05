<?php

// api-design.md「GET /api/tasks/{id}」の契約に対するテスト。

it('タスク詳細を取得できる', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '対象タスク'])->json();

    // Act
    $response = $this->getJson("/api/tasks/{$task['id']}");

    // Assert
    $response->assertOk()->assertJson(['id' => $task['id'], 'title' => '対象タスク']);
});

it('親タスクの詳細にはsubtasksが含まれる', function () {
    // Arrange
    $parent = $this->postJson('/api/tasks', ['title' => '親'])->json();
    $this->postJson('/api/tasks', ['title' => '子', 'parent_task_id' => $parent['id']]);

    // Act
    $response = $this->getJson("/api/tasks/{$parent['id']}");

    // Assert
    expect($response->json('subtasks'))->toHaveCount(1);
});

it('子タスクの詳細にはsubtasksキー自体が含まれない', function () {
    // Arrange
    $parent = $this->postJson('/api/tasks', ['title' => '親'])->json();
    $child = $this->postJson('/api/tasks', ['title' => '子', 'parent_task_id' => $parent['id']])->json();

    // Act
    $response = $this->getJson("/api/tasks/{$child['id']}");

    // Assert
    expect($response->json())->not->toHaveKey('subtasks');
});

it('存在しないタスクは404を返す', function () {
    // Act
    $response = $this->getJson('/api/tasks/99999');

    // Assert
    $response->assertNotFound();
});
