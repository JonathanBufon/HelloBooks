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

class MultaControllerTest extends TestCase
{
    use RefreshDatabase;

    private Usuario $bibliotecario;

    private Usuario $leitor;

    private ItemEmprestimo $item;

    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => 'hellobooks-testing-jwt-secret-32-bytes-minimum']);

        $this->bibliotecario = $this->usuario('Bib Teste', 'bib@hello.local', 'secret123', CargoUsuario::Bibliotecario);
        $this->leitor = $this->usuario('Leitor Teste', 'leitor@hello.local', 'secret123', CargoUsuario::Leitor);
        $this->item = $this->criarItemEmprestimo($this->leitor);
    }

    // --- STORE ---

    public function test_store_cria_multa_com_status_pendente(): void
    {
        $this->withToken($this->tokenBib())
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $this->item->id_item_emprestimo,
                'motivo' => 'atraso',
                'valor' => 25.50,
            ])
            ->assertStatus(201)
            ->assertJsonPath('status', 'pendente')
            ->assertJsonPath('motivo', 'atraso')
            ->assertJsonPath('valor', '25.50');

        $this->assertDatabaseHas('multas', [
            'id_item_emprestimo' => $this->item->id_item_emprestimo,
            'motivo' => 'atraso',
            'status' => 'pendente',
        ]);
    }

    public function test_store_rejeita_duplicata_item_motivo(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso);

        $this->withToken($this->tokenBib())
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $this->item->id_item_emprestimo,
                'motivo' => 'atraso',
                'valor' => 10.00,
            ])
            ->assertStatus(409)
            ->assertJsonPath('error.code', 'MULTA_DUPLICADA');
    }

    public function test_store_permite_mesmo_item_motivo_diferente(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso);

        $this->withToken($this->tokenBib())
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $this->item->id_item_emprestimo,
                'motivo' => 'rabisco',
                'valor' => 15.00,
            ])
            ->assertStatus(201)
            ->assertJsonPath('motivo', 'rabisco');
    }

    public function test_store_valida_campos_obrigatorios(): void
    {
        $this->withToken($this->tokenBib())
            ->postJson('/api/v1/multas', [])
            ->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonStructure(['error' => ['details' => ['id_item_emprestimo', 'motivo', 'valor']]]);
    }

    public function test_store_rejeita_valor_zero_ou_negativo(): void
    {
        $this->withToken($this->tokenBib())
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $this->item->id_item_emprestimo,
                'motivo' => 'atraso',
                'valor' => 0,
            ])
            ->assertStatus(422)
            ->assertJsonStructure(['error' => ['details' => ['valor']]]);

        $this->withToken($this->tokenBib())
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $this->item->id_item_emprestimo,
                'motivo' => 'atraso',
                'valor' => -5,
            ])
            ->assertStatus(422)
            ->assertJsonStructure(['error' => ['details' => ['valor']]]);
    }

    public function test_store_rejeita_motivo_invalido(): void
    {
        $this->withToken($this->tokenBib())
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $this->item->id_item_emprestimo,
                'motivo' => 'inexistente',
                'valor' => 10,
            ])
            ->assertStatus(422)
            ->assertJsonStructure(['error' => ['details' => ['motivo']]]);
    }

    public function test_store_rejeita_item_emprestimo_inexistente(): void
    {
        $this->withToken($this->tokenBib())
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => 99999,
                'motivo' => 'atraso',
                'valor' => 10,
            ])
            ->assertStatus(422)
            ->assertJsonStructure(['error' => ['details' => ['id_item_emprestimo']]]);
    }

    // --- PAGAR ---

    public function test_pagar_multa_pendente(): void
    {
        $multa = $this->criarMulta($this->item, MotivoMulta::Atraso);

        $this->withToken($this->tokenBib())
            ->putJson("/api/v1/multas/{$multa->id_multa}/pagar")
            ->assertOk()
            ->assertJsonPath('status', 'paga')
            ->assertJsonPath('data_baixa', fn ($v) => $v !== null);

        $multa->refresh();
        $this->assertSame(StatusMulta::Paga, $multa->status);
        $this->assertSame($this->bibliotecario->id_usuario, $multa->id_bibliotecario_baixa);
    }

    public function test_pagar_multa_ja_paga_retorna_409(): void
    {
        $multa = $this->criarMulta($this->item, MotivoMulta::Atraso, StatusMulta::Paga);

        $this->withToken($this->tokenBib())
            ->putJson("/api/v1/multas/{$multa->id_multa}/pagar")
            ->assertStatus(409)
            ->assertJsonPath('error.code', 'TRANSICAO_INVALIDA');
    }

    public function test_pagar_multa_perdoada_retorna_409(): void
    {
        $multa = $this->criarMulta($this->item, MotivoMulta::Atraso, StatusMulta::Perdoada);

        $this->withToken($this->tokenBib())
            ->putJson("/api/v1/multas/{$multa->id_multa}/pagar")
            ->assertStatus(409)
            ->assertJsonPath('error.code', 'TRANSICAO_INVALIDA');
    }

    public function test_pagar_multa_inexistente_retorna_404(): void
    {
        $this->withToken($this->tokenBib())
            ->putJson('/api/v1/multas/99999/pagar')
            ->assertNotFound();
    }

    // --- PAGAR LOTE ---

    public function test_pagar_lote_paga_todas_pendentes_do_usuario(): void
    {
        $item2 = $this->criarItemEmprestimo($this->leitor);
        $this->criarMulta($this->item, MotivoMulta::Atraso);
        $this->criarMulta($item2, MotivoMulta::Rabisco);
        $this->criarMulta($this->item, MotivoMulta::Rasgo, StatusMulta::Paga);

        $response = $this->withToken($this->tokenBib())
            ->putJson('/api/v1/multas/pagar-lote', [
                'id_usuario' => $this->leitor->id_usuario,
            ])
            ->assertOk();

        $pagas = $response->json();
        $this->assertCount(2, $pagas);
        foreach ($pagas as $multa) {
            $this->assertSame('paga', $multa['status']);
        }

        $this->assertDatabaseCount('multas', 3);
        $this->assertDatabaseMissing('multas', ['status' => 'pendente']);
    }

    public function test_pagar_lote_sem_pendentes_retorna_array_vazio(): void
    {
        $this->withToken($this->tokenBib())
            ->putJson('/api/v1/multas/pagar-lote', [
                'id_usuario' => $this->leitor->id_usuario,
            ])
            ->assertOk()
            ->assertJson([]);
    }

    public function test_pagar_lote_valida_id_usuario(): void
    {
        $this->withToken($this->tokenBib())
            ->putJson('/api/v1/multas/pagar-lote', [])
            ->assertStatus(422)
            ->assertJsonStructure(['error' => ['details' => ['id_usuario']]]);
    }

    // --- PERDOAR ---

    public function test_perdoar_multa_pendente_com_justificativa(): void
    {
        $multa = $this->criarMulta($this->item, MotivoMulta::Atraso);

        $this->withToken($this->tokenBib())
            ->putJson("/api/v1/multas/{$multa->id_multa}/perdoar", [
                'justificativa' => 'Primeiro incidente do leitor',
            ])
            ->assertOk()
            ->assertJsonPath('status', 'perdoada');

        $multa->refresh();
        $this->assertSame(StatusMulta::Perdoada, $multa->status);
        $this->assertSame('Primeiro incidente do leitor', $multa->justificativa_perdao);
        $this->assertSame($this->bibliotecario->id_usuario, $multa->id_bibliotecario_baixa);
    }

    public function test_perdoar_sem_justificativa_retorna_422(): void
    {
        $multa = $this->criarMulta($this->item, MotivoMulta::Atraso);

        $this->withToken($this->tokenBib())
            ->putJson("/api/v1/multas/{$multa->id_multa}/perdoar", [])
            ->assertStatus(422)
            ->assertJsonStructure(['error' => ['details' => ['justificativa']]]);
    }

    public function test_perdoar_multa_ja_paga_retorna_409(): void
    {
        $multa = $this->criarMulta($this->item, MotivoMulta::Atraso, StatusMulta::Paga);

        $this->withToken($this->tokenBib())
            ->putJson("/api/v1/multas/{$multa->id_multa}/perdoar", [
                'justificativa' => 'Tentativa invalida',
            ])
            ->assertStatus(409)
            ->assertJsonPath('error.code', 'TRANSICAO_INVALIDA');
    }

    // --- INDEX ---

    public function test_index_retorna_lista_paginada(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso);
        $this->criarMulta($this->item, MotivoMulta::Rabisco);

        $this->withToken($this->tokenBib())
            ->getJson('/api/v1/multas')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure([
                'data' => [['id_multa', 'motivo', 'valor', 'status', 'usuario', 'livro']],
                'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
            ]);
    }

    public function test_index_filtra_por_status(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso);
        $this->criarMulta($this->item, MotivoMulta::Rabisco, StatusMulta::Paga);

        $this->withToken($this->tokenBib())
            ->getJson('/api/v1/multas?status=pendente')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'pendente');
    }

    public function test_index_filtra_por_motivo(): void
    {
        $this->criarMulta($this->item, MotivoMulta::Atraso);
        $this->criarMulta($this->item, MotivoMulta::Dobra);

        $this->withToken($this->tokenBib())
            ->getJson('/api/v1/multas?motivo=dobra')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.motivo', 'dobra');
    }

    public function test_index_filtra_por_usuario(): void
    {
        $outroLeitor = $this->usuario('Outro', 'outro@hello.local', 'secret123', CargoUsuario::Leitor);
        $outroItem = $this->criarItemEmprestimo($outroLeitor);
        $this->criarMulta($this->item, MotivoMulta::Atraso);
        $this->criarMulta($outroItem, MotivoMulta::Atraso);

        $this->withToken($this->tokenBib())
            ->getJson("/api/v1/multas?id_usuario={$this->leitor->id_usuario}")
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    // --- SHOW ---

    public function test_show_retorna_detalhe_com_relacionamentos(): void
    {
        $multa = $this->criarMulta($this->item, MotivoMulta::Atraso);

        $this->withToken($this->tokenBib())
            ->getJson("/api/v1/multas/{$multa->id_multa}")
            ->assertOk()
            ->assertJsonPath('id_multa', $multa->id_multa)
            ->assertJsonStructure([
                'id_multa', 'motivo', 'valor', 'status',
                'usuario', 'livro', 'exemplar',
                'justificativa_perdao', 'bibliotecario_baixa', 'item_emprestimo',
            ]);
    }

    public function test_show_multa_inexistente_retorna_404(): void
    {
        $this->withToken($this->tokenBib())
            ->getJson('/api/v1/multas/99999')
            ->assertNotFound();
    }

    // --- AUTHORIZATION ---

    public function test_rotas_exigem_autenticacao(): void
    {
        $this->withHeaders(['Authorization' => ''])
            ->getJson('/api/v1/multas')
            ->assertUnauthorized();

        $this->withHeaders(['Authorization' => ''])
            ->postJson('/api/v1/multas')
            ->assertUnauthorized();

        $this->withHeaders(['Authorization' => ''])
            ->putJson('/api/v1/multas/1/pagar')
            ->assertUnauthorized();

        $this->withHeaders(['Authorization' => ''])
            ->putJson('/api/v1/multas/pagar-lote')
            ->assertUnauthorized();

        $this->withHeaders(['Authorization' => ''])
            ->putJson('/api/v1/multas/1/perdoar')
            ->assertUnauthorized();

        $this->withHeaders(['Authorization' => ''])
            ->getJson('/api/v1/multas/1')
            ->assertUnauthorized();
    }

    public function test_leitor_nao_acessa_rotas_de_multas(): void
    {
        $tokenLeitor = $this->token('leitor@hello.local', 'secret123');

        $this->withToken($tokenLeitor)
            ->getJson('/api/v1/multas')
            ->assertForbidden()
            ->assertJsonPath('error.code', 'CARGO_INSUFICIENTE');

        $this->withToken($tokenLeitor)
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $this->item->id_item_emprestimo,
                'motivo' => 'atraso',
                'valor' => 10,
            ])
            ->assertForbidden();
    }

    public function test_quickstart_fluxo_completo_multas(): void
    {
        $tokenBib = $this->tokenBib();
        $itemPagamentoLote = $this->criarItemEmprestimo($this->leitor);
        $itemPerdao = $this->criarItemEmprestimo($this->leitor);

        $multaPagar = $this->withToken($tokenBib)
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $this->item->id_item_emprestimo,
                'motivo' => 'atraso',
                'valor' => 5.50,
            ])
            ->assertStatus(201)
            ->assertJsonPath('status', 'pendente')
            ->json('id_multa');

        $this->withToken($tokenBib)
            ->getJson('/api/v1/multas?status=pendente')
            ->assertOk()
            ->assertJsonFragment(['id_multa' => $multaPagar]);

        $this->withToken($tokenBib)
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $itemPagamentoLote->id_item_emprestimo,
                'motivo' => 'rabisco',
                'valor' => 10.00,
            ])
            ->assertStatus(201);

        $this->withToken($tokenBib)
            ->putJson("/api/v1/multas/{$multaPagar}/pagar")
            ->assertOk()
            ->assertJsonPath('status', 'paga');

        $this->withToken($tokenBib)
            ->putJson('/api/v1/multas/pagar-lote', [
                'id_usuario' => $this->leitor->id_usuario,
            ])
            ->assertOk()
            ->assertJsonCount(1);

        $multaPerdoar = $this->withToken($tokenBib)
            ->postJson('/api/v1/multas', [
                'id_item_emprestimo' => $itemPerdao->id_item_emprestimo,
                'motivo' => 'dobra',
                'valor' => 15.00,
            ])
            ->assertStatus(201)
            ->json('id_multa');

        $this->withToken($tokenBib)
            ->putJson("/api/v1/multas/{$multaPerdoar}/perdoar", [
                'justificativa' => 'Isencao por primeiro incidente do leitor',
            ])
            ->assertOk()
            ->assertJsonPath('status', 'perdoada');

        $tokenLeitor = $this->token('leitor@hello.local', 'secret123');

        $this->withToken($tokenLeitor)
            ->getJson('/api/v1/minhas-multas/resumo')
            ->assertOk()
            ->assertJsonPath('quantidade_pendente', 0)
            ->assertJsonPath('valor_total_pendente', '0.00');

        $response = $this->withToken($tokenLeitor)
            ->getJson('/api/v1/minhas-multas')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $this->assertEqualsCanonicalizing(
            ['paga', 'paga', 'perdoada'],
            collect($response->json('data'))->pluck('status')->all(),
        );
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

    private function tokenBib(): string
    {
        return $this->token('bib@hello.local', 'secret123');
    }

    private function token(string $email, string $senha): string
    {
        return $this->postJson('/api/v1/auth/login', [
            'email' => $email,
            'senha' => $senha,
        ])->assertOk()->json('token');
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
        StatusMulta $status = StatusMulta::Pendente,
    ): Multa {
        return Multa::query()->create([
            'id_item_emprestimo' => $item->id_item_emprestimo,
            'motivo' => $motivo,
            'valor' => 10.00,
            'status' => $status,
        ]);
    }
}
