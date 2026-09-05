<?php

namespace App\Features\Bug\Presentation\Http\Controllers;

use App\Features\Bug\Application\UseCases\CreateBug;
use App\Features\Bug\Application\UseCases\CreateBugInput;
use App\Features\Bug\Application\UseCases\DeleteBug;
use App\Features\Bug\Application\UseCases\GetBug;
use App\Features\Bug\Application\UseCases\ListBugs;
use App\Features\Bug\Application\UseCases\UpdateBug;
use App\Features\Bug\Application\UseCases\UpdateBugInput;
use App\Features\Bug\Domain\BugSeverity;
use App\Features\Bug\Presentation\Http\Requests\StoreBugRequest;
use App\Features\Bug\Presentation\Http\Requests\UpdateBugRequest;
use App\Features\Bug\Presentation\Http\Resources\BugResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class BugController extends Controller
{
    public function index(ListBugs $listBugs): JsonResponse
    {
        $bugs = $listBugs->handle();

        return response()->json([
            'data' => array_map(fn ($bug) => (new BugResource($bug))->toArray(request()), $bugs),
        ]);
    }

    public function show(int $id, GetBug $getBug): JsonResponse
    {
        $bug = $getBug->handle($id);

        if ($bug === null) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return (new BugResource($bug))->response();
    }

    public function store(StoreBugRequest $request, CreateBug $createBug): JsonResponse
    {
        $data = $request->validated();

        $input = new CreateBugInput(
            relatedTaskId: $data['related_task_id'] ?? null,
            title: $data['title'],
            description: $data['description'] ?? null,
            severity: isset($data['severity']) ? BugSeverity::from($data['severity']) : null,
            discoveredAt: $data['discovered_at'],
        );

        $bug = $createBug->handle($input);

        return (new BugResource($bug))->response()->setStatusCode(201);
    }

    public function update(int $id, UpdateBugRequest $request, UpdateBug $updateBug): JsonResponse
    {
        $bug = $updateBug->handle($id, new UpdateBugInput($request->validated()));

        if ($bug === null) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return (new BugResource($bug))->response();
    }

    public function destroy(int $id, DeleteBug $deleteBug): JsonResponse
    {
        if (! $deleteBug->handle($id)) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return response()->json(null, 204);
    }
}
