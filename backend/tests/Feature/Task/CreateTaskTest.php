<?php

// api-design.md「POST /api/tasks」の契約に対するテスト。

it('親タスクを作成すると201とタスクリソースを返す', function () {
    // Act
    $response = $this->postJson('/api/tasks', [
        'title' => '要件定義',
        'description' => 'スコープとDoDを確定する',
        'priority' => 'high',
        'due_date' => '2026-09-05',
        'definition_of_done' => 'client-requirements.mdが確定していること',
    ]);

    // Assert
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
    // Act
    $response = $this->postJson('/api/tasks', ['title' => '優先度未指定タスク']);

    // Assert
    $response->assertCreated()->assertJson(['priority' => 'medium']);
});

it('titleが無いと422を返す', function () {
    // Act
    $response = $this->postJson('/api/tasks', []);

    // Assert
    $response->assertUnprocessable()->assertJsonValidationErrors('title');
});

it('親タスクを指定して子タスクを作成できる', function () {
    // Arrange
    $parent = $this->postJson('/api/tasks', ['title' => '親タスク'])->json();

    // Act
    $response = $this->postJson('/api/tasks', [
        'title' => '子タスク',
        'parent_task_id' => $parent['id'],
    ]);

    // Assert
    $response->assertCreated()->assertJson(['parent_task_id' => $parent['id']]);
});

it('子タスクの下にさらに子タスクは作成できない(2階層制約)', function () {
    // Arrange
    $parent = $this->postJson('/api/tasks', ['title' => '親タスク'])->json();
    $child = $this->postJson('/api/tasks', [
        'title' => '子タスク',
        'parent_task_id' => $parent['id'],
    ])->json();

    // Act
    $response = $this->postJson('/api/tasks', [
        'title' => '孫タスク(作れないはず)',
        'parent_task_id' => $child['id'],
    ]);

    // Assert
    $response->assertUnprocessable()->assertJsonValidationErrors('parent_task_id');
});

it('論理削除済みのタスクを親に指定すると422を返す(孤立タスク防止)', function () {
    // Arrange
    $task = $this->postJson('/api/tasks', ['title' => '削除予定'])->json();
    $this->deleteJson("/api/tasks/{$task['id']}");

    // Act
    $response = $this->postJson('/api/tasks', [
        'title' => '孤立するはずの子',
        'parent_task_id' => $task['id'],
    ]);

    // Assert
    $response->assertUnprocessable()->assertJsonValidationErrors('parent_task_id');
});

it('estimated_effortがdecimal(5,2)の上限を超えると422を返す', function () {
    // Act
    $response = $this->postJson('/api/tasks', [
        'title' => '工数超過',
        'estimated_effort' => 100000,
    ]);

    // Assert
    $response->assertUnprocessable()->assertJsonValidationErrors('estimated_effort');
});

it('due_dateがYYYY-MM-DD形式でないと422を返す', function () {
    // Act
    $response = $this->postJson('/api/tasks', [
        'title' => '日付形式不正',
        'due_date' => '09/05/2026',
    ]);

    // Assert
    $response->assertUnprocessable()->assertJsonValidationErrors('due_date');
});
