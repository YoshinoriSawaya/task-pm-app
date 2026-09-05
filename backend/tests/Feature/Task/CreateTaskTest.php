<?php

// api-design.md「POST /api/tasks」の契約に対するテスト。

it('親タスクを作成すると201とタスクリソースを返す', function () {
    $response = $this->postJson('/api/tasks', [
        'title' => '要件定義',
        'description' => 'スコープとDoDを確定する',
        'priority' => 'high',
        'due_date' => '2026-09-05',
        'definition_of_done' => 'client-requirements.mdが確定していること',
    ]);

    $response->assertCreated()->assertJson([
        'parent_task_id' => null,
        'title' => '要件定義',
        'description' => 'スコープとDoDを確定する',
        'status' => 'not_started', // 作成時は常にnot_startedから開始(api-design.md)
        'priority' => 'high',
        'due_date' => '2026-09-05',
        'definition_of_done' => 'client-requirements.mdが確定していること',
        'estimated_effort' => null,
        'actual_effort' => null,
    ]);

    $this->assertDatabaseHas('tasks', ['title' => '要件定義', 'parent_task_id' => null]);
});

it('priorityを省略するとmediumになる', function () {
    $response = $this->postJson('/api/tasks', ['title' => '優先度未指定タスク']);

    $response->assertCreated()->assertJson(['priority' => 'medium']);
});

it('titleが無いと422を返す', function () {
    $response = $this->postJson('/api/tasks', []);

    $response->assertUnprocessable()->assertJsonValidationErrors('title');
});

it('親タスクを指定して子タスクを作成できる', function () {
    $parent = $this->postJson('/api/tasks', ['title' => '親タスク'])->json();

    $response = $this->postJson('/api/tasks', [
        'title' => '子タスク',
        'parent_task_id' => $parent['id'],
    ]);

    $response->assertCreated()->assertJson(['parent_task_id' => $parent['id']]);
});

it('子タスクの下にさらに子タスクは作成できない(2階層制約)', function () {
    $parent = $this->postJson('/api/tasks', ['title' => '親タスク'])->json();
    $child = $this->postJson('/api/tasks', [
        'title' => '子タスク',
        'parent_task_id' => $parent['id'],
    ])->json();

    $response = $this->postJson('/api/tasks', [
        'title' => '孫タスク(作れないはず)',
        'parent_task_id' => $child['id'],
    ]);

    $response->assertUnprocessable()->assertJsonValidationErrors('parent_task_id');
});
