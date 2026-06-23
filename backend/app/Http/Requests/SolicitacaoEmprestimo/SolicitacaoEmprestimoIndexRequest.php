<?php

namespace App\Http\Requests\SolicitacaoEmprestimo;

use App\Domain\SolicitacaoEmprestimo\StatusSolicitacaoEmprestimo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SolicitacaoEmprestimoIndexRequest extends FormRequest
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
            'status' => ['sometimes', 'string', Rule::enum(StatusSolicitacaoEmprestimo::class)],
            'id_usuario' => ['sometimes', 'integer'],
            'q' => ['sometimes', 'string', 'max:255'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
