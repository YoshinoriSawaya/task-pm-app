<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // api-design.mdの単一リソースレスポンスは"data"ラップを持たない形式のため無効化する。
        // 一覧(GET /api/tasks)は{"data": [...]}を各コントローラで明示的に返す。
        JsonResource::withoutWrapping();
    }
}
