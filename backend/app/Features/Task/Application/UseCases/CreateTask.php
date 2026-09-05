<?php

namespace App\Features\Task\Application\UseCases;

use App\Features\Task\Application\Ports\TaskRepositoryInterface;
use App\Features\Task\Domain\Exceptions\InvalidTaskHierarchyException;
use App\Features\Task\Domain\Task;
use App\Features\Task\Domain\TaskPriority;
use App\Features\Task\Domain\TaskStatus;

final class CreateTask
{
    public function __construct(private readonly TaskRepositoryInterface $tasks)
    {
    }

    public function handle(CreateTaskInput $input): Task
    {
        if ($input->parentTaskId !== null) {
            $parent = $this->tasks->findById($input->parentTaskId);

            // 親が既に子タスク(自身が親を持つ)の場合、2階層制約に違反する(ADR-0002)
            if ($parent !== null && $parent->isChild()) {
                throw InvalidTaskHierarchyException::becauseParentIsAlreadyAChild($input->parentTaskId);
            }
        }

        $task = new Task(
            id: null,
            parentTaskId: $input->parentTaskId,
            title: $input->title,
            description: $input->description,
            status: TaskStatus::NotStarted, // 作成時は常にnot_startedから開始(api-design.md)
            priority: $input->priority ?? TaskPriority::Medium,
            dueDate: $input->dueDate,
            definitionOfDone: $input->definitionOfDone,
            estimatedEffort: $input->estimatedEffort,
            actualEffort: null,
        );

        return $this->tasks->save($task);
    }
}
