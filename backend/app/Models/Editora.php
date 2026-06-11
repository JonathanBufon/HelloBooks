<?php

namespace App\Models;

use App\Models\Concerns\AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Editora extends Model
{
    use AuditableTrait;

    protected $table = 'editoras';

    protected $primaryKey = 'id_editora';

    protected $fillable = ['nome'];

    /**
     * @return HasMany<Livro>
     */
    public function livros(): HasMany
    {
        return $this->hasMany(Livro::class, 'id_editora', 'id_editora');
    }
}
