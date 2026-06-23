<?php

namespace Tests\Feature;

use App\Domain\Usuario\CargoUsuario;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UsuarioTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => 'hellobooks-testing-jwt-secret-32-bytes-minimum']);
    }

    public function test_lista_usuarios_paginada_com_busca_e_sem_senha(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');
        $this->usuario('Ana Leitora', 'ana@hello.local', 'secret123', CargoUsuario::Leitor);
        $this->usuario('Bruno Leitor', 'bruno@hello.local', 'secret123', CargoUsuario::Leitor);

        $this->withToken($this->token($admin->email, 'secret123'))
            ->getJson('/api/v1/usuarios?q=ana&per_page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'ana@hello.local')
            ->assertJsonPath('pagination.total', 1)
            ->assertJsonPath('pagination.per_page', 1)
            ->assertJsonMissingPath('data.0.senha_hash');
    }

    public function test_detalhe_retorna_usuario_sem_senha(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');
        $usuario = $this->usuario('Ana Leitora', 'ana@hello.local', 'secret123', CargoUsuario::Leitor);

        $this->withToken($this->token($admin->email, 'secret123'))
            ->getJson("/api/v1/usuarios/{$usuario->id_usuario}")
            ->assertOk()
            ->assertJsonPath('id_usuario', $usuario->id_usuario)
            ->assertJsonPath('email', 'ana@hello.local')
            ->assertJsonMissingPath('senha_hash');
    }

    public function test_cria_usuario_sem_expor_senha_e_armazena_hash(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');

        $id = $this->withToken($this->token($admin->email, 'secret123'))
            ->postJson('/api/v1/usuarios', [
                'nome_completo' => 'Novo Usuario',
                'email' => 'novo@biblioteca.edu',
                'senha' => 'secret456',
                'cargo' => 'leitor',
                'endereco' => 'Rua Teste, 123',
            ])
            ->assertCreated()
            ->assertJsonPath('email', 'novo@biblioteca.edu')
            ->assertJsonPath('cargo', 'leitor')
            ->assertJsonMissingPath('senha_hash')
            ->json('id_usuario');

        $usuario = Usuario::query()->findOrFail($id);

        $this->assertNotSame('secret456', $usuario->senha_hash);
        $this->assertTrue(Hash::check('secret456', $usuario->senha_hash));
        $this->assertDatabaseHas('logs_atividades', [
            'id_usuario' => $admin->id_usuario,
            'acao_realizada' => 'created',
            'entidade_afetada' => 'usuarios',
            'id_registro_afetado' => (string) $id,
        ]);
    }

    public function test_criacao_rejeita_email_duplicado(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');

        $this->withToken($this->token($admin->email, 'secret123'))
            ->postJson('/api/v1/usuarios', [
                'nome_completo' => 'Duplicado',
                'email' => 'admin@hello.local',
                'senha' => 'secret456',
                'cargo' => 'bibliotecario',
            ])
            ->assertStatus(409)
            ->assertJsonPath('error.code', 'EMAIL_DUPLICADO');
    }

    public function test_atualiza_usuario_incluindo_senha_opcional(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');
        $usuario = $this->usuario('Ana Leitora', 'ana@hello.local', 'secret123', CargoUsuario::Leitor);

        $this->withToken($this->token($admin->email, 'secret123'))
            ->putJson("/api/v1/usuarios/{$usuario->id_usuario}", [
                'nome_completo' => 'Ana Atualizada',
                'email' => 'ana.atualizada@hello.local',
                'senha' => 'novaSenha123',
                'cargo' => 'bibliotecario',
                'endereco' => null,
            ])
            ->assertOk()
            ->assertJsonPath('nome_completo', 'Ana Atualizada')
            ->assertJsonPath('email', 'ana.atualizada@hello.local')
            ->assertJsonPath('cargo', 'bibliotecario')
            ->assertJsonMissingPath('senha_hash');

        $usuario->refresh();

        $this->assertTrue(Hash::check('novaSenha123', $usuario->senha_hash));
    }

    public function test_remove_usuario_e_bloqueia_auto_exclusao(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');
        $usuario = $this->usuario('Ana Leitora', 'ana@hello.local', 'secret123', CargoUsuario::Leitor);
        $token = $this->token($admin->email, 'secret123');

        $this->withToken($token)
            ->deleteJson("/api/v1/usuarios/{$usuario->id_usuario}")
            ->assertNoContent();

        $this->assertDatabaseMissing('usuarios', ['id_usuario' => $usuario->id_usuario]);

        $this->withToken($token)
            ->deleteJson("/api/v1/usuarios/{$admin->id_usuario}")
            ->assertStatus(409)
            ->assertJsonPath('error.code', 'AUTO_EXCLUSAO_PROIBIDA');
    }

    public function test_rotas_de_usuarios_exigem_autenticacao_e_cargo_bibliotecario(): void
    {
        $leitor = $this->usuario('Leitor Teste', 'leitor@hello.local', 'secret123', CargoUsuario::Leitor);

        $this->getJson('/api/v1/usuarios')->assertUnauthorized();

        $this->withToken($this->token($leitor->email, 'secret123'))
            ->getJson('/api/v1/usuarios')
            ->assertForbidden()
            ->assertJsonPath('error.code', 'CARGO_INSUFICIENTE');
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

    private function token(string $email, string $senha): string
    {
        return $this->postJson('/api/v1/auth/login', [
            'email' => $email,
            'senha' => $senha,
        ])->assertOk()->json('token');
    }
}
