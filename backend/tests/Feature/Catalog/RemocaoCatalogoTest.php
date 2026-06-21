<?php

namespace Tests\Feature\Catalog;

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

class RemocaoCatalogoTest extends TestCase
{
    use RefreshDatabase;

    public function test_bloqueia_remocao_de_entidades_de_apoio_com_livros(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $editora = Editora::query()->create(['nome' => 'Editora Referenciada']);
        $autor = Autor::query()->create(['nome' => 'Autor Referenciado']);
        $categoria = Categoria::query()->create(['nome' => 'Categoria Referenciada']);
        $this->livro($editora, [$autor], [$categoria]);

        $this->deleteJson("/api/v1/editoras/{$editora->id_editora}")
            ->assertConflict()
            ->assertJsonPath('error.code', 'EDITORA_REFERENCIADA')
            ->assertJsonPath('error.details.livros', 1);
        $this->deleteJson("/api/v1/autores/{$autor->id_autor}")
            ->assertConflict()
            ->assertJsonPath('error.code', 'AUTOR_REFERENCIADO')
            ->assertJsonPath('error.details.livros', 1);
        $this->deleteJson("/api/v1/categorias/{$categoria->id_categoria}")
            ->assertConflict()
            ->assertJsonPath('error.code', 'CATEGORIA_REFERENCIADA')
            ->assertJsonPath('error.details.livros', 1);
    }

    public function test_remove_entidades_de_apoio_livres_com_delete_fisico(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $editora = Editora::query()->create(['nome' => 'Editora Livre']);
        $autor = Autor::query()->create(['nome' => 'Autor Livre']);
        $categoria = Categoria::query()->create(['nome' => 'Categoria Livre']);

        $this->deleteJson("/api/v1/editoras/{$editora->id_editora}")->assertNoContent();
        $this->deleteJson("/api/v1/autores/{$autor->id_autor}")->assertNoContent();
        $this->deleteJson("/api/v1/categorias/{$categoria->id_categoria}")->assertNoContent();

        $this->assertDatabaseMissing('editoras', ['id_editora' => $editora->id_editora]);
        $this->assertDatabaseMissing('autores', ['id_autor' => $autor->id_autor]);
        $this->assertDatabaseMissing('categorias', ['id_categoria' => $categoria->id_categoria]);
    }

    public function test_bloqueia_remocao_de_livro_com_exemplares(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $livro = $this->livro();
        Exemplar::query()->create(['id_livro' => $livro->id_livro]);

        $this->deleteJson("/api/v1/livros/{$livro->id_livro}")
            ->assertConflict()
            ->assertJsonPath('error.code', 'LIVRO_COM_EXEMPLARES')
            ->assertJsonPath('error.details.exemplares', 1);
    }

    public function test_remove_livro_sem_exemplares_e_audita_delete(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $livro = $this->livro();

        $this->deleteJson("/api/v1/livros/{$livro->id_livro}")->assertNoContent();

        $this->assertDatabaseMissing('livros', ['id_livro' => $livro->id_livro]);
        $this->assertDatabaseHas('logs_atividades', [
            'acao_realizada' => 'deleted',
            'entidade_afetada' => 'livros',
            'id_registro_afetado' => (string) $livro->id_livro,
        ]);
    }

    public function test_bloqueia_exemplar_emprestado_ou_reservado_e_remove_livre(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $livro = $this->livro();
        $emprestado = Exemplar::query()->create([
            'id_livro' => $livro->id_livro,
            'status' => StatusExemplar::Emprestado,
        ]);
        $reservado = Exemplar::query()->create([
            'id_livro' => $livro->id_livro,
            'status' => StatusExemplar::Reservado,
        ]);
        $disponivel = Exemplar::query()->create(['id_livro' => $livro->id_livro]);

        $this->deleteJson("/api/v1/exemplares/{$emprestado->id_exemplar}")
            ->assertConflict()
            ->assertJsonPath('error.code', 'EXEMPLAR_EM_USO');
        $this->deleteJson("/api/v1/exemplares/{$reservado->id_exemplar}")
            ->assertConflict()
            ->assertJsonPath('error.code', 'EXEMPLAR_EM_USO');

        $this->deleteJson("/api/v1/exemplares/{$disponivel->id_exemplar}")->assertNoContent();

        $this->assertDatabaseMissing('exemplares', ['id_exemplar' => $disponivel->id_exemplar]);
        $this->assertDatabaseHas('logs_atividades', [
            'acao_realizada' => 'deleted',
            'entidade_afetada' => 'exemplares',
            'id_registro_afetado' => (string) $disponivel->id_exemplar,
        ]);
    }

    private function usuario(): Usuario
    {
        return Usuario::query()->create([
            'nome_completo' => 'Bibliotecario',
            'cargo' => CargoUsuario::Bibliotecario,
            'email' => uniqid('biblio').'@hello.local',
            'senha_hash' => 'secret123',
        ]);
    }

    /**
     * @param  array<int, Autor>|null  $autores
     * @param  array<int, Categoria>|null  $categorias
     */
    private function livro(?Editora $editora = null, ?array $autores = null, ?array $categorias = null): Livro
    {
        $editora ??= Editora::query()->create(['nome' => 'Editora A']);
        $autores ??= [Autor::query()->create(['nome' => 'Autor A'])];
        $categorias ??= [Categoria::query()->create(['nome' => 'Romance'])];

        $livro = Livro::query()->create([
            'id_editora' => $editora->id_editora,
            'titulo' => 'Livro '.uniqid(),
            'isbn' => substr(str_pad((string) random_int(1, 9999999999999), 13, '0', STR_PAD_LEFT), 0, 13),
            'ano_publicacao' => 2000,
        ]);
        $livro->autores()->attach(array_map(fn (Autor $autor): int => $autor->id_autor, $autores));
        $livro->categorias()->attach(array_map(fn (Categoria $categoria): int => $categoria->id_categoria, $categorias));

        return $livro;
    }
}
