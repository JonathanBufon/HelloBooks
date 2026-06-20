<?php

namespace App\Services;

use App\Models\Autor;
use App\Models\Categoria;
use App\Models\Editora;
use App\Models\Exemplar;
use App\Models\Livro;
use App\Models\Usuario;
use App\Repositories\LogRepositoryInterface;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function __construct(private readonly LogRepositoryInterface $logs) {}

    /**
     * @return array<string, mixed>
     */
    public function stats(): array
    {
        return [
            'total_livros' => Livro::query()->count(),
            'total_exemplares' => Exemplar::query()->count(),
            'exemplares_por_status' => $this->exemplaresPorStatus(),
            'total_autores' => Autor::query()->count(),
            'total_editoras' => Editora::query()->count(),
            'total_categorias' => Categoria::query()->count(),
            'total_usuarios' => Usuario::query()->count(),
            'livros_recentes' => Livro::query()
                ->with('autores')
                ->orderByDesc('created_at')
                ->orderByDesc('id_livro')
                ->limit(5)
                ->get(),
            'atividade_recente' => $this->logs->recentes(10),
        ];
    }

    /**
     * @return array{disponivel: int, emprestado: int, reservado: int, manutencao: int}
     */
    private function exemplaresPorStatus(): array
    {
        $contagens = DB::table('exemplares')
            ->select('status', DB::raw('count(*) as total'))
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
