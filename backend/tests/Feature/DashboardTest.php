<?php

namespace Tests\Feature;

use App\Domain\Usuario\CargoUsuario;
use App\Models\Autor;
use App\Models\Categoria;
use App\Models\Editora;
use App\Models\Exemplar;
use App\Models\Livro;
use App\Models\LogAtividade;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => 'hellobooks-testing-jwt-secret-32-bytes-minimum']);
    }

    public function test_dashboard_retorna_metricas_com_dados_populados(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');
        $editora = Editora::query()->create(['nome' => 'Editora Teste']);
        $autor = Autor::query()->create(['nome' => 'Autora Teste']);
        Categoria::query()->create(['nome' => 'Tecnologia']);

        $livroAntigo = $this->livro($editora, 'Livro Antigo', '9780000000001', now()->subDay());
        $livroRecente = $this->livro($editora, 'Livro Recente', '9780000000002', now());
        $livroRecente->autores()->attach($autor->id_autor);

        Exemplar::query()->create(['id_livro' => $livroRecente->id_livro, 'status' => 'disponivel', 'condicao_fisica' => 'intacto']);
        Exemplar::query()->create(['id_livro' => $livroRecente->id_livro, 'status' => 'emprestado', 'condicao_fisica' => 'intacto']);
        Exemplar::query()->create(['id_livro' => $livroAntigo->id_livro, 'status' => 'manutencao', 'condicao_fisica' => 'rasgado']);

        LogAtividade::query()->create([
            'id_usuario' => $admin->id_usuario,
            'acao_realizada' => 'created',
            'entidade_afetada' => 'livros',
            'id_registro_afetado' => (string) $livroRecente->id_livro,
            'data_hora' => now(),
        ]);

        $this->withToken($this->token($admin->email, 'secret123'))
            ->getJson('/api/v1/dashboard/stats')
            ->assertOk()
            ->assertJsonPath('total_livros', 2)
            ->assertJsonPath('total_exemplares', 3)
            ->assertJsonPath('exemplares_por_status.disponivel', 1)
            ->assertJsonPath('exemplares_por_status.emprestado', 1)
            ->assertJsonPath('exemplares_por_status.reservado', 0)
            ->assertJsonPath('exemplares_por_status.manutencao', 1)
            ->assertJsonPath('total_autores', 1)
            ->assertJsonPath('total_editoras', 1)
            ->assertJsonPath('total_categorias', 1)
            ->assertJsonPath('total_usuarios', 1)
            ->assertJsonPath('livros_recentes.0.titulo', 'Livro Recente')
            ->assertJsonPath('livros_recentes.0.autores.0', 'Autora Teste')
            ->assertJsonPath('atividade_recente.0.entidade_afetada', 'livros')
            ->assertJsonPath('atividade_recente.0.usuario.nome_completo', 'Admin Teste');
    }

    public function test_dashboard_retorna_zeros_arrays_vazios_e_exige_bibliotecario(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');
        $leitor = $this->usuario('Leitor Teste', 'leitor@hello.local', 'secret123', CargoUsuario::Leitor);

        $this->getJson('/api/v1/dashboard/stats')->assertUnauthorized();

        $this->withToken($this->token($leitor->email, 'secret123'))
            ->getJson('/api/v1/dashboard/stats')
            ->assertForbidden()
            ->assertJsonPath('error.code', 'CARGO_INSUFICIENTE');

        $this->withToken($this->token($admin->email, 'secret123'))
            ->getJson('/api/v1/dashboard/stats')
            ->assertOk()
            ->assertJsonPath('total_livros', 0)
            ->assertJsonPath('total_exemplares', 0)
            ->assertJsonPath('exemplares_por_status.disponivel', 0)
            ->assertJsonPath('exemplares_por_status.emprestado', 0)
            ->assertJsonPath('exemplares_por_status.reservado', 0)
            ->assertJsonPath('exemplares_por_status.manutencao', 0)
            ->assertJsonPath('total_autores', 0)
            ->assertJsonPath('total_editoras', 0)
            ->assertJsonPath('total_categorias', 0)
            ->assertJsonCount(0, 'livros_recentes')
            ->assertJsonCount(0, 'atividade_recente');
    }

    private function usuario(string $nome, string $email, string $senha, CargoUsuario $cargo = CargoUsuario::Bibliotecario): Usuario
    {
        return Usuario::query()->create([
            'nome_completo' => $nome,
            'cargo' => $cargo,
            'email' => $email,
            'senha_hash' => $senha,
        ]);
    }

    private function livro(Editora $editora, string $titulo, string $isbn, mixed $createdAt): Livro
    {
        return Livro::query()->create([
            'id_editora' => $editora->id_editora,
            'titulo' => $titulo,
            'isbn' => $isbn,
            'ano_publicacao' => 2024,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);
    }

    private function token(string $email, string $senha): string
    {
        return $this->postJson('/api/v1/auth/login', [
            'email' => $email,
            'senha' => $senha,
        ])->assertOk()->json('token');
    }
}
