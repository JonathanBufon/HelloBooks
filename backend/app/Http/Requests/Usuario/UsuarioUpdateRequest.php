<?php

namespace App\Http\Requests\Usuario;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UsuarioUpdateRequest extends FormRequest
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
            'nome_completo' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'senha' => 'sometimes|required|string|min:6',
            'cargo' => ['sometimes', 'required', Rule::in(['bibliotecario', 'leitor'])],
            'endereco' => 'sometimes|nullable|string|max:500',
        ];
    }
}
