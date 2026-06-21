<?php

namespace App\Domain\Multa;

use App\Domain\Exceptions\TransicaoInvalidaException;

class StatusMultaTransition
{
    /**
     * @var array<string, array<int, string>>
     */
    private const VALIDAS = [
        'pendente' => ['paga', 'perdoada'],
        'paga' => [],
        'perdoada' => [],
    ];

    public static function validar(StatusMulta $de, StatusMulta $para): void
    {
        if (! in_array($para->value, self::VALIDAS[$de->value] ?? [], true)) {
            throw new TransicaoInvalidaException(details: [
                'de' => $de->value,
                'para' => $para->value,
            ]);
        }
    }
}
