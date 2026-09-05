<?php

namespace App\Features\Task\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // 認証機能なし(client-requirements.mdのスコープ外決定)
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // 論理削除済みタスクを親に指定できてしまうと孤立タスクが生まれるため除外する(code-review指摘)
            'parent_task_id' => ['nullable', 'integer', Rule::exists('tasks', 'id')->whereNull('deleted_at')],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['nullable', 'in:high,medium,low'],
            // DBがdecimal(5,2)のためYYYY-MM-DD厳密指定(code-review指摘)
            'due_date' => ['nullable', 'date_format:Y-m-d'],
            'definition_of_done' => ['nullable', 'string'],
            // decimal(5,2)の上限(999.99)を超えるとDBエラー(500)になるため上限を明示(code-review指摘)
            'estimated_effort' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
        ];
    }
}
