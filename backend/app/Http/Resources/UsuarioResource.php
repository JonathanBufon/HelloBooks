<?php

namespace App\Http\Resources;

use App\Domain\Usuario\CargoUsuario;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsuarioResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_usuario' => $this->id_usuario,
            'nome_completo' => $this->nome_completo,
            'email' => $this->email,
            'cargo' => $this->cargo instanceof CargoUsuario ? $this->cargo->value : $this->cargo,
            'endereco' => $this->endereco,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
