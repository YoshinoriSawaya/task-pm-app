<?php

// api-design.md「GET /api/tasks/{id}」の契約に対するテスト。

it('タスク詳細を取得できる', function () {
    $task = $this->postJson('/api/tasks', ['title' => '対象タスク'])->json();

    $response = $this->getJson("/api/tasks/{$task['id']}");

    $response->assertOk()->assertJson(['id' => $task['id'], 'title' => '対象タスク']);
});

it('親タスクの詳細にはsubtasksが含まれる', function () {
    $parent = $this->postJson('/api/tasks', ['title' => '親'])->json();
    $this->postJson('/api/tasks', ['title' => '子', 'parent_task_id' => $parent['id']]);

    $response = $this->getJson("/api/tasks/{$parent['id']}");

    expect($response->json('subtasks'))->toHaveCount(1);
});

it('子タスクの詳細にはsubtasksキー自体が含まれない', function () {
    $parent = $this->postJson('/api/tasks', ['title' => '親'])->json();
    $child = $this->postJson('/api/tasks', ['title' => '子', 'parent_task_id' => $parent['id']])->json();

    $response = $this->getJson("/api/tasks/{$child['id']}");

    expect($response->json())->not->toHaveKey('subtasks');
});

it('存在しないタスクは404を返す', function () {
    $response = $this->getJson('/api/tasks/99999');

    $response->assertNotFound();
});
