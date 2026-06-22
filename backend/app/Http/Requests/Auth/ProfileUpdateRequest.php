<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
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
            'nome_completo' => ['sometimes', 'required', 'string', 'max:255'],
            'senha_atual' => ['required_with:nova_senha', 'string'],
            'nova_senha' => ['sometimes', 'required', 'string', 'min:6', 'confirmed'],
        ];
    }
}
