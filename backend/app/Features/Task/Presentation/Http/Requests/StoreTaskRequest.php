<?php

namespace App\Features\Task\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'parent_task_id' => ['nullable', 'integer', 'exists:tasks,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['nullable', 'in:high,medium,low'],
            'due_date' => ['nullable', 'date'],
            'definition_of_done' => ['nullable', 'string'],
            'estimated_effort' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
