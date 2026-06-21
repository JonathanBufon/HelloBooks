<?php

namespace Tests\Feature;

use App\Domain\Usuario\CargoUsuario;
use App\Models\LogAtividade;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['jwt.secret' => 'hellobooks-testing-jwt-secret-32-bytes-minimum']);
    }

    public function test_lista_logs_com_usuario_executor_e_ordenacao_descendente(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');

        $antigo = $this->log($admin, 'created', 'livros', '10', '2026-06-01 10:00:00');
        $recente = $this->log($admin, 'updated', 'usuarios', '20', '2026-06-02 10:00:00');

        $this->withToken($this->token($admin->email, 'secret123'))
            ->getJson('/api/v1/logs')
            ->assertOk()
            ->assertJsonPath('data.0.id_log', $recente->id_log)
            ->assertJsonPath('data.0.usuario.nome_completo', 'Admin Teste')
            ->assertJsonPath('data.1.id_log', $antigo->id_log)
            ->assertJsonPath('pagination.total', 2);
    }

    public function test_filtra_logs_pagina_e_restringe_acesso(): void
    {
        $admin = $this->usuario('Admin Teste', 'admin@hello.local', 'secret123');
        $outro = $this->usuario('Outro Biblio', 'outro@hello.local', 'secret123');
        $leitor = $this->usuario('Leitor Teste', 'leitor@hello.local', 'secret123', CargoUsuario::Leitor);

        $this->log($admin, 'created', 'livros', '10', '2026-06-01 10:00:00');
        $esperado = $this->log($outro, 'updated', 'livros', '11', '2026-06-10 10:00:00');
        $this->log($outro, 'deleted', 'usuarios', '12', '2026-06-20 10:00:00');

        $this->getJson('/api/v1/logs')->assertUnauthorized();

        $this->withToken($this->token($leitor->email, 'secret123'))
            ->getJson('/api/v1/logs')
            ->assertForbidden()
            ->assertJsonPath('error.code', 'CARGO_INSUFICIENTE');

        $this->withToken($this->token($admin->email, 'secret123'))
            ->getJson("/api/v1/logs?entidade=livros&acao=updated&id_usuario={$outro->id_usuario}&de=2026-06-05&ate=2026-06-15&per_page=1")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id_log', $esperado->id_log)
            ->assertJsonPath('data.0.entidade_afetada', 'livros')
            ->assertJsonPath('data.0.acao_realizada', 'updated')
            ->assertJsonPath('data.0.usuario.id_usuario', $outro->id_usuario)
            ->assertJsonPath('pagination.total', 1)
            ->assertJsonPath('pagination.per_page', 1);
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

    private function log(Usuario $usuario, string $acao, string $entidade, string $registro, string $dataHora): LogAtividade
    {
        return LogAtividade::query()->create([
            'id_usuario' => $usuario->id_usuario,
            'acao_realizada' => $acao,
            'entidade_afetada' => $entidade,
            'id_registro_afetado' => $registro,
            'data_hora' => $dataHora,
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
