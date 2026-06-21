<?php

namespace App\Http\Middleware;

use App\Domain\Usuario\CargoUsuario;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCargo
{
    public function handle(Request $request, Closure $next, string ...$cargos): Response
    {
        $usuario = $request->user();
        $cargo = $usuario?->cargo instanceof CargoUsuario ? $usuario->cargo->value : $usuario?->cargo;

        if ($usuario === null || ! in_array($cargo, $cargos, true)) {
            return new JsonResponse([
                'error' => [
                    'code' => 'CARGO_INSUFICIENTE',
                    'message' => 'Cargo insuficiente para acessar este recurso.',
                ],
            ], 403);
        }

        return $next($request);
    }
}
