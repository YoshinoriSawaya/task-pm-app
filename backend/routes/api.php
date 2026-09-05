<?php

use App\Features\Bug\Presentation\Http\Controllers\BugController;
use App\Features\Progress\Presentation\Http\Controllers\ProgressController;
use App\Features\Task\Presentation\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/tasks', [TaskController::class, 'index']);
Route::get('/tasks/{id}', [TaskController::class, 'show'])->whereNumber('id');
Route::post('/tasks', [TaskController::class, 'store']);
Route::patch('/tasks/{id}', [TaskController::class, 'update'])->whereNumber('id');
Route::delete('/tasks/{id}', [TaskController::class, 'destroy'])->whereNumber('id');

Route::get('/bugs', [BugController::class, 'index']);
Route::get('/bugs/{id}', [BugController::class, 'show'])->whereNumber('id');
Route::post('/bugs', [BugController::class, 'store']);
Route::patch('/bugs/{id}', [BugController::class, 'update'])->whereNumber('id');
Route::delete('/bugs/{id}', [BugController::class, 'destroy'])->whereNumber('id');

Route::get('/progress', [ProgressController::class, 'show']);
