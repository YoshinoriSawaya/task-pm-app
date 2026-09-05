<?php

// api-design.md「PATCH /api/tasks/{id}」の契約に対するテスト。

it('ステータスのみ部分更新できる', function () {
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    $response = $this->patchJson("/api/tasks/{$task['id']}", ['status' => 'in_progress']);

    $response->assertOk()->assertJson(['status' => 'in_progress', 'title' => '対象']);
});

it('複数フィールドを部分更新できる', function () {
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    $response = $this->patchJson("/api/tasks/{$task['id']}", [
        'priority' => 'low',
        'actual_effort' => 2.5,
    ]);

    $response->assertOk()->assertJson(['priority' => 'low', 'actual_effort' => 2.5]);
});

it('存在しないタスクの更新は404を返す', function () {
    $response = $this->patchJson('/api/tasks/99999', ['title' => 'x']);

    $response->assertNotFound();
});

it('不正なstatusは422を返す', function () {
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    $response = $this->patchJson("/api/tasks/{$task['id']}", ['status' => 'invalid']);

    $response->assertUnprocessable();
});
