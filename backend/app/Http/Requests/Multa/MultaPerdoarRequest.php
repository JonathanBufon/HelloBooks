<?php

namespace App\Http\Requests\Multa;

use Illuminate\Foundation\Http\FormRequest;

class MultaPerdoarRequest extends FormRequest
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
            'justificativa' => ['required', 'string', 'min:1', 'max:1000'],
        ];
    }
}
