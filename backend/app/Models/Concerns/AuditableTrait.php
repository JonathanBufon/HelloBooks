<?php

namespace App\Models\Concerns;

use App\Listeners\AuditarMutacao;

trait AuditableTrait
{
    protected static function bootAuditableTrait(): void
    {
        static::created([AuditarMutacao::class, 'created']);
        static::updated([AuditarMutacao::class, 'updated']);
        static::deleted([AuditarMutacao::class, 'deleted']);
    }
}
