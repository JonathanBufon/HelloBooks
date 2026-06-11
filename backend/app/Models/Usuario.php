<?php

namespace App\Models;

use App\Domain\Usuario\CargoUsuario;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'nome_completo',
        'endereco',
        'cargo',
        'email',
        'senha_hash',
    ];

    protected $hidden = [
        'senha_hash',
    ];

    public function getAuthPassword(): string
    {
        return $this->senha_hash;
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    /**
     * @return array<string, mixed>
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'cargo' => $this->cargo instanceof CargoUsuario ? $this->cargo->value : $this->cargo,
        ];
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'cargo' => CargoUsuario::class,
            'senha_hash' => 'hashed',
        ];
    }
}
