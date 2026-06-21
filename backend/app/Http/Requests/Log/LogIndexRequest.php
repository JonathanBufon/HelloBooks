<?php

namespace App\Http\Requests\Log;

use Illuminate\Foundation\Http\FormRequest;

class LogIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, string>
     */
    public function rules(): array
    {
        return [
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:100',
            'entidade' => 'sometimes|string|max:50',
            'acao' => 'sometimes|string|in:created,updated,deleted',
            'id_usuario' => 'sometimes|integer|min:1',
            'de' => 'sometimes|date',
            'ate' => 'sometimes|date|after_or_equal:de',
        ];
    }
}
