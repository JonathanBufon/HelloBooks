<?php

namespace App\Http\Requests\Usuario;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UsuarioCreateRequest extends FormRequest
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
            'nome_completo' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'senha' => 'required|string|min:6',
            'cargo' => ['required', Rule::in(['bibliotecario', 'leitor'])],
            'endereco' => 'sometimes|nullable|string|max:500',
        ];
    }
}
