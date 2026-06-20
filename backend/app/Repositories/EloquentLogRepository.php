<?php

namespace App\Repositories;

use App\Models\LogAtividade;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentLogRepository implements LogRepositoryInterface
{
    public function listar(array $filtros = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filtros['per_page'] ?? 20), 1), 100);

        return LogAtividade::query()
            ->with('usuario')
            ->when(! empty($filtros['entidade']), fn ($query) => $query->where('entidade_afetada', $filtros['entidade']))
            ->when(! empty($filtros['acao']), fn ($query) => $query->where('acao_realizada', $filtros['acao']))
            ->when(! empty($filtros['id_usuario']), fn ($query) => $query->where('id_usuario', $filtros['id_usuario']))
            ->when(! empty($filtros['de']), fn ($query) => $query->whereDate('data_hora', '>=', $filtros['de']))
            ->when(! empty($filtros['ate']), fn ($query) => $query->whereDate('data_hora', '<=', $filtros['ate']))
            ->orderByDesc('data_hora')
            ->orderByDesc('id_log')
            ->paginate($perPage);
    }

    public function recentes(int $limite = 10): Collection
    {
        return LogAtividade::query()
            ->with('usuario')
            ->orderByDesc('data_hora')
            ->orderByDesc('id_log')
            ->limit($limite)
            ->get();
    }
}
