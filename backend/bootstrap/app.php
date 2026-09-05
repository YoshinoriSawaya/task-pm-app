<?php

use App\Features\Task\Domain\Exceptions\InvalidTaskHierarchyException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // ドメイン例外をapi-design.mdの共通エラー形式に変換する
        // (docs/development/coding-standards.md「エラーハンドリング」参照)
        $exceptions->render(function (InvalidTaskHierarchyException $e, $request) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => ['parent_task_id' => [$e->getMessage()]],
            ], 422);
        });
    })->create();
