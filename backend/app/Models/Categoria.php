<?php

namespace App\Models;

use App\Models\Concerns\AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Categoria extends Model
{
    use AuditableTrait;

    protected $table = 'categorias';

    protected $primaryKey = 'id_categoria';

    protected $fillable = ['nome'];

    /**
     * @return BelongsToMany<Livro>
     */
    public function livros(): BelongsToMany
    {
        return $this->belongsToMany(Livro::class, 'livros_categorias', 'id_categoria', 'id_livro');
    }
}
