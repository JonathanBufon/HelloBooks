<?php

namespace App\Domain\Exemplar;

use App\Domain\Exceptions\TransicaoInvalidaException;

class StatusTransition
{
    /**
     * @var array<string, array<int, string>>
     */
    private const VALIDAS = [
        'disponivel' => ['emprestado', 'reservado', 'manutencao'],
        'emprestado' => ['disponivel', 'manutencao'],
        'reservado' => ['disponivel', 'emprestado', 'manutencao'],
        'manutencao' => ['disponivel'],
    ];

    public static function validar(StatusExemplar $de, StatusExemplar $para): void
    {
        if (! in_array($para->value, self::VALIDAS[$de->value] ?? [], true)) {
            throw new TransicaoInvalidaException(details: [
                'de' => $de->value,
                'para' => $para->value,
            ]);
        }
    }

    public static function validarCatalogo(StatusExemplar $de, StatusExemplar $para): void
    {
        self::validar($de, $para);

        $permitida = ($de === StatusExemplar::Disponivel && $para === StatusExemplar::Manutencao)
            || ($de === StatusExemplar::Manutencao && $para === StatusExemplar::Disponivel);

        if (! $permitida) {
            throw new TransicaoInvalidaException(details: [
                'de' => $de->value,
                'para' => $para->value,
                'escopo' => 'catalogo',
            ]);
        }
    }
}
