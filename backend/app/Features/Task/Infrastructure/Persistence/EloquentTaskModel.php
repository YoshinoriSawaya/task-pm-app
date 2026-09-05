<?php

namespace App\Features\Task\Infrastructure\Persistence;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class EloquentTaskModel extends Model
{
    use SoftDeletes;

    /**
     * @return HasMany<EloquentTaskModel, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_task_id');
    }

    protected $table = 'tasks';

    protected $fillable = [
        'parent_task_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'definition_of_done',
        'estimated_effort',
        'actual_effort',
    ];

    protected $casts = [
        'due_date' => 'date:Y-m-d',
        'estimated_effort' => 'float',
        'actual_effort' => 'float',
    ];
}
