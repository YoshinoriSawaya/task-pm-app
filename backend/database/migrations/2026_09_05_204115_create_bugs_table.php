<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// テーブル設計はdocs/architecture/er-diagram.md参照(ADR-0002)。
return new class () extends Migration {
    public function up(): void
    {
        Schema::create('bugs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('related_task_id')
                ->nullable()
                ->constrained('tasks')
                ->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('severity', ['high', 'medium', 'low'])->default('medium');
            $table->enum('status', ['open', 'resolved'])->default('open');
            $table->date('discovered_at');
            $table->date('resolved_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bugs');
    }
};
