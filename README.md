# HelloBooks

HelloBooks e um sistema web de biblioteca em monorepo. O projeto entrega uma API Laravel, uma SPA React e infraestrutura local com Docker Compose para desenvolver o catalogo de livros, autores, editoras, categorias e exemplares.

## Stack

- Backend: PHP 8.3, Laravel 12, PostgreSQL, Redis, JWT Auth.
- Frontend: React 18, TypeScript, Vite, Axios, React Router.
- Infra local: Docker Compose.
- Contratos: OpenAPI em `specs/001-gestao-catalogo/contracts/openapi.yaml`.

## Estrutura

```text
.
├── backend/                         # API Laravel
├── frontend/                        # SPA React + Vite
├── docker/                          # Infra local
│   ├── backend/Dockerfile           # Imagem PHP da API
│   ├── docker-compose.yml           # Postgres, Redis, backend e frontend
│   └── .env.example                 # Variaveis do Compose
├── specs/                           # Especificacoes Spec Kit
│   └── 001-gestao-catalogo/         # Feature atual de gestao de catalogo
├── Makefile                         # Atalhos de desenvolvimento
├── package.json                     # Scripts de monorepo
└── AGENTS.md                        # Instrucoes para agentes
```

## Backend

O backend fica em `backend/` e segue a arquitetura `Controller -> Service -> Repository -> Eloquent Model`.

Principais pastas:

- `backend/app/Http/Controllers/Catalog/`: controllers REST do catalogo.
- `backend/app/Http/Requests/Catalog/`: validacao de entrada via FormRequest.
- `backend/app/Services/Catalog/`: regras de negocio e transacoes.
- `backend/app/Repositories/Catalog/`: acesso a dados via contratos e implementacoes Eloquent.
- `backend/app/Models/`: models Eloquent em portugues (`Livro`, `Autor`, `Editora`, `Categoria`, `Exemplar`, `Usuario`).
- `backend/app/Domain/`: enums e excecoes de dominio.
- `backend/database/migrations/`: schema PostgreSQL.
- `backend/database/seeders/`: dados iniciais, incluindo `UsuarioSeeder`.
- `backend/routes/api.php`: rotas `/api/v1` protegidas por `auth:api` e `cargo:bibliotecario`.

Rotas ja implementadas nesta etapa:

- `POST /api/v1/livros`
- `POST /api/v1/livros/{id}/exemplares`

O endpoint de login/JWT ainda nao faz parte desta feature. Para testes manuais, gere o token via `php artisan tinker`, conforme `specs/001-gestao-catalogo/quickstart.md`.

## Frontend

O frontend fica em `frontend/`.

Principais pastas:

- `frontend/src/api/client.ts`: instancia Axios centralizada, com JWT e normalizacao de erros.
- `frontend/src/api/catalog/`: chamadas HTTP e tipos do catalogo.
- `frontend/src/features/catalog/`: telas da feature de catalogo.
- `frontend/src/routes.tsx`: rotas React Router.

Rota ja implementada nesta etapa:

- `/catalogo/novo`: formulario de cadastro de livro e exemplares iniciais.

## Infra Local

As portas expostas no notebook foram deslocadas 15 acima das padroes para evitar conflito com servicos locais.

| Servico | Porta local | Porta container |
|---------|-------------|-----------------|
| Postgres | `5447` | `5432` |
| Redis | `6394` | `6379` |
| Backend | `8015` | `8015` |
| Frontend | `5188` | `5188` |

URLs locais:

- API: `http://localhost:8015/api/v1`
- Frontend: `http://localhost:5188`

## Comandos

Use o `Makefile` na raiz para operar o ambiente.

```bash
make help
make up
make ps
make logs
make down
```

Shells uteis:

```bash
make shell-backend
make shell-frontend
make shell-postgres
make shell-redis
```

Comandos de app:

```bash
make migrate
make seed
make migrate-fresh
make test-backend
make frontend-build
make pint
```

Comandos parametrizados:

```bash
make artisan CMD='route:list'
make composer CMD='install'
make npm CMD='run build'
```

## Fluxo Inicial

1. Subir containers:

```bash
make up
```

2. Rodar migrations e seeders:

```bash
make migrate-fresh
```

3. Verificar rotas da API:

```bash
make artisan CMD='route:list --path=api/v1'
```

4. Abrir o frontend:

```text
http://localhost:5188
```

## Contratos e Specs

A feature atual vive em `specs/001-gestao-catalogo/`.

Arquivos importantes:

- `specs/001-gestao-catalogo/spec.md`: requisitos funcionais.
- `specs/001-gestao-catalogo/plan.md`: plano tecnico e arquitetura.
- `specs/001-gestao-catalogo/data-model.md`: entidades, colunas, FKs e indices.
- `specs/001-gestao-catalogo/tasks.md`: lista de tarefas e status.
- `specs/001-gestao-catalogo/quickstart.md`: smoke test manual.
- `specs/001-gestao-catalogo/contracts/openapi.yaml`: contrato REST canonico.

## Status Atual

Ja foram implementadas a fundacao da API e a primeira parte do fluxo de cadastro de catalogo. As tarefas de teste de feature `T026` e `T027` ainda precisam ser criadas e executadas contra PostgreSQL, conforme a constituicao do projeto.

## Observacoes

- O banco oficial de desenvolvimento e teste e PostgreSQL, nao SQLite.
- Mutacoes de catalogo devem passar por Services e usar transacao quando envolverem multiplas tabelas.
- Erros de dominio devem retornar envelope JSON no formato `{ "error": { "code", "message", "details" } }`.
- Toda mutacao de catalogo deve gerar registro em `logs_atividades`.
