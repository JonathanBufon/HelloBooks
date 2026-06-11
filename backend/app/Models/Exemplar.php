<?php

namespace App\Models;

use App\Domain\Exemplar\CondicaoFisica;
use App\Domain\Exemplar\StatusExemplar;
use App\Models\Concerns\AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exemplar extends Model
{
    use AuditableTrait;

    protected $table = 'exemplares';

    protected $primaryKey = 'id_exemplar';

    protected $fillable = ['id_livro', 'status', 'condicao_fisica'];

    /**
     * @return BelongsTo<Livro, Exemplar>
     */
    public function livro(): BelongsTo
    {
        return $this->belongsTo(Livro::class, 'id_livro', 'id_livro');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => StatusExemplar::class,
            'condicao_fisica' => CondicaoFisica::class,
        ];
    }
}
