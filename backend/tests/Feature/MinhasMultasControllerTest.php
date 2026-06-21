<?php

namespace Tests\Feature;

use App\Domain\Multa\MotivoMulta;
use App\Domain\Multa\StatusMulta;
use App\Domain\Usuario\CargoUsuario;
use App\Models\Editora;
use App\Models\Emprestimo;
use App\Models\Exemplar;
use App\Models\ItemEmprestimo;
use App\Models\Livro;
use App\Models\Multa;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MinhasMultasControllerTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $leitor;

    private Usuario $outroLeitor;

    private ItemEmprestimo $item;

    private ItemEmprestimo $outroItem;

    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => 'hellobooks-testing-jwt-secret-32-bytes-minimum']);

        $this->leitor = $this->usuario('Leitor A', 'leitor-a@hello.local', 'secret123', CargoUsuario::Leitor);
        $this->outroLeitor = $this->usuario('Leitor B', 'leitor-b@hello.local', 'secret123', CargoUsuario::Leitor);
        $this->item = $this->criarItemEmprestimo($this->leitor);
        $this->outroItem = $this->criarItemEmprestimo($this->outroLeitor);
    }

    // --- RESUMO ---

    public function test_resumo_retorna_contagem_e_valor_pendentes(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso, 20.00);
        $this->criarMulta($this->item, MotivoMulta::Rabisco, 15.50);
        $this->criarMulta($this->item, MotivoMulta::Rasgo, 10.00, StatusMulta::Paga);

        $this->withToken($this->tokenLeitor())
            ->getJson('/api/v1/minhas-multas/resumo')
            ->assertOk()
            ->assertJsonPath('quantidade_pendente', 2)
            ->assertJsonPath('valor_total_pendente', '35.50');
    }

    public function test_resumo_sem_multas_retorna_zeros(): void
    {
        $this->withToken($this->tokenLeitor())
            ->getJson('/api/v1/minhas-multas/resumo')
            ->assertOk()
            ->assertJsonPath('quantidade_pendente', 0)
            ->assertJsonPath('valor_total_pendente', '0.00');
    }

    public function test_resumo_nao_inclui_multas_de_outro_usuario(): void
    {
        $this->criarMulta($this->outroItem, MotivoMulta::Atraso, 30.00);

        $this->withToken($this->tokenLeitor())
            ->getJson('/api/v1/minhas-multas/resumo')
            ->assertOk()
            ->assertJsonPath('quantidade_pendente', 0)
            ->assertJsonPath('valor_total_pendente', '0.00');
    }

    // --- INDEX ---

    public function test_index_retorna_multas_do_usuario_autenticado(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso);
        $this->criarMulta($this->item, MotivoMulta::Rabisco);

        $this->withToken($this->tokenLeitor())
            ->getJson('/api/v1/minhas-multas')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure([
                'data' => [['id_multa', 'motivo', 'valor', 'status']],
                'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
                'resumo' => ['quantidade_pendente', 'valor_total_pendente'],
            ]);
    }

    public function test_index_nao_retorna_multas_de_outro_usuario(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso);
        $this->criarMulta($this->outroItem, MotivoMulta::Atraso);

        $this->withToken($this->tokenLeitor())
            ->getJson('/api/v1/minhas-multas')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_index_filtra_por_status(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso, 10.00, StatusMulta::Pendente);
        $this->criarMulta($this->item, MotivoMulta::Rabisco, 10.00, StatusMulta::Paga);

        $this->withToken($this->tokenLeitor())
            ->getJson('/api/v1/minhas-multas?status=paga')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'paga');
    }

    public function test_index_inclui_resumo_junto_com_dados(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso, 25.00);

        $response = $this->withToken($this->tokenLeitor())
            ->getJson('/api/v1/minhas-multas')
            ->assertOk();

        $resumo = $response->json('resumo');
        $this->assertSame(1, $resumo['quantidade_pendente']);
        $this->assertSame('25.00', $resumo['valor_total_pendente']);
    }

    // --- AUTHORIZATION ---

    public function test_rotas_exigem_autenticacao(): void
    {
        $this->app['auth']->forgetGuards();

        $this->withHeaders(['Authorization' => ''])
            ->getJson('/api/v1/minhas-multas')
            ->assertUnauthorized();

        $this->withHeaders(['Authorization' => ''])
            ->getJson('/api/v1/minhas-multas/resumo')
            ->assertUnauthorized();
    }

    public function test_bibliotecario_tambem_pode_acessar_minhas_multas(): void
    {
        $bib = $this->usuario('Bib', 'bib@hello.local', 'secret123', CargoUsuario::Bibliotecario);
        $tokenBib = $this->token('bib@hello.local', 'secret123');

        $this->withToken($tokenBib)
            ->getJson('/api/v1/minhas-multas/resumo')
            ->assertOk()
            ->assertJsonPath('quantidade_pendente', 0);

        $this->withToken($tokenBib)
            ->getJson('/api/v1/minhas-multas')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    // --- Helpers ---

    private function usuario(string $nome, string $email, string $senha, CargoUsuario $cargo): Usuario
    {
        return Usuario::query()->create([
            'nome_completo' => $nome,
            'cargo' => $cargo,
            'email' => $email,
            'senha_hash' => $senha,
        ]);
    }

    private function token(string $email, string $senha): string
    {
        return $this->postJson('/api/v1/auth/login', [
            'email' => $email,
            'senha' => $senha,
        ])->assertOk()->json('token');
    }

    private function tokenLeitor(): string
    {
        return $this->token('leitor-a@hello.local', 'secret123');
    }

    private function criarItemEmprestimo(Usuario $leitor): ItemEmprestimo
    {
        $editora = Editora::query()->create(['nome' => 'Editora Teste']);
        $livro = Livro::query()->create([
            'id_editora' => $editora->id_editora,
            'titulo' => 'Livro Teste',
            'isbn' => fake()->isbn13(),
            'ano_publicacao' => 2024,
        ]);
        $exemplar = Exemplar::query()->create([
            'id_livro' => $livro->id_livro,
            'status' => 'disponivel',
            'condicao_fisica' => 'intacto',
        ]);
        $emprestimo = Emprestimo::query()->create([
            'id_usuario' => $leitor->id_usuario,
            'data_retirada' => now()->subDays(7),
            'data_devolucao_prevista' => now()->subDay(),
            'status' => 'ativo',
        ]);

        return ItemEmprestimo::query()->create([
            'id_emprestimo' => $emprestimo->id_emprestimo,
            'id_exemplar' => $exemplar->id_exemplar,
        ]);
    }

    private function criarMulta(
        ItemEmprestimo $item,
        MotivoMulta $motivo,
        float $valor = 10.00,
        StatusMulta $status = StatusMulta::Pendente,
    ): Multa {
        return Multa::query()->create([
            'id_item_emprestimo' => $item->id_item_emprestimo,
            'motivo' => $motivo,
            'valor' => $valor,
            'status' => $status,
        ]);
    }
}
