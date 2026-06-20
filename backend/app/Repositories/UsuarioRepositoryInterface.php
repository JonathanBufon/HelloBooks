<?php

namespace App\Repositories;

use App\Models\Usuario;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UsuarioRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $filtros
     */
    public function listar(array $filtros = []): LengthAwarePaginator;

    public function acharPorId(int $id): ?Usuario;

    public function buscarPorEmail(string $email): ?Usuario;

    public function emailExiste(string $email, ?int $ignorarId = null): bool;

    /**
     * @param  array<string, mixed>  $dados
     */
    public function criar(array $dados): Usuario;

    /**
     * @param  array<string, mixed>  $dados
     */
    public function atualizar(Usuario $usuario, array $dados): Usuario;

    public function remover(Usuario $usuario): void;
}
