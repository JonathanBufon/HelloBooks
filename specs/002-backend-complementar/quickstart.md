# Quickstart: Backend Complementar

## Pre-requisitos

- Docker e Docker Compose instalados
- Projeto HelloBooks clonado e na branch `002-backend-complementar`
- Backend da feature 001 funcionando (migrations rodadas)

## Subir o ambiente

```bash
cd docker/
docker compose up -d
```

## Rodar migrations e seeders

```bash
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
```

O seeder cria o usuario admin: `biblio@hello.local` / `secret123` / `bibliotecario`.

## Gerar JWT secret (se necessario)

```bash
docker compose exec backend php artisan jwt:secret
```

## Smoke test

### 1. Login

```bash
curl -s -X POST http://localhost:8015/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"biblio@hello.local","senha":"secret123"}' | jq .
```

Resposta esperada:
```json
{
  "token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "usuario": {
    "id_usuario": 1,
    "nome_completo": "Bibliotecario HelloBooks",
    "email": "biblio@hello.local",
    "cargo": "bibliotecario"
  }
}
```

### 2. Me (com token)

```bash
TOKEN="<token do passo anterior>"
curl -s http://localhost:8015/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 3. Dashboard stats

```bash
curl -s http://localhost:8015/api/v1/dashboard/stats \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 4. Listar usuarios

```bash
curl -s http://localhost:8015/api/v1/usuarios \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 5. Listar logs

```bash
curl -s http://localhost:8015/api/v1/logs \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 6. Logout

```bash
curl -s -X POST http://localhost:8015/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## Rodar testes

```bash
docker compose exec backend php artisan test --filter=Auth
docker compose exec backend php artisan test --filter=Usuario
docker compose exec backend php artisan test --filter=Dashboard
docker compose exec backend php artisan test --filter=Log
```
