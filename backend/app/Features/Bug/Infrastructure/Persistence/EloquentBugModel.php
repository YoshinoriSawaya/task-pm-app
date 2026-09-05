<?php

namespace App\Features\Bug\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EloquentBugModel extends Model
{
    use SoftDeletes;

    protected $table = 'bugs';

    protected $fillable = [
        'related_task_id',
        'title',
        'description',
        'severity',
        'status',
        'discovered_at',
        'resolved_at',
    ];

    protected $casts = [
        'discovered_at' => 'date:Y-m-d',
        'resolved_at' => 'date:Y-m-d',
    ];
}
