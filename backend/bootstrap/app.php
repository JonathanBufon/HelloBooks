<?php

use App\Domain\Exceptions\DomainException;
use App\Http\Middleware\EnsureCargo;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'cargo' => EnsureCargo::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (DomainException $exception): JsonResponse {
            $error = [
                'code' => $exception->errorCode(),
                'message' => $exception->getMessage(),
            ];

            if ($exception->details() !== []) {
                $error['details'] = $exception->details();
            }

            return new JsonResponse(['error' => $error], $exception->status());
        });

        $exceptions->render(function (ValidationException $exception): JsonResponse {
            return new JsonResponse([
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Os dados enviados sao invalidos.',
                    'details' => $exception->errors(),
                ],
            ], 422);
        });
    })->create();
