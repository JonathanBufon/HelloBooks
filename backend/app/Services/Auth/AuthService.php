<?php

namespace App\Services\Auth;

use App\Models\Usuario;
use Illuminate\Support\Facades\Auth;

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

    public function expiresIn(): int
    {
        return Auth::guard('api')->factory()->getTTL() * 60;
    }
}
