<?php

namespace App\Http\Resources;

use BackedEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MultaResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $itemEmprestimo = $this->itemEmprestimo;
        $emprestimo = $itemEmprestimo?->emprestimo;
        $usuario = $emprestimo?->usuario;
        $exemplar = $itemEmprestimo?->exemplar;
        $livro = $exemplar?->livro;

        return [
            'id_multa' => $this->id_multa,
            'motivo' => $this->motivo instanceof BackedEnum ? $this->motivo->value : $this->motivo,
            'valor' => $this->valor,
            'status' => $this->status instanceof BackedEnum ? $this->status->value : $this->status,
            'data_baixa' => $this->data_baixa?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'usuario' => $usuario ? [
                'id_usuario' => $usuario->id_usuario,
                'nome_completo' => $usuario->nome_completo,
            ] : null,
            'livro' => $livro ? [
                'id_livro' => $livro->id_livro,
                'titulo' => $livro->titulo,
            ] : null,
            'exemplar' => $exemplar ? [
                'id_exemplar' => $exemplar->id_exemplar,
            ] : null,
        ];
    }
}
