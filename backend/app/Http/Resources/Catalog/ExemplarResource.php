<?php

namespace App\Http\Resources\Catalog;

use BackedEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExemplarResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_exemplar' => $this->id_exemplar,
            'id_livro' => $this->id_livro,
            'status' => $this->status instanceof BackedEnum ? $this->status->value : $this->status,
            'condicao_fisica' => $this->condicao_fisica instanceof BackedEnum ? $this->condicao_fisica->value : $this->condicao_fisica,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
