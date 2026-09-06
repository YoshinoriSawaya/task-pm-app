<?php

// docs/architecture/refactoring-comparison.md の「テスト容易性」の実証。
// CreateTaskはTaskRepositoryInterface(抽象)にのみ依存するため(DIP)、
// DB・HTTPを一切介さずにインメモリのFake実装だけで検証できる。

use App\Features\Task\Application\UseCases\CreateTask;
use App\Features\Task\Application\UseCases\CreateTaskInput;
use App\Features\Task\Domain\Exceptions\InvalidTaskHierarchyException;
use App\Features\Task\Domain\Task;
use App\Features\Task\Domain\TaskPriority;
use App\Features\Task\Domain\TaskStatus;
use Tests\Unit\Task\Fakes\InMemoryTaskRepository;

// テスト用に最小限のフィールドだけ指定してTaskを組み立てるヘルパー
function existingTask(?int $parentTaskId): Task
{
    return new Task(
        id: null,
        parentTaskId: $parentTaskId,
        title: '既存タスク',
        description: null,
        status: TaskStatus::NotStarted,
        priority: TaskPriority::Medium,
        dueDate: null,
        definitionOfDone: null,
        estimatedEffort: null,
        actualEffort: null,
    );
}

it('親を指定しない場合、not_startedステータスの最上位タスクを作成する', function () {
    // Arrange
    $repository = new InMemoryTaskRepository();
    $useCase = new CreateTask($repository);
    $input = new CreateTaskInput(
        parentTaskId: null,
        title: '要件定義',
        description: null,
        priority: null,
        dueDate: null,
        definitionOfDone: null,
        estimatedEffort: 4.0,
    );

    // Act
    $task = $useCase->handle($input);

    // Assert
    expect($task->status)->toBe(TaskStatus::NotStarted);
    expect($task->priority)->toBe(TaskPriority::Medium); // 省略時のデフォルト
    expect($task->parentTaskId)->toBeNull();
});

it('親が最上位タスク(子を持たない)の場合、子タスクとして作成できる', function () {
    // Arrange
    $repository = new InMemoryTaskRepository();
    $parent = $repository->save(existingTask(parentTaskId: null));
    $useCase = new CreateTask($repository);
    $input = new CreateTaskInput(
        parentTaskId: $parent->id,
        title: 'スコープ確定',
        description: null,
        priority: TaskPriority::High,
        dueDate: null,
        definitionOfDone: null,
        estimatedEffort: null,
    );

    // Act
    $task = $useCase->handle($input);

    // Assert
    expect($task->parentTaskId)->toBe($parent->id);
});

it('親が既に子タスクの場合、2階層制約違反としてInvalidTaskHierarchyExceptionを投げる', function () {
    // Arrange: 最上位タスクの子として既に登録済みのタスク(=子タスク)を親に指定する
    $repository = new InMemoryTaskRepository();
    $grandParent = $repository->save(existingTask(parentTaskId: null));
    $alreadyAChild = $repository->save(existingTask(parentTaskId: $grandParent->id));
    $useCase = new CreateTask($repository);
    $input = new CreateTaskInput(
        parentTaskId: $alreadyAChild->id,
        title: '孫タスク(作成できないはず)',
        description: null,
        priority: null,
        dueDate: null,
        definitionOfDone: null,
        estimatedEffort: null,
    );

    // Act & Assert
    expect(fn () => $useCase->handle($input))->toThrow(InvalidTaskHierarchyException::class);
});
