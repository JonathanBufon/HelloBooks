# Quickstart — Multas e Notificacoes

**Feature**: `004-multas`

## Pre-requisitos

- Docker Compose rodando (backend + postgres + redis)
- Backend 001 + 002 migrado e funcional
- Frontend 003 funcional
- Seed: pelo menos 1 bibliotecario, 1 leitor, 1 livro com exemplares

## Setup

```bash
# Backend — rodar novas migrations
cd backend
php artisan migrate

# Seed emprestimo de teste (para ter item_emprestimo disponivel)
php artisan db:seed --class=EmprestimoTestSeeder

# Frontend — sem instalacao adicional (mesma base do 003)
cd frontend
npm run dev
```

## Smoke Test — Fluxo completo

### 1. Login como bibliotecario

```
POST /api/v1/auth/login
{ "email": "biblio@hello.local", "senha": "secret123" }
```

### 2. Registrar multa

```
POST /api/v1/multas
{
  "id_item_emprestimo": 1,
  "motivo": "atraso",
  "valor": 5.50
}
```

Esperado: 201 com multa status=pendente

### 3. Listar multas

```
GET /api/v1/multas?status=pendente
```

Esperado: 200 com a multa criada na listagem

### 4. Dar baixa (pagamento presencial)

```
PUT /api/v1/multas/1/pagar
```

Esperado: 200 com status=paga, data_baixa preenchida, id_bibliotecario_baixa preenchido

### 5. Tentar dar baixa novamente

```
PUT /api/v1/multas/1/pagar
```

Esperado: 409 — multa ja paga

### 6. Registrar outra multa e perdoar

```
POST /api/v1/multas
{ "id_item_emprestimo": 2, "motivo": "rabisco", "valor": 10.00 }

PUT /api/v1/multas/2/perdoar
{ "justificativa": "Isencao por primeiro incidente do leitor" }
```

Esperado: 200 com status=perdoada, justificativa_perdao preenchida

### 7. Perdoar sem justificativa

```
PUT /api/v1/multas/3/perdoar
{ "justificativa": "" }
```

Esperado: 422 — justificativa obrigatoria

### 8. Duplicidade de multa

```
POST /api/v1/multas
{ "id_item_emprestimo": 1, "motivo": "atraso", "valor": 3.00 }
```

Esperado: 409 — multa duplicada (mesmo item + motivo)

### 9. Login como leitor — notificacoes

```
POST /api/v1/auth/login
{ "email": "leitor@hello.local", "senha": "secret123" }

GET /api/v1/minhas-multas/resumo
```

Esperado: 200 com quantidade_pendente e valor_total_pendente

### 10. Leitor consulta suas multas

```
GET /api/v1/minhas-multas
```

Esperado: 200 com lista de multas do leitor + resumo. Apenas multas proprias.

### 11. Leitor tenta dar baixa

```
PUT /api/v1/multas/1/pagar
```

Esperado: 403 — cargo insuficiente

### 12. Frontend — fluxo visual

1. Login como leitor → badge de notificacao no Topbar mostra contagem de multas pendentes
2. Clicar no badge → tela "Minhas Multas" com lista e valor total
3. Logout → Login como bibliotecario
4. Navegar para /multas → listagem com filtros
5. Selecionar multa pendente → dar baixa
6. Logout → Login como leitor → badge atualizado (multa quitada desapareceu)

## Verificacoes de auditoria

```
GET /api/v1/logs?entidade=multas
```

Esperado: logs de created (registro), updated (baixa/perdao) para cada multa modificada.
