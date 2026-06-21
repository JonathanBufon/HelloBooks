<?php

namespace App\Models;

use App\Models\Concerns\AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Autor extends Model
{
    use AuditableTrait;

    protected $table = 'autores';

    protected $primaryKey = 'id_autor';

    protected $fillable = ['nome'];

    /**
     * @return BelongsToMany<Livro>
     */
    public function livros(): BelongsToMany
    {
        return $this->belongsToMany(Livro::class, 'livros_autores', 'id_autor', 'id_livro');
    }
}
