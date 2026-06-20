<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UsuarioResource;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $auth) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $login = $this->auth->login($request->validated('email'), $request->validated('senha'));

        if ($login === null) {
            return new JsonResponse([
                'error' => [
                    'code' => 'CREDENCIAIS_INVALIDAS',
                    'message' => 'Credenciais invalidas.',
                ],
            ], 401);
        }

        return $this->tokenResponse($request, $login['token'], $login['usuario']);
    }

    public function logout(): JsonResponse
    {
        $this->auth->logout();

        return new JsonResponse(['message' => 'Logout realizado com sucesso.']);
    }

    public function refresh(Request $request): JsonResponse
    {
        $login = $this->auth->refresh();

        return $this->tokenResponse($request, $login['token'], $login['usuario']);
    }

    public function me(Request $request): JsonResponse
    {
        return new JsonResponse((new UsuarioResource($this->auth->me()))->resolve($request));
    }

    private function tokenResponse(Request $request, string $token, mixed $usuario): JsonResponse
    {
        return new JsonResponse([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $this->auth->expiresIn(),
            'usuario' => (new UsuarioResource($usuario))->resolve($request),
        ]);
    }
}
