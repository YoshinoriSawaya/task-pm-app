<?php

// InMemoryTaskRepositoryがTaskRepositoryInterfaceの契約(EloquentTaskRepositoryと
// 同じ振る舞い)を満たすことを検証する(/code-review指摘: LSPの主張とズレていた)。

use Tests\Unit\Task\Fakes\InMemoryTaskRepository;
use Tests\Unit\Task\Fakes\TaskFactory;

it('allTopLevelWithChildrenは、親タスクのchildrenに実際の子タスクを含める', function () {
    // Arrange
    $repository = new InMemoryTaskRepository();
    $parent = $repository->save(TaskFactory::make());
    $child = $repository->save(TaskFactory::make(parentTaskId: $parent->id));

    // Act
    $topLevel = $repository->allTopLevelWithChildren();

    // Assert
    expect($topLevel)->toHaveCount(1);
    expect($topLevel[0]->children)->toHaveCount(1);
    expect($topLevel[0]->children[0]->id)->toBe($child->id);
});

it('findByIdWithChildrenは、指定したタスクのchildrenに実際の子タスクを含める', function () {
    // Arrange
    $repository = new InMemoryTaskRepository();
    $parent = $repository->save(TaskFactory::make());
    $child = $repository->save(TaskFactory::make(parentTaskId: $parent->id));

    // Act
    $found = $repository->findByIdWithChildren($parent->id);

    // Assert
    expect($found)->not->toBeNull();
    expect($found->children)->toHaveCount(1);
    expect($found->children[0]->id)->toBe($child->id);
});

it('子を持たない親タスクのchildrenは空配列になる', function () {
    // Arrange
    $repository = new InMemoryTaskRepository();
    $parent = $repository->save(TaskFactory::make());

    // Act
    $found = $repository->findByIdWithChildren($parent->id);

    // Assert
    expect($found->children)->toBe([]);
});
