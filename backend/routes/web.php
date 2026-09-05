<?php

use Illuminate\Support\Facades\Route;

// このバックエンドはAPI専用(SPAはfrontend/側)。ルートはヘルスチェック用途のみ残す。
Route::get('/', fn () => response()->json(['status' => 'ok', 'app' => config('app.name')]));
