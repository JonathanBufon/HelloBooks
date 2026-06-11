<?php

namespace Tests\Feature\Catalog;

use App\Domain\Exemplar\CondicaoFisica;
use App\Domain\Exemplar\StatusExemplar;
use App\Domain\Usuario\CargoUsuario;
use App\Models\Autor;
use App\Models\Categoria;
use App\Models\Editora;
use App\Models\Exemplar;
use App\Models\Livro;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EdicaoCatalogoTest extends TestCase
{
    use RefreshDatabase;

    public function test_edicao_de_livro_mantem_associacoes_e_preserva_autor_antigo(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Bibliotecario), 'api');

        $editora = Editora::query()->create(['nome' => 'Editora A']);
        $autorAntigo = Autor::query()->create(['nome' => 'Autor Antigo']);
        $autorNovo = Autor::query()->create(['nome' => 'Autor Novo']);
        $categoria = Categoria::query()->create(['nome' => 'Romance']);
        $livro = $this->livro($editora, 'Titulo antigo', '9788535910663', [$autorAntigo], [$categoria]);

        $this->putJson("/api/v1/livros/{$livro->id_livro}", [
            'titulo' => 'Titulo corrigido',
            'autores' => [['id_autor' => $autorNovo->id_autor]],
            'categorias' => [['id_categoria' => $categoria->id_categoria]],
        ])->assertOk()
            ->assertJsonPath('titulo', 'Titulo corrigido')
            ->assertJsonPath('autores.0.id_autor', $autorNovo->id_autor);

        $this->assertDatabaseHas('autores', ['id_autor' => $autorAntigo->id_autor]);
        $this->assertDatabaseHas('livros_autores', [
            'id_livro' => $livro->id_livro,
            'id_autor' => $autorNovo->id_autor,
        ]);
        $this->assertDatabaseMissing('livros_autores', [
            'id_livro' => $livro->id_livro,
            'id_autor' => $autorAntigo->id_autor,
        ]);
    }

    public function test_edicao_de_isbn_respeita_unicidade(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Bibliotecario), 'api');

        $editora = Editora::query()->create(['nome' => 'Editora A']);
        $autor = Autor::query()->create(['nome' => 'Autor']);
        $categoria = Categoria::query()->create(['nome' => 'Romance']);
        $livro = $this->livro($editora, 'Livro A', '9788535910663', [$autor], [$categoria]);
        $this->livro($editora, 'Livro B', '9788500000001', [$autor], [$categoria]);

        $this->putJson("/api/v1/livros/{$livro->id_livro}", ['isbn' => '9788500000001'])
            ->assertConflict()
            ->assertJsonPath('error.code', 'ISBN_DUPLICADO');
    }

    public function test_edicao_de_exemplar_para_manutencao_audita(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Bibliotecario), 'api');

        $editora = Editora::query()->create(['nome' => 'Editora A']);
        $autor = Autor::query()->create(['nome' => 'Autor']);
        $categoria = Categoria::query()->create(['nome' => 'Romance']);
        $livro = $this->livro($editora, 'Livro A', '9788535910663', [$autor], [$categoria]);
        $exemplar = Exemplar::query()->create(['id_livro' => $livro->id_livro]);

        $this->putJson("/api/v1/exemplares/{$exemplar->id_exemplar}", [
            'status' => StatusExemplar::Manutencao->value,
            'condicao_fisica' => CondicaoFisica::Rasgado->value,
        ])->assertOk()
            ->assertJsonPath('status', 'manutencao')
            ->assertJsonPath('condicao_fisica', 'rasgado');

        $this->assertDatabaseHas('logs_atividades', [
            'acao_realizada' => 'updated',
            'entidade_afetada' => 'exemplares',
            'id_registro_afetado' => (string) $exemplar->id_exemplar,
        ]);
    }

    public function test_edicao_por_leitor_e_negada(): void
    {
        $this->actingAs($this->usuario(CargoUsuario::Leitor), 'api');

        $this->putJson('/api/v1/livros/1', ['titulo' => 'Negado'])
            ->assertForbidden()
            ->assertJsonPath('error.code', 'CARGO_INSUFICIENTE');
    }

    private function usuario(CargoUsuario $cargo): Usuario
    {
        return Usuario::query()->create([
            'nome_completo' => 'Usuario '.$cargo->value,
            'cargo' => $cargo,
            'email' => $cargo->value.uniqid().'@hello.local',
            'senha_hash' => 'secret123',
        ]);
    }

    /**
     * @param  array<int, Autor>  $autores
     * @param  array<int, Categoria>  $categorias
     */
    private function livro(Editora $editora, string $titulo, string $isbn, array $autores, array $categorias): Livro
    {
        $livro = Livro::query()->create([
            'id_editora' => $editora->id_editora,
            'titulo' => $titulo,
            'isbn' => $isbn,
            'ano_publicacao' => 2000,
        ]);
        $livro->autores()->attach(array_map(fn (Autor $autor): int => $autor->id_autor, $autores));
        $livro->categorias()->attach(array_map(fn (Categoria $categoria): int => $categoria->id_categoria, $categorias));

        return $livro;
    }
}
