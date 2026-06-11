# HelloBooks

HelloBooks e um sistema backend de biblioteca. O projeto entrega uma API Laravel e infraestrutura local com Docker Compose para desenvolver o catalogo de livros, autores, editoras, categorias e exemplares.

## Stack

- Backend: PHP 8.3, Laravel 12, PostgreSQL, Redis, JWT Auth.
- Infra local: Docker Compose.
- Collection Postman: `backend/postman/HelloBooks.postman_collection.json`.

## Como Rodar

Suba a infraestrutura local:

```bash
cp docker/.env.example docker/.env
docker compose -f docker/docker-compose.yml up -d
```

Prepare o banco e os dados de demo:

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan migrate --seed
```

Se `backend/.env` ja existir de uma geracao anterior do Laravel, confirme que ele usa
`DB_CONNECTION=pgsql`, `DB_HOST=postgres` e um `JWT_SECRET` com pelo menos 32 caracteres.

Rode o backend em modo desenvolvimento, se preferir executar fora do Compose:

```bash
npm run dev
```

A API fica em `http://localhost:8015/api/v1`.

## Estrutura

```text
.
├── backend/                         # API Laravel
├── frontend/                        # Reservado; vazio por enquanto
├── docker/                          # Infra local
│   ├── backend/Dockerfile           # Imagem PHP da API
│   ├── docker-compose.yml           # Postgres, Redis e backend
│   └── .env.example                 # Variaveis do Compose
├── specs/                           # Artefatos locais do Spec Kit; nao depender deles no GitHub
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

Rotas principais implementadas nesta etapa:

- `POST /api/v1/livros`
- `POST /api/v1/livros/{id}/exemplares`
- `GET /api/v1/livros`
- `GET /api/v1/livros/{id}`
- `PUT /api/v1/livros/{id}`
- `DELETE /api/v1/livros/{id}`
- `GET|PUT|DELETE /api/v1/exemplares/{id}`
- `GET|PUT|DELETE /api/v1/autores/{id}`
- `GET|PUT|DELETE /api/v1/editoras/{id}`
- `GET|PUT|DELETE /api/v1/categorias/{id}`

O endpoint de login/JWT ainda nao faz parte desta feature. Para testes manuais, gere o token via `php artisan tinker`, conforme a secao abaixo.

## Bearer Token Para Testes

Garanta que o banco foi migrado e populado:

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan migrate --seed
```

Forma recomendada, sem abrir o tinker interativo:

```bash
make token
```

Comando equivalente sem Makefile:

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan tinker --execute='$user = App\Models\Usuario::where("email", "biblio@hello.local")->first(); echo auth("api")->login($user);'
```

O comando imprime o token JWT. No Postman, configure:

```text
Authorization: Bearer <token>
```

Ou preencha a variavel da collection:

```text
jwt_token = <token>
```

Se preferir usar o tinker interativo, rode uma linha por vez:

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan tinker
```

Dentro do tinker:

```php
$user = App\Models\Usuario::where('email', 'biblio@hello.local')->first();
```

Depois:

```php
auth('api')->login($user)
```

Nao cole as duas linhas juntas com texto extra do terminal, porque o PsySH pode gerar `PARSE ERROR`.

## Postman

A collection oficial fica dentro do backend:

```text
backend/postman/HelloBooks.postman_collection.json
```

Para regenerar a collection a partir do OpenAPI local da spec atual:

```bash
npm run gen:postman
```

As specs em `specs/` sao artefatos locais do fluxo Spec Kit. Futuramente elas nao devem ser tratadas como fonte versionada no GitHub; mantenha a collection consumivel pelo time dentro de `backend/postman/`.

## Infra Local

As portas expostas no notebook foram deslocadas 15 acima das padroes para evitar conflito com servicos locais.

| Servico | Porta local | Porta container |
|---------|-------------|-----------------|
| Postgres | `5447` | `5432` |
| Redis | `6394` | `6379` |
| Backend | `8015` | `8015` |

URLs locais:

- API: `http://localhost:8015/api/v1`

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
make shell-postgres
make shell-redis
```

Comandos de app:

```bash
make migrate
make seed
make migrate-fresh
make test-backend
make pint
```

Comandos parametrizados:

```bash
make artisan CMD='route:list'
make composer CMD='install'
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

## Status Atual

A feature de gestao de catalogo cobre cadastro, consulta, edicao e remocao protegida de livros, exemplares, autores, editoras e categorias. A collection Postman versionada para uso do time fica em `backend/postman/HelloBooks.postman_collection.json`.

## Observacoes

- O banco oficial de desenvolvimento e teste e PostgreSQL, nao SQLite.
- Mutacoes de catalogo devem passar por Services e usar transacao quando envolverem multiplas tabelas.
- Erros de dominio devem retornar envelope JSON no formato `{ "error": { "code", "message", "details" } }`.
- Toda mutacao de catalogo deve gerar registro em `logs_atividades`.
