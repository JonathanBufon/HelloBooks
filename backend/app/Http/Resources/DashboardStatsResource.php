<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_livros' => $this->resource['total_livros'],
            'total_exemplares' => $this->resource['total_exemplares'],
            'exemplares_por_status' => $this->resource['exemplares_por_status'],
            'total_autores' => $this->resource['total_autores'],
            'total_editoras' => $this->resource['total_editoras'],
            'total_categorias' => $this->resource['total_categorias'],
            'total_usuarios' => $this->resource['total_usuarios'],
            'livros_recentes' => $this->resource['livros_recentes']->map(fn ($livro): array => [
                'id_livro' => $livro->id_livro,
                'titulo' => $livro->titulo,
                'autores' => $livro->autores->pluck('nome')->values()->all(),
                'created_at' => $livro->created_at?->toISOString(),
            ])->all(),
            'atividade_recente' => $this->resource['atividade_recente']
                ->map(fn ($log): array => (new LogAtividadeResource($log))->resolve($request))
                ->all(),
        ];
    }
}
