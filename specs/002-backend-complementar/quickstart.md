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

Os comandos abaixo assumem que a API esta disponivel em `http://localhost:8015` e que
`jq` esta instalado.

### 1. Login

```bash
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8015/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"biblio@hello.local","senha":"secret123"}')

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
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
curl -s http://localhost:8015/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Resposta esperada: objeto do usuario autenticado, sem `senha` ou `senha_hash`.

### 3. Dashboard stats

```bash
curl -s http://localhost:8015/api/v1/dashboard/stats \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Resposta esperada: objeto com contagens, `exemplares_por_status`, `livros_recentes` e
`atividade_recente`.

### 4. Listar usuarios

```bash
curl -s 'http://localhost:8015/api/v1/usuarios?per_page=10' \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Resposta esperada: `{ "data": [...], "pagination": {...} }`, sem `senha_hash`.

### 5. Listar logs

```bash
curl -s 'http://localhost:8015/api/v1/logs?per_page=10' \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Resposta esperada: `{ "data": [...], "pagination": {...} }`, com `usuario` aninhado
quando houver logs.

### 6. Logout

```bash
curl -s -X POST http://localhost:8015/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Resposta esperada:
```json
{
  "message": "Logout realizado com sucesso."
}
```

### 7. Confirmar token revogado

```bash
curl -s -i http://localhost:8015/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

Resposta esperada: HTTP 401 com envelope `error.code = NAO_AUTENTICADO`.

## Rodar testes

```bash
docker compose exec backend php artisan test --filter=Auth
docker compose exec backend php artisan test --filter=Usuario
docker compose exec backend php artisan test --filter=Dashboard
docker compose exec backend php artisan test --filter=Log
docker compose exec backend php artisan test --testsuite=Feature
docker compose exec backend ./vendor/bin/pint --test
```
