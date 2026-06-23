<?php

namespace App\Services;

use App\Domain\Exceptions\AutoExclusaoException;
use App\Domain\Exceptions\EmailDuplicadoException;
use App\Domain\Exceptions\RecursoEmUsoException;
use App\Models\Usuario;
use App\Repositories\UsuarioRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;

class UsuarioService
{
    public function __construct(private readonly UsuarioRepositoryInterface $usuarios) {}

    /**
     * @param  array<string, mixed>  $filtros
     * @return LengthAwarePaginator<int, Usuario>
     */
    public function listar(array $filtros): LengthAwarePaginator
    {
        return $this->usuarios->listar($filtros);
    }

    public function detalhe(int $id): Usuario
    {
        $usuario = $this->usuarios->acharPorId($id);
        abort_if($usuario === null, 404, 'Usuario nao encontrado.');

        return $usuario;
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function criar(array $dados): Usuario
    {
        if ($this->usuarios->emailExiste($dados['email'])) {
            throw new EmailDuplicadoException;
        }

        return $this->usuarios->criar($this->normalizarSenha($dados));
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function atualizar(int $id, array $dados): Usuario
    {
        $usuario = $this->detalhe($id);

        if (array_key_exists('email', $dados) && $this->usuarios->emailExiste($dados['email'], $id)) {
            throw new EmailDuplicadoException;
        }

        return $this->usuarios->atualizar($usuario, $this->normalizarSenha($dados));
    }

    public function remover(int $id, int $idUsuarioAutenticado): void
    {
        if ($id === $idUsuarioAutenticado) {
            throw new AutoExclusaoException;
        }

        $usuario = $this->detalhe($id);

        try {
            $this->usuarios->remover($usuario);
        } catch (QueryException $exception) {
            if (in_array($exception->getCode(), ['23000', '23503'], true)) {
                throw new RecursoEmUsoException('Usuario ainda possui registros relacionados.', errorCode: 'USUARIO_REFERENCIADO', previous: $exception);
            }

            throw $exception;
        }
    }

    /**
     * @param  array<string, mixed>  $dados
     * @return array<string, mixed>
     */
    private function normalizarSenha(array $dados): array
    {
        if (array_key_exists('senha', $dados)) {
            $dados['senha_hash'] = $dados['senha'];
            unset($dados['senha']);
        }

        return $dados;
    }
}
