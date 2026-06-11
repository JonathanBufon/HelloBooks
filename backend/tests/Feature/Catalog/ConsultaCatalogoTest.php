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

class ConsultaCatalogoTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_livros_paginada_com_vinte_por_pagina(): void
    {
        $this->actingAs($this->usuario(), 'api');

        for ($i = 1; $i <= 25; $i++) {
            $this->livro('Livro '.$i, str_pad((string) $i, 13, '0', STR_PAD_LEFT));
        }

        $this->getJson('/api/v1/livros')
            ->assertOk()
            ->assertJsonCount(20, 'data')
            ->assertJsonPath('pagination.total', 25)
            ->assertJsonPath('pagination.per_page', 20)
            ->assertJsonPath('pagination.current_page', 1)
            ->assertJsonPath('pagination.last_page', 2);
    }

    public function test_busca_por_titulo_isbn_autor_e_categoria(): void
    {
        $this->actingAs($this->usuario(), 'api');

        $this->livro('Dom Casmúrro', '9788535910663', 'Machado de Assis', 'Romance');
        $this->livro('O Cortico', '9788500000001', 'Aluisio Azevedo', 'Naturalismo');

        $this->getJson('/api/v1/livros?q=casmurro')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.titulo', 'Dom Casmúrro');

        $this->getJson('/api/v1/livros?q=9788535910663')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.titulo', 'Dom Casmúrro');

        $this->getJson('/api/v1/livros?q=machado')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.titulo', 'Dom Casmúrro');

        $this->getJson('/api/v1/livros?q=romance')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.titulo', 'Dom Casmúrro');
    }

    public function test_detalhe_retorna_contagem_de_exemplares_por_status(): void
    {
        $this->actingAs($this->usuario(), 'api');
        $livro = $this->livro('Dom Casmurro', '9788535910663');

        $this->exemplar($livro, StatusExemplar::Disponivel);
        $this->exemplar($livro, StatusExemplar::Disponivel);
        $this->exemplar($livro, StatusExemplar::Disponivel);
        $this->exemplar($livro, StatusExemplar::Emprestado);
        $this->exemplar($livro, StatusExemplar::Manutencao, CondicaoFisica::Rasgado);

        $this->getJson("/api/v1/livros/{$livro->id_livro}")
            ->assertOk()
            ->assertJsonPath('id_livro', $livro->id_livro)
            ->assertJsonCount(5, 'exemplares')
            ->assertJsonPath('contagem_exemplares.disponivel', 3)
            ->assertJsonPath('contagem_exemplares.emprestado', 1)
            ->assertJsonPath('contagem_exemplares.reservado', 0)
            ->assertJsonPath('contagem_exemplares.manutencao', 1);
    }

    public function test_busca_sem_resultado_retorna_pagina_vazia(): void
    {
        $this->actingAs($this->usuario(), 'api');
        $this->livro('Dom Casmurro', '9788535910663');

        $this->getJson('/api/v1/livros?q=inexistente')
            ->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJsonPath('pagination.total', 0);
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

    private function livro(string $titulo, string $isbn, string $autorNome = 'Autor Teste', string $categoriaNome = 'Categoria Teste'): Livro
    {
        $editora = Editora::query()->firstOrCreate(['nome' => 'Editora Teste']);
        $autor = Autor::query()->firstOrCreate(['nome' => $autorNome]);
        $categoria = Categoria::query()->firstOrCreate(['nome' => $categoriaNome]);

        $livro = Livro::query()->create([
            'id_editora' => $editora->id_editora,
            'titulo' => $titulo,
            'isbn' => $isbn,
            'ano_publicacao' => 1899,
        ]);

        $livro->autores()->attach($autor->id_autor);
        $livro->categorias()->attach($categoria->id_categoria);

        return $livro;
    }

    private function exemplar(Livro $livro, StatusExemplar $status, CondicaoFisica $condicao = CondicaoFisica::Intacto): void
    {
        Exemplar::query()->create([
            'id_livro' => $livro->id_livro,
            'status' => $status,
            'condicao_fisica' => $condicao,
        ]);
    }
}
