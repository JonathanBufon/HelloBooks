<?php

namespace Database\Seeders;

use App\Domain\Usuario\CargoUsuario;
use App\Models\Emprestimo;
use App\Models\Exemplar;
use App\Models\ItemEmprestimo;
use App\Models\Multa;
use App\Models\SolicitacaoEmprestimo;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class EmprestimoTestSeeder extends Seeder
{
    public function run(): void
    {
        $bibliotecario = Usuario::query()->where('email', 'biblio@hello.local')->firstOrFail();
        $leitor = $this->leitor('Leitor HelloBooks', 'leitor@hello.local');
        $ana = $this->leitor('Ana Leitora', 'ana.leitora@hello.local');
        $bruno = $this->leitor('Bruno Atrasado', 'bruno.atrasado@hello.local');
        $carla = $this->leitor('Carla Sem Pendencias', 'carla.sem-pendencias@hello.local');

        $exemplares = Exemplar::query()->with('livro')->orderBy('id_exemplar')->limit(12)->get();

        if ($exemplares->count() < 8) {
            return;
        }

        $itensLeitor = $this->emprestimoComItens($leitor, 'atrasado', $exemplares->slice(0, 2), 14, -5);
        $this->multa($itensLeitor[0], 'atraso', 12.50);
        $this->multa($itensLeitor[1], 'rabisco', 25.00);

        $itensAna = $this->emprestimoComItens($ana, 'devolvido', $exemplares->slice(2, 2), 30, -12, true);
        $this->multa($itensAna[0], 'atraso', 8.00, 'paga', $bibliotecario);
        $this->multa($itensAna[1], 'dobra', 18.00);

        $itensBruno = $this->emprestimoComItens($bruno, 'devolvido', $exemplares->slice(4, 2), 21, -4, true);
        $this->multa($itensBruno[0], 'rasgo', 40.00, 'perdoada', $bibliotecario, 'Isencao administrativa para demonstracao');

        $this->emprestimoComItens($carla, 'ativo', $exemplares->slice(6, 2), 3, 10);

        $this->solicitacao($leitor, $exemplares[8]->id_livro, 'pendente', 'Retirada preferencial no periodo da tarde.');
        $this->solicitacao($ana, $exemplares[9]->id_livro, 'pendente');
        $this->solicitacao($bruno, $exemplares[10]->id_livro, 'recusada', null, $bibliotecario, 'Leitor possui pendencias administrativas.');
    }

    private function leitor(string $nome, string $email): Usuario
    {
        return Usuario::query()->updateOrCreate(
            ['email' => $email],
            [
                'nome_completo' => $nome,
                'cargo' => CargoUsuario::Leitor,
                'senha_hash' => 'secret123',
            ],
        );
    }

    /**
     * @param  Collection<int, Exemplar>  $exemplares
     * @return array<int, ItemEmprestimo>
     */
    private function emprestimoComItens(
        Usuario $leitor,
        string $status,
        Collection $exemplares,
        int $diasDesdeRetirada,
        int $diasAteDevolucaoPrevista,
        bool $devolvido = false,
    ): array {
        $emprestimo = Emprestimo::query()->updateOrCreate(
            ['id_usuario' => $leitor->id_usuario, 'status' => $status],
            [
                'data_retirada' => now()->subDays($diasDesdeRetirada),
                'data_devolucao_prevista' => now()->addDays($diasAteDevolucaoPrevista)->toDateString(),
                'data_devolucao_real' => $devolvido ? now()->subDays(1) : null,
            ],
        );

        return $exemplares
            ->map(function (Exemplar $exemplar) use ($emprestimo, $devolvido): ItemEmprestimo {
                $exemplar->update(['status' => $devolvido ? 'disponivel' : 'emprestado']);

                return ItemEmprestimo::query()->updateOrCreate(
                    [
                        'id_emprestimo' => $emprestimo->id_emprestimo,
                        'id_exemplar' => $exemplar->id_exemplar,
                    ],
                    [
                        'data_devolucao_item' => $devolvido ? now()->subDays(1) : null,
                    ],
                );
            })
            ->values()
            ->all();
    }

    private function multa(
        ItemEmprestimo $item,
        string $motivo,
        float $valor,
        string $status = 'pendente',
        ?Usuario $bibliotecario = null,
        ?string $justificativa = null,
    ): Multa {
        return Multa::query()->updateOrCreate(
            ['id_item_emprestimo' => $item->id_item_emprestimo, 'motivo' => $motivo],
            [
                'valor' => $valor,
                'status' => $status,
                'justificativa_perdao' => $status === 'perdoada' ? $justificativa : null,
                'id_bibliotecario_baixa' => $status === 'pendente' ? null : $bibliotecario?->id_usuario,
                'data_baixa' => $status === 'pendente' ? null : now()->subDays(1),
            ],
        );
    }

    private function solicitacao(
        Usuario $leitor,
        int $idLivro,
        string $status,
        ?string $observacoes = null,
        ?Usuario $bibliotecario = null,
        ?string $justificativa = null,
    ): SolicitacaoEmprestimo {
        return SolicitacaoEmprestimo::query()->updateOrCreate(
            ['id_usuario' => $leitor->id_usuario, 'id_livro' => $idLivro, 'status' => $status],
            [
                'observacoes' => $observacoes,
                'justificativa_recusa' => $status === 'recusada' ? $justificativa : null,
                'id_bibliotecario_responsavel' => $status === 'pendente' ? null : $bibliotecario?->id_usuario,
                'data_decisao' => $status === 'pendente' ? null : now()->subDay(),
            ],
        );
    }
}
