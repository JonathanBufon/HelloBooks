<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemEmprestimoResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $emprestimo = $this->emprestimo;
        $exemplar = $this->exemplar;
        $livro = $exemplar?->livro;

        return [
            'id_item_emprestimo' => $this->id_item_emprestimo,
            'id_emprestimo' => $this->id_emprestimo,
            'data_devolucao_item' => $this->data_devolucao_item?->toISOString(),
            'emprestimo' => $emprestimo ? [
                'id_emprestimo' => $emprestimo->id_emprestimo,
                'data_retirada' => $emprestimo->data_retirada?->toISOString(),
                'data_devolucao_prevista' => $emprestimo->data_devolucao_prevista?->toDateString(),
                'status' => $emprestimo->status,
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
