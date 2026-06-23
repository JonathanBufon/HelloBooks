<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MultaResumoResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'quantidade_pendente' => $this->resource['quantidade_pendente'],
            'valor_total_pendente' => $this->resource['valor_total_pendente'],
        ];
    }
}
