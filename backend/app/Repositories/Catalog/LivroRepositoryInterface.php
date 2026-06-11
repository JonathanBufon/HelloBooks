<?php

namespace App\Repositories\Catalog;

use App\Models\Livro;

interface LivroRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $dados
     */
    public function criar(array $dados): Livro;

    public function buscarPorIsbn(string $isbn): ?Livro;

    public function acharPorId(int $id): ?Livro;

    public function comDetalhes(int $id): ?Livro;

    /**
     * @return array{disponivel: int, emprestado: int, reservado: int, manutencao: int}
     */
    public function contagemPorStatus(int $idLivro): array;
}
