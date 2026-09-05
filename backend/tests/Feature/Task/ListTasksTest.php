<?php

// api-design.md「GET /api/tasks」の契約に対するテスト。

it('トップレベルタスク一覧を子タスクをネストして返す', function () {
    // Arrange
    $parent = $this->postJson('/api/tasks', ['title' => '親'])->json();
    $this->postJson('/api/tasks', ['title' => '子', 'parent_task_id' => $parent['id']]);

    // Act
    $response = $this->getJson('/api/tasks');

    // Assert
    $response->assertOk();
    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect($data[0]['title'])->toBe('親');
    expect($data[0]['subtasks'])->toHaveCount(1);
    expect($data[0]['subtasks'][0]['title'])->toBe('子');
});

it('子タスクは一覧のトップレベルには出てこない', function () {
    // Arrange
    $parent = $this->postJson('/api/tasks', ['title' => '親'])->json();
    $this->postJson('/api/tasks', ['title' => '子', 'parent_task_id' => $parent['id']]);

    // Act
    $response = $this->getJson('/api/tasks');

    // Assert
    $titles = collect($response->json('data'))->pluck('title');
    expect($titles)->not->toContain('子');
});

it('子タスクを持たない親タスクのsubtasksは空配列', function () {
    // Arrange
    $this->postJson('/api/tasks', ['title' => '子なし親']);

    // Act
    $response = $this->getJson('/api/tasks');

    // Assert
    expect($response->json('data.0.subtasks'))->toBe([]);
});
