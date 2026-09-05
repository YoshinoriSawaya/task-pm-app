<?php

namespace App\Features\Task\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'in:not_started,in_progress,done'],
            'priority' => ['sometimes', 'in:high,medium,low'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'definition_of_done' => ['sometimes', 'nullable', 'string'],
            'estimated_effort' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'actual_effort' => ['sometimes', 'nullable', 'numeric', 'min:0'],
        ];
        // parent_task_idは受け付けない(api-design.md「親子関係の付け替えはスコープ外」)。
        // ここに定義しないため、送られても無視される。
    }
}
