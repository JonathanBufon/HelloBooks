<?php

namespace App\Listeners;

use App\Models\LogAtividade;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditarMutacao
{
    public static function created(Model $model): void
    {
        self::registrar($model, 'created');
    }

    public static function updated(Model $model): void
    {
        self::registrar($model, 'updated');
    }

    public static function deleted(Model $model): void
    {
        self::registrar($model, 'deleted');
    }

    private static function registrar(Model $model, string $acao): void
    {
        $idUsuario = Auth::id();

        if ($idUsuario === null) {
            return;
        }

        LogAtividade::query()->create([
            'id_usuario' => $idUsuario,
            'acao_realizada' => $acao,
            'entidade_afetada' => $model->getTable(),
            'id_registro_afetado' => (string) $model->getKey(),
        ]);
    }
}
