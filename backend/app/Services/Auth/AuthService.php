<?php

namespace App\Services\Auth;

use App\Models\Usuario;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * @return array{token: string, usuario: Usuario}|null
     */
    public function login(string $email, string $senha): ?array
    {
        $token = Auth::guard('api')->attempt([
            'email' => $email,
            'password' => $senha,
        ]);

        if ($token === false) {
            return null;
        }

        return [
            'token' => $token,
            'usuario' => Auth::guard('api')->user(),
        ];
    }

    public function logout(): void
    {
        Auth::guard('api')->logout();
    }

    /**
     * @return array{token: string, usuario: Usuario}
     */
    public function refresh(): array
    {
        $token = Auth::guard('api')->refresh();

        return [
            'token' => $token,
            'usuario' => Auth::guard('api')->user(),
        ];
    }

    public function me(): Usuario
    {
        return Auth::guard('api')->user();
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function atualizarPerfil(array $dados): Usuario
    {
        $usuario = $this->me();

        if (array_key_exists('nome_completo', $dados)) {
            $usuario->nome_completo = $dados['nome_completo'];
        }

        if (array_key_exists('nova_senha', $dados)) {
            if (! Hash::check($dados['senha_atual'] ?? '', $usuario->senha_hash)) {
                throw ValidationException::withMessages([
                    'senha_atual' => ['Senha atual incorreta.'],
                ]);
            }

            $usuario->senha_hash = $dados['nova_senha'];
        }

        $usuario->save();

        return $usuario->refresh();
    }

    public function expiresIn(): int
    {
        return Auth::guard('api')->factory()->getTTL() * 60;
    }
}
