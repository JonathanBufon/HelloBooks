<?php

namespace Tests\Unit\Catalog;

use App\Domain\Exceptions\TransicaoInvalidaException;
use App\Domain\Exemplar\StatusExemplar;
use App\Domain\Exemplar\StatusTransition;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class StatusTransitionTest extends TestCase
{
    #[DataProvider('transicoesValidas')]
    public function test_transicoes_validas(StatusExemplar $de, StatusExemplar $para): void
    {
        StatusTransition::validar($de, $para);

        $this->addToAssertionCount(1);
    }

    #[DataProvider('transicoesInvalidas')]
    public function test_transicoes_invalidas(StatusExemplar $de, StatusExemplar $para): void
    {
        $this->expectException(TransicaoInvalidaException::class);

        StatusTransition::validar($de, $para);
    }

    /**
     * @return array<string, array{StatusExemplar, StatusExemplar}>
     */
    public static function transicoesValidas(): array
    {
        return [
            'disponivel-emprestado' => [StatusExemplar::Disponivel, StatusExemplar::Emprestado],
            'disponivel-reservado' => [StatusExemplar::Disponivel, StatusExemplar::Reservado],
            'disponivel-manutencao' => [StatusExemplar::Disponivel, StatusExemplar::Manutencao],
            'emprestado-disponivel' => [StatusExemplar::Emprestado, StatusExemplar::Disponivel],
            'emprestado-manutencao' => [StatusExemplar::Emprestado, StatusExemplar::Manutencao],
            'reservado-disponivel' => [StatusExemplar::Reservado, StatusExemplar::Disponivel],
            'reservado-emprestado' => [StatusExemplar::Reservado, StatusExemplar::Emprestado],
            'reservado-manutencao' => [StatusExemplar::Reservado, StatusExemplar::Manutencao],
            'manutencao-disponivel' => [StatusExemplar::Manutencao, StatusExemplar::Disponivel],
        ];
    }

    /**
     * @return array<string, array{StatusExemplar, StatusExemplar}>
     */
    public static function transicoesInvalidas(): array
    {
        return [
            'emprestado-reservado' => [StatusExemplar::Emprestado, StatusExemplar::Reservado],
            'reservado-reservado' => [StatusExemplar::Reservado, StatusExemplar::Reservado],
            'manutencao-emprestado' => [StatusExemplar::Manutencao, StatusExemplar::Emprestado],
            'manutencao-reservado' => [StatusExemplar::Manutencao, StatusExemplar::Reservado],
        ];
    }
}
