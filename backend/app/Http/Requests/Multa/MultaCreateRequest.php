<?php

namespace App\Http\Requests\Multa;

use App\Domain\Multa\MotivoMulta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MultaCreateRequest extends FormRequest
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
            'id_item_emprestimo' => ['required', 'integer', 'exists:itens_emprestimo,id_item_emprestimo'],
            'motivo' => ['required', 'string', Rule::enum(MotivoMulta::class)],
            'valor' => ['required', 'numeric', 'gt:0'],
        ];
    }
}
