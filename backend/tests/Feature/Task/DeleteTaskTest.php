<?php

// api-design.md「DELETE /api/tasks/{id}」の契約に対するテスト。

it('タスクを削除すると204を返し一覧から消える', function () {
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    $response = $this->deleteJson("/api/tasks/{$task['id']}");

    $response->assertNoContent();
    $this->getJson("/api/tasks/{$task['id']}")->assertNotFound();
});

it('タスクは論理削除される(DBには残る)', function () {
    $task = $this->postJson('/api/tasks', ['title' => '対象'])->json();

    $this->deleteJson("/api/tasks/{$task['id']}");

    $this->assertSoftDeleted('tasks', ['id' => $task['id']]);
});

it('親タスク削除時は子タスクも論理削除される', function () {
    $parent = $this->postJson('/api/tasks', ['title' => '親'])->json();
    $child = $this->postJson('/api/tasks', ['title' => '子', 'parent_task_id' => $parent['id']])->json();

    $this->deleteJson("/api/tasks/{$parent['id']}");

    $this->assertSoftDeleted('tasks', ['id' => $child['id']]);
});

it('存在しないタスクの削除は404を返す', function () {
    $response = $this->deleteJson('/api/tasks/99999');

    $response->assertNotFound();
});
