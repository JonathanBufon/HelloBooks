<?php

namespace Tests\Feature\Catalog;

use App\Domain\Usuario\CargoUsuario;
use App\Models\LogAtividade;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CadastroLivroTest extends TestCase
{
    use RefreshDatabase;

    public function test_bibliotecario_cria_livro_com_entidades_inline(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Bibliotecario), 'api');

        $response = $this->postJson('/api/v1/livros', $this->payloadLivro());

        $response->assertCreated()
            ->assertJsonPath('titulo', 'Dom Casmurro')
            ->assertJsonPath('editora.nome', 'Companhia das Letras')
            ->assertJsonCount(1, 'autores')
            ->assertJsonCount(1, 'categorias');

        $this->assertDatabaseHas('livros', [
            'titulo' => 'Dom Casmurro',
            'isbn' => '9788535910663',
        ]);
        $this->assertDatabaseHas('editoras', ['nome' => 'Companhia das Letras']);
        $this->assertDatabaseHas('autores', ['nome' => 'Machado de Assis']);
        $this->assertDatabaseHas('categorias', ['nome' => 'Romance']);
    }

    public function test_recusa_isbn_duplicado(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Bibliotecario), 'api');

        $this->postJson('/api/v1/livros', $this->payloadLivro())->assertCreated();

        $this->postJson('/api/v1/livros', $this->payloadLivro(['titulo' => 'Outro titulo']))
            ->assertConflict()
            ->assertJsonPath('error.code', 'ISBN_DUPLICADO');
    }

    public function test_recusa_livro_sem_autor(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Bibliotecario), 'api');

        $this->postJson('/api/v1/livros', $this->payloadLivro(['autores' => []]))
            ->assertUnprocessable()
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonValidationErrors(['autores'], 'error.details');
    }

    public function test_recusa_livro_sem_categoria(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Bibliotecario), 'api');

        $this->postJson('/api/v1/livros', $this->payloadLivro(['categorias' => []]))
            ->assertUnprocessable()
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonValidationErrors(['categorias'], 'error.details');
    }

    public function test_recusa_cadastro_para_leitor(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Leitor), 'api');

        $this->postJson('/api/v1/livros', $this->payloadLivro())
            ->assertForbidden()
            ->assertJsonPath('error.code', 'CARGO_INSUFICIENTE');
    }

    public function test_recusa_cadastro_sem_autenticacao(): void
    {
        $this->postJson('/api/v1/livros', $this->payloadLivro())
            ->assertUnauthorized();
    }

    public function test_cadastro_registra_log_de_atividade(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Bibliotecario), 'api');

        $this->postJson('/api/v1/livros', $this->payloadLivro())->assertCreated();

        $this->assertDatabaseHas('logs_atividades', [
            'acao_realizada' => 'created',
            'entidade_afetada' => 'livros',
        ]);
        $this->assertGreaterThanOrEqual(4, LogAtividade::query()->count());
    }

    private function usuario(CargoUsuario $cargo): Usuario
    {
        return Usuario::query()->create([
            'nome_completo' => 'Usuario '.$cargo->value,
            'cargo' => $cargo,
            'email' => $cargo->value.'@hello.local',
            'senha_hash' => 'secret123',
        ]);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payloadLivro(array $overrides = []): array
    {
        return array_replace([
            'titulo' => 'Dom Casmurro',
            'isbn' => '9788535910663',
            'ano_publicacao' => 1899,
            'editora' => ['nome' => 'Companhia das Letras'],
            'autores' => [['nome' => 'Machado de Assis']],
            'categorias' => [['nome' => 'Romance']],
        ], $overrides);
    }
}
