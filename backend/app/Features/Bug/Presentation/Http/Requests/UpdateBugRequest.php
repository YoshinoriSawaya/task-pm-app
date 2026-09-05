<?php

namespace App\Features\Bug\Presentation\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBugRequest extends FormRequest
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
            'severity' => ['sometimes', 'in:high,medium,low'],
            'status' => ['sometimes', 'in:open,resolved'],
            'discovered_at' => ['sometimes', 'date_format:Y-m-d'],
            'resolved_at' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        // resolved_atを指定する場合は、同じリクエストでstatusをresolvedにする必要がある
        // (api-design.md: statusがopenのままresolved_atが指定されていたら422)
        $validator->after(function (Validator $validator) {
            if ($this->filled('resolved_at') && $this->input('status') !== 'resolved') {
                $validator->errors()->add(
                    'resolved_at',
                    'resolved_atを指定する場合はstatusをresolvedにしてください。'
                );
            }
        });
    }
}
