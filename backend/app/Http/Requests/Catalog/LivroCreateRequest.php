<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class LivroCreateRequest extends FormRequest
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
            'titulo' => ['required', 'string', 'max:255'],
            'isbn' => ['required', 'string', 'min:10', 'max:13', 'regex:/^[a-zA-Z0-9]+$/'],
            'ano_publicacao' => ['required', 'integer', 'min:1000', 'max:'.((int) now()->year + 1)],
            'id_editora' => ['required_without:editora', 'integer', 'exists:editoras,id_editora'],
            'editora.nome' => ['required_without:id_editora', 'string', 'max:255'],
            'autores' => ['required', 'array', 'min:1'],
            'autores.*.id_autor' => ['required_without:autores.*.nome', 'integer', 'exists:autores,id_autor'],
            'autores.*.nome' => ['required_without:autores.*.id_autor', 'string', 'max:255'],
            'categorias' => ['required', 'array', 'min:1'],
            'categorias.*.id_categoria' => ['required_without:categorias.*.nome', 'integer', 'exists:categorias,id_categoria'],
            'categorias.*.nome' => ['required_without:categorias.*.id_categoria', 'string', 'max:255'],
        ];
    }
}
