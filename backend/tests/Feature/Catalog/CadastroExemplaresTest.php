<?php

namespace Tests\Feature\Catalog;

use App\Domain\Usuario\CargoUsuario;
use App\Models\Editora;
use App\Models\Livro;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CadastroExemplaresTest extends TestCase
{
    use RefreshDatabase;

    public function test_bibliotecario_cria_exemplares_em_lote_com_defaults(): void
    {
        $this->actingAs($this->usuario(), 'api');
        $livro = $this->livro();

        $response = $this->postJson("/api/v1/livros/{$livro->id_livro}/exemplares", [
            'quantidade' => 3,
        ]);

        $response->assertCreated()
            ->assertJsonCount(3)
            ->assertJsonPath('0.status', 'disponivel')
            ->assertJsonPath('0.condicao_fisica', 'intacto');

        $this->assertDatabaseCount('exemplares', 3);
        $this->assertDatabaseHas('exemplares', [
            'id_livro' => $livro->id_livro,
            'status' => 'disponivel',
            'condicao_fisica' => 'intacto',
        ]);
    }

    public function test_recusa_criacao_para_livro_inexistente(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $this->postJson('/api/v1/livros/999/exemplares', ['quantidade' => 1])
            ->assertNotFound();
    }

    public function test_recusa_quantidade_zero(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $this->postJson("/api/v1/livros/{$this->livro()->id_livro}/exemplares", ['quantidade' => 0])
            ->assertUnprocessable()
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonValidationErrors(['quantidade'], 'error.details');
    }

    public function test_recusa_quantidade_negativa(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $this->postJson("/api/v1/livros/{$this->livro()->id_livro}/exemplares", ['quantidade' => -1])
            ->assertUnprocessable()
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonValidationErrors(['quantidade'], 'error.details');
    }

    public function test_recusa_quantidade_maior_que_mil(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $this->postJson("/api/v1/livros/{$this->livro()->id_livro}/exemplares", ['quantidade' => 1001])
            ->assertUnprocessable()
            ->assertJsonPath('error.code', 'VALIDATION_ERROR')
            ->assertJsonValidationErrors(['quantidade'], 'error.details');
    }

    private function usuario(): Usuario
    {
        return Usuario::query()->create([
            'nome_completo' => 'Bibliotecario Teste',
            'cargo' => CargoUsuario::Bibliotecario,
            'email' => 'biblio'.uniqid().'@hello.local',
            'senha_hash' => 'secret123',
        ]);
    }

    private function livro(): Livro
    {
        $editora = Editora::query()->create(['nome' => 'Companhia das Letras']);

        return Livro::query()->create([
            'id_editora' => $editora->id_editora,
            'titulo' => 'Dom Casmurro',
            'isbn' => str_pad((string) random_int(1, 9999999999999), 13, '0', STR_PAD_LEFT),
            'ano_publicacao' => 1899,
        ]);
    }
}
