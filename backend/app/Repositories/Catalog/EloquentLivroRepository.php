<?php

namespace App\Repositories\Catalog;

use App\Models\Livro;
use Illuminate\Support\Facades\DB;

class EloquentLivroRepository implements LivroRepositoryInterface
{
    public function criar(array $dados): Livro
    {
        return Livro::query()->create($dados);
    }

    public function buscarPorIsbn(string $isbn): ?Livro
    {
        return Livro::query()->where('isbn', $isbn)->first();
    }

    public function acharPorId(int $id): ?Livro
    {
        return Livro::query()->find($id);
    }

    public function comDetalhes(int $id): ?Livro
    {
        return Livro::query()
            ->with(['editora', 'autores', 'categorias', 'exemplares'])
            ->find($id);
    }

    public function contagemPorStatus(int $idLivro): array
    {
        $contagens = DB::table('exemplares')
            ->select('status', DB::raw('count(*) as total'))
            ->where('id_livro', $idLivro)
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            'disponivel' => (int) ($contagens['disponivel'] ?? 0),
            'emprestado' => (int) ($contagens['emprestado'] ?? 0),
            'reservado' => (int) ($contagens['reservado'] ?? 0),
            'manutencao' => (int) ($contagens['manutencao'] ?? 0),
        ];
    }
}
