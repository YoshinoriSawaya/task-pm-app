<?php

namespace App\Features\Bug\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBugRequest extends FormRequest
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
            // 論理削除済みタスクへの関連付けは不可(Task側と同じ方針。code-review指摘の横展開)
            'related_task_id' => ['nullable', 'integer', Rule::exists('tasks', 'id')->whereNull('deleted_at')],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'severity' => ['nullable', 'in:high,medium,low'],
            'discovered_at' => ['required', 'date_format:Y-m-d'],
        ];
    }
}
