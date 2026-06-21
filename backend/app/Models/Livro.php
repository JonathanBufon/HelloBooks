<?php

namespace App\Models;

use App\Models\Concerns\AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Livro extends Model
{
    use AuditableTrait;

    protected $table = 'livros';

    protected $primaryKey = 'id_livro';

    protected $fillable = ['id_editora', 'titulo', 'isbn', 'ano_publicacao'];

    /**
     * @return BelongsTo<Editora, Livro>
     */
    public function editora(): BelongsTo
    {
        return $this->belongsTo(Editora::class, 'id_editora', 'id_editora');
    }

    /**
     * @return BelongsToMany<Autor>
     */
    public function autores(): BelongsToMany
    {
        return $this->belongsToMany(Autor::class, 'livros_autores', 'id_livro', 'id_autor');
    }

    /**
     * @return BelongsToMany<Categoria>
     */
    public function categorias(): BelongsToMany
    {
        return $this->belongsToMany(Categoria::class, 'livros_categorias', 'id_livro', 'id_categoria');
    }

    /**
     * @return HasMany<Exemplar>
     */
    public function exemplares(): HasMany
    {
        return $this->hasMany(Exemplar::class, 'id_livro', 'id_livro');
    }

    /**
     * @return HasMany<SolicitacaoEmprestimo>
     */
    public function solicitacoesEmprestimo(): HasMany
    {
        return $this->hasMany(SolicitacaoEmprestimo::class, 'id_livro', 'id_livro');
    }
}
