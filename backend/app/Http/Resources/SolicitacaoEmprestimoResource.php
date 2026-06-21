<?php

namespace App\Http\Resources;

use BackedEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolicitacaoEmprestimoResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_solicitacao_emprestimo' => $this->id_solicitacao_emprestimo,
            'status' => $this->status instanceof BackedEnum ? $this->status->value : $this->status,
            'observacoes' => $this->observacoes,
            'justificativa_recusa' => $this->justificativa_recusa,
            'data_decisao' => $this->data_decisao?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'usuario' => $this->usuario ? [
                'id_usuario' => $this->usuario->id_usuario,
                'nome_completo' => $this->usuario->nome_completo,
                'email' => $this->usuario->email,
            ] : null,
            'livro' => $this->livro ? [
                'id_livro' => $this->livro->id_livro,
                'titulo' => $this->livro->titulo,
                'isbn' => $this->livro->isbn,
            ] : null,
            'emprestimo' => $this->emprestimo ? [
                'id_emprestimo' => $this->emprestimo->id_emprestimo,
                'data_retirada' => $this->emprestimo->data_retirada?->toISOString(),
                'data_devolucao_prevista' => $this->emprestimo->data_devolucao_prevista?->toDateString(),
                'status' => $this->emprestimo->status,
            ] : null,
            'bibliotecario_responsavel' => $this->bibliotecarioResponsavel ? [
                'id_usuario' => $this->bibliotecarioResponsavel->id_usuario,
                'nome_completo' => $this->bibliotecarioResponsavel->nome_completo,
            ] : null,
        ];
    }
}
