<?php

namespace App\Repositories;

use App\Models\Usuario;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EloquentUsuarioRepository implements UsuarioRepositoryInterface
{
    public function listar(array $filtros = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filtros['per_page'] ?? 20), 1), 100);
        $busca = trim((string) ($filtros['q'] ?? ''));

        $operador = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return Usuario::query()
            ->when($busca !== '', fn ($query) => $query->where(function ($query) use ($busca, $operador): void {
                $query->where('nome_completo', $operador, "%{$busca}%")
                    ->orWhere('email', $operador, "%{$busca}%");
            }))
            ->orderBy('id_usuario')
            ->paginate($perPage);
    }

    public function acharPorId(int $id): ?Usuario
    {
        return Usuario::query()->find($id);
    }

    public function buscarPorEmail(string $email): ?Usuario
    {
        return Usuario::query()->where('email', $email)->first();
    }

    public function emailExiste(string $email, ?int $ignorarId = null): bool
    {
        return Usuario::query()
            ->where('email', $email)
            ->when($ignorarId !== null, fn ($query) => $query->whereKeyNot($ignorarId))
            ->exists();
    }

    public function criar(array $dados): Usuario
    {
        return Usuario::query()->create($dados);
    }

    public function atualizar(Usuario $usuario, array $dados): Usuario
    {
        $usuario->update($dados);

        return $usuario->refresh();
    }

    public function remover(Usuario $usuario): void
    {
        $usuario->delete();
    }
}
