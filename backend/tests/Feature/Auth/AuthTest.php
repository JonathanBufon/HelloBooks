<?php

namespace Tests\Feature\Auth;

use App\Domain\Usuario\CargoUsuario;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => 'hellobooks-testing-jwt-secret-32-bytes-minimum']);
    }

    public function test_login_retorna_token_bearer_para_credenciais_validas(): void
    {
        $usuario = $this->usuario('biblio@hello.local', 'secret123');

        $this->postJson('/api/v1/auth/login', [
            'email' => 'biblio@hello.local',
            'senha' => 'secret123',
        ])
            ->assertOk()
            ->assertJsonPath('token_type', 'bearer')
            ->assertJsonPath('expires_in', 3600)
            ->assertJsonPath('usuario.id_usuario', $usuario->id_usuario)
            ->assertJsonPath('usuario.email', 'biblio@hello.local')
            ->assertJsonPath('usuario.cargo', 'bibliotecario')
            ->assertJsonMissingPath('usuario.senha_hash')
            ->assertJsonStructure(['token', 'token_type', 'expires_in', 'usuario']);
    }

    public function test_login_rejeita_credenciais_invalidas(): void
    {
        $this->usuario('biblio@hello.local', 'secret123');

        $this->postJson('/api/v1/auth/login', [
            'email' => 'biblio@hello.local',
            'senha' => 'senha-errada',
        ])
            ->assertUnauthorized()
            ->assertJsonPath('error.code', 'CREDENCIAIS_INVALIDAS');
    }

    public function test_me_retorna_usuario_autenticado(): void
    {
        $usuario = $this->usuario('biblio@hello.local', 'secret123');
        $token = $this->loginToken('biblio@hello.local', 'secret123');

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('id_usuario', $usuario->id_usuario)
            ->assertJsonPath('email', 'biblio@hello.local')
            ->assertJsonMissingPath('senha_hash');
    }

    public function test_logout_invalida_token(): void
    {
        $this->usuario('biblio@hello.local', 'secret123');
        $token = $this->loginToken('biblio@hello.local', 'secret123');

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout realizado com sucesso.');

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertUnauthorized();
    }

    public function test_refresh_emite_novo_token_e_permite_me(): void
    {
        $usuario = $this->usuario('biblio@hello.local', 'secret123');
        $token = $this->loginToken('biblio@hello.local', 'secret123');

        $novoToken = $this->withToken($token)
            ->postJson('/api/v1/auth/refresh')
            ->assertOk()
            ->assertJsonPath('token_type', 'bearer')
            ->assertJsonPath('usuario.id_usuario', $usuario->id_usuario)
            ->json('token');

        $this->withToken($novoToken)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('id_usuario', $usuario->id_usuario);
    }

    private function usuario(string $email, string $senha, CargoUsuario $cargo = CargoUsuario::Bibliotecario): Usuario
    {
        return Usuario::query()->create([
            'nome_completo' => 'Bibliotecario Teste',
            'cargo' => $cargo,
            'email' => $email,
            'senha_hash' => $senha,
        ]);
    }

    private function loginToken(string $email, string $senha): string
    {
        return $this->postJson('/api/v1/auth/login', [
            'email' => $email,
            'senha' => $senha,
        ])->assertOk()->json('token');
    }
}
