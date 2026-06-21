<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogAtividadeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_log' => $this->id_log,
            'acao_realizada' => $this->acao_realizada,
            'entidade_afetada' => $this->entidade_afetada,
            'id_registro_afetado' => $this->id_registro_afetado,
            'data_hora' => $this->data_hora?->toISOString(),
            'usuario' => $this->whenLoaded('usuario', fn (): array => [
                'id_usuario' => $this->usuario->id_usuario,
                'nome_completo' => $this->usuario->nome_completo,
            ]),
        ];
    }
}
