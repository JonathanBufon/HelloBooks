<?php

namespace Database\Seeders;

use App\Domain\Usuario\CargoUsuario;
use App\Models\Emprestimo;
use App\Models\Exemplar;
use App\Models\ItemEmprestimo;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class EmprestimoTestSeeder extends Seeder
{
    public function run(): void
    {
        $leitor = Usuario::query()->updateOrCreate(
            ['email' => 'leitor@hello.local'],
            [
                'nome_completo' => 'Leitor HelloBooks',
                'cargo' => CargoUsuario::Leitor,
                'senha_hash' => 'password',
            ],
        );

        $exemplares = Exemplar::query()->orderBy('id_exemplar')->limit(3)->get();

        if ($exemplares->isEmpty()) {
            return;
        }

        $emprestimo = Emprestimo::query()->updateOrCreate(
            ['id_usuario' => $leitor->id_usuario, 'status' => 'ativo'],
            [
                'data_retirada' => now()->subDays(7),
                'data_devolucao_prevista' => now()->subDay(),
            ],
        );

        foreach ($exemplares as $exemplar) {
            ItemEmprestimo::query()->firstOrCreate(
                [
                    'id_emprestimo' => $emprestimo->id_emprestimo,
                    'id_exemplar' => $exemplar->id_exemplar,
                ],
            );
        }
    }
}
