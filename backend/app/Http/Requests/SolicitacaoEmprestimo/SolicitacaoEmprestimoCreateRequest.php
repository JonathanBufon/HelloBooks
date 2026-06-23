<?php

namespace App\Http\Requests\SolicitacaoEmprestimo;

use Illuminate\Foundation\Http\FormRequest;

class SolicitacaoEmprestimoCreateRequest extends FormRequest
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
            'id_livro' => ['required', 'integer', 'exists:livros,id_livro'],
            'observacoes' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ];
    }
}
