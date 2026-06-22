<?php

namespace App\Http\Resources;

use BackedEnum;
use Illuminate\Http\Request;

class MultaDetalheResource extends MultaResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        $bibliotecario = $this->bibliotecarioBaixa;
        $bibliotecarioNotificacao = $this->bibliotecarioNotificacao;

        $data['justificativa_perdao'] = $this->justificativa_perdao;
        $data['bibliotecario_baixa'] = $bibliotecario ? [
            'id_usuario' => $bibliotecario->id_usuario,
            'nome_completo' => $bibliotecario->nome_completo,
        ] : null;
        $data['bibliotecario_notificacao'] = $bibliotecarioNotificacao ? [
            'id_usuario' => $bibliotecarioNotificacao->id_usuario,
            'nome_completo' => $bibliotecarioNotificacao->nome_completo,
        ] : null;
        $data['item_emprestimo'] = [
            'id_item_emprestimo' => $this->id_item_emprestimo,
            'id_emprestimo' => $this->itemEmprestimo?->id_emprestimo,
            'data_devolucao_item' => $this->itemEmprestimo?->data_devolucao_item?->toISOString(),
        ];

        return $data;
    }
}
