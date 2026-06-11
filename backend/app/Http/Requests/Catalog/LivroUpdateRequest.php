<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class LivroUpdateRequest extends FormRequest
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
            'titulo' => ['sometimes', 'string', 'max:255'],
            'isbn' => ['sometimes', 'string', 'min:10', 'max:13', 'regex:/^[a-zA-Z0-9]+$/'],
            'ano_publicacao' => ['sometimes', 'integer', 'min:1000', 'max:'.((int) now()->year + 1)],
            'id_editora' => ['sometimes', 'integer', 'exists:editoras,id_editora'],
            'autores' => ['sometimes', 'array', 'min:1'],
            'autores.*.id_autor' => ['required', 'integer', 'exists:autores,id_autor'],
            'categorias' => ['sometimes', 'array', 'min:1'],
            'categorias.*.id_categoria' => ['required', 'integer', 'exists:categorias,id_categoria'],
        ];
    }
}
