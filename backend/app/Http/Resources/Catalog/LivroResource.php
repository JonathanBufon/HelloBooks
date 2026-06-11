<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LivroResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_livro' => $this->id_livro,
            'titulo' => $this->titulo,
            'isbn' => $this->isbn,
            'ano_publicacao' => $this->ano_publicacao,
            'id_editora' => $this->id_editora,
            'editora' => new EditoraResource($this->whenLoaded('editora')),
            'autores' => AutorResource::collection($this->whenLoaded('autores')),
            'categorias' => CategoriaResource::collection($this->whenLoaded('categorias')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
