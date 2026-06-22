<?php

namespace App\Http\Resources\Catalog;

use App\Models\ItemEmprestimo;
use BackedEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LivroResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $contagem = $this->contagemExemplares();
        $possuiMovimentacoes = $this->possuiMovimentacoes();

        return [
            'id_livro' => $this->id_livro,
            'titulo' => $this->titulo,
            'isbn' => $this->isbn,
            'ano_publicacao' => $this->ano_publicacao,
            'status_disponibilidade' => $contagem['disponivel'] > 0 ? 'disponivel' : 'indisponivel',
            'contagem_exemplares' => $contagem,
            'possui_movimentacoes' => $possuiMovimentacoes,
            'pode_excluir' => ! $possuiMovimentacoes,
            'id_editora' => $this->id_editora,
            'editora' => new EditoraResource($this->whenLoaded('editora')),
            'autores' => AutorResource::collection($this->whenLoaded('autores')),
            'categorias' => CategoriaResource::collection($this->whenLoaded('categorias')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * @return array{disponivel: int, emprestado: int, reservado: int, manutencao: int}
     */
    private function contagemExemplares(): array
    {
        $contagem = $this->contagem_exemplares;
        if (is_array($contagem)) {
            return [
                'disponivel' => (int) ($contagem['disponivel'] ?? 0),
                'emprestado' => (int) ($contagem['emprestado'] ?? 0),
                'reservado' => (int) ($contagem['reservado'] ?? 0),
                'manutencao' => (int) ($contagem['manutencao'] ?? 0),
            ];
        }

        if ($this->relationLoaded('exemplares')) {
            $contagens = $this->exemplares->groupBy(function ($exemplar): string {
                return $exemplar->status instanceof BackedEnum ? $exemplar->status->value : $exemplar->status;
            })->map->count();
        } else {
            $contagens = $this->exemplares()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');
        }

        return [
            'disponivel' => (int) ($contagens['disponivel'] ?? 0),
            'emprestado' => (int) ($contagens['emprestado'] ?? 0),
            'reservado' => (int) ($contagens['reservado'] ?? 0),
            'manutencao' => (int) ($contagens['manutencao'] ?? 0),
        ];
    }

    private function possuiMovimentacoes(): bool
    {
        return $this->solicitacoesEmprestimo()->exists()
            || ItemEmprestimo::query()
                ->whereHas('exemplar', fn ($query) => $query->where('id_livro', $this->id_livro))
                ->exists();
    }
}
