<?php

namespace App\Features\Task\Presentation\Http\Controllers;

use App\Features\Task\Application\UseCases\CreateTask;
use App\Features\Task\Application\UseCases\CreateTaskInput;
use App\Features\Task\Application\UseCases\DeleteTask;
use App\Features\Task\Application\UseCases\GetTask;
use App\Features\Task\Application\UseCases\ListTasks;
use App\Features\Task\Application\UseCases\UpdateTask;
use App\Features\Task\Application\UseCases\UpdateTaskInput;
use App\Features\Task\Domain\TaskPriority;
use App\Features\Task\Presentation\Http\Requests\StoreTaskRequest;
use App\Features\Task\Presentation\Http\Requests\UpdateTaskRequest;
use App\Features\Task\Presentation\Http\Resources\TaskResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    public function index(ListTasks $listTasks): JsonResponse
    {
        $tasks = $listTasks->handle();

        return response()->json([
            'data' => array_map(fn ($task) => (new TaskResource($task))->toArray(request()), $tasks),
        ]);
    }

    public function show(int $id, GetTask $getTask): JsonResponse
    {
        $task = $getTask->handle($id);

        if ($task === null) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return (new TaskResource($task))->response();
    }

    public function store(StoreTaskRequest $request, CreateTask $createTask): JsonResponse
    {
        $data = $request->validated();

        $input = new CreateTaskInput(
            parentTaskId: $data['parent_task_id'] ?? null,
            title: $data['title'],
            description: $data['description'] ?? null,
            priority: isset($data['priority']) ? TaskPriority::from($data['priority']) : null,
            dueDate: $data['due_date'] ?? null,
            definitionOfDone: $data['definition_of_done'] ?? null,
            estimatedEffort: $data['estimated_effort'] ?? null,
        );

        $task = $createTask->handle($input);

        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function update(int $id, UpdateTaskRequest $request, UpdateTask $updateTask): JsonResponse
    {
        $task = $updateTask->handle($id, new UpdateTaskInput($request->validated()));

        if ($task === null) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return (new TaskResource($task))->response();
    }

    public function destroy(int $id, DeleteTask $deleteTask): JsonResponse
    {
        $deleted = $deleteTask->handle($id);

        if (! $deleted) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return response()->json(null, 204);
    }
}
