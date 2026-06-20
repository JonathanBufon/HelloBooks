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
├── docs/                            # Documentacao do projeto (modelo de dados, etc.)
├── Makefile                         # Atalhos de desenvolvimento
└── package.json                     # Scripts de monorepo
```

## Backend

O backend fica em `backend/` e segue a arquitetura `Controller -> Service -> Repository -> Eloquent Model`.

Spec ativa em desenvolvimento: `specs/002-backend-complementar/`. Ela complementa o backend com autenticacao JWT, CRUD de usuarios, dashboard de metricas agregadas e leitura dos logs de auditoria, sem alterar os endpoints de catalogo entregues na feature `001-gestao-catalogo`.

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

Na feature `001-gestao-catalogo`, o endpoint de login/JWT ainda nao fazia parte do escopo. Enquanto a spec `002-backend-complementar` estiver em desenvolvimento, gere o token via `php artisan tinker` para testar rotas ja protegidas, conforme a secao abaixo.

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

## Scripts DDL e DML

O projeto **nao usa arquivos `.sql` escritos manualmente**. O Laravel oferece um sistema chamado **Migrations** (para DDL) e **Seeders** (para DML) que gera e executa o SQL correspondente em tempo de execucao a partir de classes PHP.

### DDL — Definicao de Dados (Migrations)

Os scripts de criacao de tabelas, indices, constraints e chaves estrangeiras ficam em:

```
backend/database/migrations/
```

Cada arquivo e uma classe PHP que usa a API `Schema::create()` com o objeto `Blueprint` do Laravel. Por exemplo, a migration `2026_06_10_000005_create_livros_table.php` define a tabela `livros` com colunas, FK para `editoras`, indice unico em `isbn` e `CHECK` constraints — tudo via chamadas PHP que o framework traduz para DDL PostgreSQL.

Migrations do projeto (em ordem de execucao):

| Arquivo | Tabela/Acao |
|---------|-------------|
| `2026_06_10_000000_enable_unaccent_extension` | Habilita extensao `unaccent` no PostgreSQL |
| `2026_06_10_000001_create_usuarios_table` | `usuarios` |
| `2026_06_10_000002_create_editoras_table` | `editoras` |
| `2026_06_10_000003_create_autores_table` | `autores` |
| `2026_06_10_000004_create_categorias_table` | `categorias` |
| `2026_06_10_000005_create_livros_table` | `livros` |
| `2026_06_10_000006_create_exemplares_table` | `exemplares` |
| `2026_06_10_000007_create_livros_autores_table` | `livros_autores` (N:M) |
| `2026_06_10_000008_create_livros_categorias_table` | `livros_categorias` (N:M) |
| `2026_06_10_000009_create_logs_atividades_table` | `logs_atividades` |

**Como funciona**: o metodo `up()` de cada migration usa `Blueprint` para declarar colunas e constraints em PHP. Ao rodar `php artisan migrate`, o Laravel converte essas declaracoes no DDL nativo do banco configurado (no caso, PostgreSQL) e executa automaticamente. O metodo `down()` faz o inverso (DROP TABLE), permitindo reverter.

Para visualizar o SQL puro que uma migration geraria sem executar:

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan migrate --pretend
```

### DML — Manipulacao de Dados (Seeders)

Os scripts de carga inicial de dados ficam em:

```
backend/database/seeders/
```

| Arquivo | Funcao |
|---------|--------|
| `DatabaseSeeder.php` | Orquestrador — chama os demais seeders na ordem correta |
| `UsuarioSeeder.php` | Insere o usuario bibliotecario padrao (`biblio@hello.local`) |
| `CatalogoSeeder.php` | Insere editoras, autores, categorias, 20 livros e 3 exemplares por livro |

**Como funciona**: cada seeder e uma classe PHP com um metodo `run()` que usa os Models Eloquent (equivalente a um ORM) para executar `INSERT`s no banco. O `CatalogoSeeder`, por exemplo, cria registros em `editoras`, `autores`, `categorias`, `livros`, `livros_autores`, `livros_categorias` e `exemplares` via chamadas como `Editora::firstOrCreate(...)` e `Livro::updateOrCreate(...)`.

Para executar migrations + seeders de uma vez:

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan migrate --seed
```

Para rodar apenas os seeders (banco ja migrado):

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan db:seed
```

### Modelo de dados

O modelo conceitual completo do sistema (todas as entidades, atributos, relacionamentos e enums) esta em:

```
docs/banco.yaml
```

## Postman

A collection oficial fica dentro do backend:

```text
backend/postman/HelloBooks.postman_collection.json
```

Para regenerar a collection a partir do OpenAPI local da spec atual:

```bash
npm run gen:postman
```

## Infra Local

As portas expostas foram deslocadas 15 acima das padroes para evitar conflito com servicos locais.

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

A feature `001-gestao-catalogo` cobre cadastro, consulta, edicao e remocao protegida de livros, exemplares, autores, editoras e categorias. A feature ativa agora e `002-backend-complementar`, que adiciona auth JWT, CRUD de usuarios, dashboard e consulta de logs para suportar o frontend do MVP. A collection Postman versionada para uso fica em `backend/postman/HelloBooks.postman_collection.json`.

## Observacoes

- O banco oficial de desenvolvimento e teste e PostgreSQL, nao SQLite.
- Mutacoes de catalogo devem passar por Services e usar transacao quando envolverem multiplas tabelas.
- Erros de dominio devem retornar envelope JSON no formato `{ "error": { "code", "message", "details" } }`.
- Toda mutacao de catalogo deve gerar registro em `logs_atividades`.
