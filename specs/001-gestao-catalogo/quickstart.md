# Quickstart — Gestão de Catálogo

**Feature**: `001-gestao-catalogo`
**Date**: 2026-06-10

Como subir o ambiente local e fazer um smoke test ponta-a-ponta da feature.

> Este quickstart assume que o esqueleto Laravel + React já foi gerado pelas tarefas
> de implementação (ver `tasks.md` quando estiver disponível). Antes disso, os
> comandos `docker compose up` e `npm install` ainda não terão alvo.

## Pré-requisitos

- Docker + Docker Compose
- Node.js 20+ (para geração da collection Postman)
- (Opcional) PHP 8.3 e Composer locais, se quiser rodar artisan fora do container.

## 1. Subir o ambiente

A partir da raiz do monorepo:

```bash
cp docker/.env.example docker/.env       # ajuste DB_PASSWORD, JWT_SECRET se quiser
docker compose -f docker/docker-compose.yml up -d
```

Serviços levantados:

| Serviço    | Porta host | Descrição                            |
| ---------- | ---------- | ------------------------------------ |
| `postgres` | 5447       | Banco principal (db: `hellobooks`)   |
| `redis`    | 6394       | Cache                                |
| `backend`  | 8015       | Laravel (`php artisan serve`)        |
| `frontend` | 5188       | Vite dev server                       |

## 2. Preparar o backend

Migration + seed inicial (cria um bibliotecário de teste e alguns autores/editoras):

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan migrate --seed
```

O seeder cria:
- Usuário `biblio@hello.local` / senha `secret123` (cargo `bibliotecario`)
- 5 editoras, 8 autores, 6 categorias

## 3. Obter token JWT

> A feature de autenticação ainda não foi implementada nesta branch. Durante o
> desenvolvimento desta feature, use o tinker para gerar um token manualmente:

```bash
docker compose -f docker/docker-compose.yml exec backend php artisan tinker
```

```php
$user = App\Models\Usuario::where('email', 'biblio@hello.local')->first();
echo auth('api')->login($user);
```

Copie o token retornado.

## 4. Smoke test via curl

Substitua `$TOKEN` pelo token obtido acima.

```bash
TOKEN="<cole-aqui>"
BASE=http://localhost:8015/api/v1
H="-H Authorization:Bearer $TOKEN -H Content-Type:application/json"

# 4.1 — Criar livro (cria editora/autor/categoria inline)
curl -s $H -X POST $BASE/livros -d '{
  "titulo": "Dom Casmurro",
  "isbn": "9788535910663",
  "ano_publicacao": 1899,
  "id_editora": 1,
  "autores": [{"nome": "Machado de Assis"}],
  "categorias": [{"nome": "Romance"}]
}'

# 4.2 — Registrar 3 exemplares para o livro id=1
curl -s $H -X POST $BASE/livros/1/exemplares -d '{"quantidade": 3}'

# 4.3 — Listar catálogo (deve aparecer Dom Casmurro)
curl -s $H "$BASE/livros?page=1"

# 4.4 — Buscar por autor
curl -s $H "$BASE/livros?q=Machado"

# 4.5 — Detalhe do livro (com exemplares)
curl -s $H $BASE/livros/1

# 4.6 — Marcar exemplar 2 como em manutenção (rasgado)
curl -s $H -X PUT $BASE/exemplares/2 -d '{
  "status": "manutencao",
  "condicao_fisica": "rasgado"
}'

# 4.7 — Tentar remover editora ainda referenciada (deve falhar com 409)
curl -s -i $H -X DELETE $BASE/editoras/1
```

## 5. Smoke test via Postman

```bash
# Gerar a collection a partir do OpenAPI
npx -y openapi-to-postmanv2@5 \
  -s specs/001-gestao-catalogo/contracts/openapi.yaml \
  -o specs/001-gestao-catalogo/contracts/postman/HelloBooks.postman_collection.json -p
```

Importe `HelloBooks.postman_collection.json` no Postman, defina `baseUrl` e
`jwt_token` no Environment, e rode a sequência de requests dos folders na ordem:
Livros → Exemplares → Autores → Editoras → Categorias.

## 6. Frontend (consumo da API)

A partir do diretório `frontend/`:

```bash
npm install
npm run dev
```

Abra `http://localhost:5188`, faça login (quando a feature de auth estiver pronta) e
acesse:
- `/catalogo` — lista paginada e busca
- `/catalogo/novo` — cadastro de livro
- `/catalogo/:id` — detalhe + exemplares

## 7. Rodando testes

Backend (PHPUnit, Postgres real em container):
```bash
docker compose -f docker/docker-compose.yml exec backend php artisan test --testsuite=Feature
```

Frontend:
```bash
cd frontend && npm run test
```

## Critérios de "smoke OK"

Smoke executado em 2026-06-11 no Docker Compose local: `smoke_ok` com criação de livro,
3 exemplares, busca/detalhe, atualização de exemplar, `DELETE /editoras/{id}` retornando
`409` e `logs_atividades >= 5`.

Considere o ambiente saudável quando:
- ✅ `4.1` retorna `201` com o livro criado e ids de editora/autor/categoria preenchidos.
- ✅ `4.2` retorna `201` com 3 exemplares, todos `disponivel` / `intacto`.
- ✅ `4.5` retorna `contagem_exemplares: { disponivel: 3, ... }`.
- ✅ `4.6` retorna `200` com o exemplar atualizado.
- ✅ `4.7` retorna `409` com `error.code = "EDITORA_REFERENCIADA"`.
- ✅ Um `SELECT count(*) FROM logs_atividades` mostra ≥ 5 linhas após esses passos.
