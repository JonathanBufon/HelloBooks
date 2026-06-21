<?php

namespace App\Http\Requests\Multa;

use App\Domain\Multa\MotivoMulta;
use App\Domain\Multa\StatusMulta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MultaIndexRequest extends FormRequest
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
            'status' => ['sometimes', 'string', Rule::enum(StatusMulta::class)],
            'motivo' => ['sometimes', 'string', Rule::enum(MotivoMulta::class)],
            'id_usuario' => ['sometimes', 'integer'],
            'q' => ['sometimes', 'string', 'max:255'],
            'de' => ['sometimes', 'date'],
            'ate' => ['sometimes', 'date'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
