<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Request;

class LivroDetalheResource extends LivroResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'exemplares' => ExemplarResource::collection($this->whenLoaded('exemplares')),
            'contagem_exemplares' => $this->contagem_exemplares,
        ]);
    }
}
