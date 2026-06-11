---

description: "Task list for feature 001-gestao-catalogo (HelloBooks)"
---

# Tasks: Gestão de Catálogo

**Input**: Design documents from `/specs/001-gestao-catalogo/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: INCLUÍDOS — a [Constituição v1.0.0 (Fluxo de Desenvolvimento)](../../.specify/memory/constitution.md)
exige testes de feature/integração para todo endpoint REST novo e testes unitários para
regras de negócio em Services. Tasks de teste estão dentro de cada user story.

**Organization**: Tasks agrupadas por user story (US1–US4) para permitir entrega
independente. Cada checkpoint marca a feature operável até aquele ponto.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente).
- **[Story]**: a qual user story a task pertence (US1, US2, US3, US4).
- Setup e Foundational não têm rótulo de story.

## Path Conventions

Monorepo (decisão **D-001** em `research.md`):
- Backend Laravel: `backend/`
- Frontend React: `frontend/`
- Infra dev: `docker/`
- Contratos: `specs/001-gestao-catalogo/contracts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar o monorepo, scaffolds de backend e frontend, infra Docker.

- [X] T001 Criar estrutura de diretórios `backend/`, `frontend/`, `docker/` na raiz do repositório
- [X] T002 [P] Inicializar Laravel 12 em `backend/` (`composer create-project laravel/laravel backend`) e mover `.env.example` para `backend/.env.example`
- [X] T003 [P] Inicializar Vite + React + TypeScript em `frontend/` (`npm create vite@latest frontend -- --template react-ts`)
- [X] T004 [P] Criar `docker/docker-compose.yml` com serviços `postgres:16`, `redis:7`, `backend` (PHP 8.3), `frontend` (Node 20)
- [X] T005 [P] Criar `docker/.env.example` com `POSTGRES_DB=hellobooks`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `JWT_SECRET`
- [X] T006 [P] Em `backend/`, instalar dependências: `composer require php-open-source-saver/jwt-auth doctrine/dbal` e publicar `config/jwt.php`
- [X] T007 [P] Em `frontend/`, instalar `axios` e `react-router-dom` (`npm install axios react-router-dom`)
- [X] T008 [P] Configurar lint: `composer require --dev laravel/pint` em `backend/`; configurar ESLint + Prettier em `frontend/` (`eslint.config.js`, `.prettierrc`)
- [X] T009 [P] Criar `package.json` na raiz do monorepo com scripts `gen:postman` e `dev` (usando `concurrently` para subir backend/frontend juntos)
- [X] T010 Ajustar `backend/.env.example` para Postgres (`DB_CONNECTION=pgsql`, `DB_HOST=postgres`, `DB_DATABASE=hellobooks`, `DB_PORT=5432`) e Redis (`REDIS_HOST=redis`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Auth scaffold, log de atividade, error envelope, middlewares — toda US
depende destes.

**⚠️ CRITICAL**: Nenhuma user story começa até esta phase terminar.

- [X] T011 Criar migration `backend/database/migrations/2026_06_10_000000_enable_unaccent_extension.php` que executa `CREATE EXTENSION IF NOT EXISTS unaccent`
- [X] T012 Criar migration `backend/database/migrations/2026_06_10_000001_create_usuarios_table.php` (colunas conforme `data-model.md` → tabela `usuarios`)
- [X] T013 Criar migration `backend/database/migrations/2026_06_10_000009_create_logs_atividades_table.php` (FK para `usuarios`, índices conforme `data-model.md`)
- [X] T014 [P] Criar model `backend/app/Models/Usuario.php` com `BackedEnum` para `cargo`, `HasJwtSubject` para JWT
- [X] T015 [P] Criar model `backend/app/Models/LogAtividade.php`
- [X] T016 Configurar guard JWT em `backend/config/auth.php` (`'api' => ['driver' => 'jwt', 'provider' => 'users']`) e provider `'users'` apontando para `App\Models\Usuario`
- [X] T017 [P] Criar middleware `backend/app/Http/Middleware/EnsureCargo.php` (parâmetro de rota: cargo aceito; bloqueia com 403 `{ error: { code: "CARGO_INSUFICIENTE" } }`)
- [X] T018 [P] Registrar `EnsureCargo` em `backend/app/Http/Kernel.php` (alias `cargo`)
- [X] T019 [P] Criar listener `backend/app/Listeners/AuditarMutacao.php` que recebe Eloquent events `created/updated/deleted` e grava em `logs_atividades`
- [X] T020 Registrar listener nos models de catálogo via trait `AuditableTrait` em `backend/app/Models/Concerns/AuditableTrait.php` (será aplicado nos models de US1+)
- [X] T021 [P] Criar exceções de domínio em `backend/app/Domain/Exceptions/`: `DomainException.php` (base), `RecursoEmUsoException.php`, `IsbnDuplicadoException.php`, `TransicaoInvalidaException.php`
- [X] T022 [P] Atualizar `backend/app/Exceptions/Handler.php` para converter exceções de domínio em envelope `{ error: { code, message, details? } }` com HTTP apropriado (409 para `RecursoEmUso`/`IsbnDuplicado`/`TransicaoInvalida`, 422 para `ValidationException`)
- [X] T023 Definir grupo de rotas `/api/v1` em `backend/routes/api.php` com middleware `auth:api` + `cargo:bibliotecario` aplicado por padrão
- [X] T024 [P] Criar cliente Axios `frontend/src/api/client.ts` com `baseURL`, interceptor para anexar `Authorization: Bearer ${jwt}` e normalizar erros para `{ code, message, details }`
- [X] T025 [P] Criar seeder `backend/database/seeders/UsuarioSeeder.php` que cria `biblio@hello.local` / `secret123` (cargo `bibliotecario`) e referenciar em `DatabaseSeeder.php`

**Checkpoint**: Fundação pronta. Pode-se subir `docker compose up` e rodar `php artisan migrate --seed` com sucesso; `auth('api')->login($user)` retorna um JWT.

---

## Phase 3: User Story 1 - Cadastrar livro novo no acervo (Priority: P1) 🎯 MVP

**Goal**: Bibliotecário consegue cadastrar uma obra completa (livro + editora + ≥1 autor
+ ≥1 categoria) e registrar exemplares físicos. Sem isso o MVP não existe.

**Independent Test**: Via curl/Postman, `POST /api/v1/livros` cria obra; `POST /api/v1/livros/{id}/exemplares` cria N exemplares; `GET /api/v1/livros/{id}` mostra o livro com seus exemplares (todos `disponivel`/`intacto`). Toda mutação aparece em `logs_atividades`.

### Tests for User Story 1

- [ ] T026 [P] [US1] Feature test em `backend/tests/Feature/Catalog/CadastroLivroTest.php` cobrindo: criação válida (com editora/autor/categoria inline), recusa por ISBN duplicado, recusa sem autor, recusa sem categoria, recusa para cargo `leitor`, recusa sem auth, verificação de inserção em `logs_atividades`
- [ ] T027 [P] [US1] Feature test em `backend/tests/Feature/Catalog/CadastroExemplaresTest.php` cobrindo: criação em lote (quantidade=N), defaults `disponivel`/`intacto`, recusa para livro inexistente, recusa de quantidade inválida (0, negativo, >1000)

### Migrations (criar tabelas do catálogo)

- [X] T028 [P] [US1] Migration `backend/database/migrations/2026_06_10_000002_create_editoras_table.php` (índice funcional `lower(unaccent(nome))`)
- [X] T029 [P] [US1] Migration `backend/database/migrations/2026_06_10_000003_create_autores_table.php` (índice funcional `lower(unaccent(nome))`)
- [X] T030 [P] [US1] Migration `backend/database/migrations/2026_06_10_000004_create_categorias_table.php` (UNIQUE `nome`)
- [X] T031 [US1] Migration `backend/database/migrations/2026_06_10_000005_create_livros_table.php` (FK `id_editora` RESTRICT, UNIQUE `isbn`, CHECK `ano_publicacao`, índice funcional `lower(unaccent(titulo))`)
- [X] T032 [US1] Migration `backend/database/migrations/2026_06_10_000006_create_exemplares_table.php` (FK `id_livro` RESTRICT, CHECK `status`, CHECK `condicao_fisica`, defaults, índice `(id_livro, status)`)
- [X] T033 [US1] Migration `backend/database/migrations/2026_06_10_000007_create_livros_autores_table.php` (PK composta, FK CASCADE em `id_livro` + RESTRICT em `id_autor`)
- [X] T034 [US1] Migration `backend/database/migrations/2026_06_10_000008_create_livros_categorias_table.php` (PK composta, FK CASCADE em `id_livro` + RESTRICT em `id_categoria`)

### Models

- [X] T035 [P] [US1] Model `backend/app/Models/Editora.php` com `HasMany livros` e trait `AuditableTrait`
- [X] T036 [P] [US1] Model `backend/app/Models/Autor.php` com `BelongsToMany livros` (pivot `livros_autores`) e `AuditableTrait`
- [X] T037 [P] [US1] Model `backend/app/Models/Categoria.php` com `BelongsToMany livros` e `AuditableTrait`
- [X] T038 [P] [US1] Model `backend/app/Models/Livro.php` com `BelongsTo editora`, `BelongsToMany autores`, `BelongsToMany categorias`, `HasMany exemplares`, `AuditableTrait`
- [X] T039 [P] [US1] Model `backend/app/Models/Exemplar.php` com `BelongsTo livro`, casts de enum (`StatusExemplar`, `CondicaoFisica` em `app/Domain/Exemplar/`), `AuditableTrait`
- [X] T040 [P] [US1] Enum `backend/app/Domain/Exemplar/StatusExemplar.php` (`disponivel`, `emprestado`, `reservado`, `manutencao`)
- [X] T041 [P] [US1] Enum `backend/app/Domain/Exemplar/CondicaoFisica.php` (`intacto`, `rabiscado`, `rasgado`, `dobrado`)

### Repositories

- [X] T042 [P] [US1] `backend/app/Repositories/Catalog/LivroRepositoryInterface.php` + `EloquentLivroRepository.php` (métodos `criar`, `buscarPorIsbn`)
- [X] T043 [P] [US1] `backend/app/Repositories/Catalog/AutorRepositoryInterface.php` + `EloquentAutorRepository.php` (`criar`, `acharOuCriarPorNome`)
- [X] T044 [P] [US1] `backend/app/Repositories/Catalog/EditoraRepositoryInterface.php` + `EloquentEditoraRepository.php` (`criar`, `acharPorId`)
- [X] T045 [P] [US1] `backend/app/Repositories/Catalog/CategoriaRepositoryInterface.php` + `EloquentCategoriaRepository.php` (`criar`, `acharOuCriarPorNome`)
- [X] T046 [P] [US1] `backend/app/Repositories/Catalog/ExemplarRepositoryInterface.php` + `EloquentExemplarRepository.php` (`criarEmLote`)
- [X] T047 [US1] Bindar interfaces em `backend/app/Providers/AppServiceProvider.php`

### Services

- [X] T048 [US1] `backend/app/Services/Catalog/LivroService.php::criar(LivroCreateDto)` — dentro de `DB::transaction`: valida ISBN único (lança `IsbnDuplicadoException`), cria/encontra editora, cria/encontra autores e categorias, persiste livro, sincroniza associações
- [X] T049 [US1] `backend/app/Services/Catalog/ExemplarService.php::registrarLote(idLivro, quantidade)` — cria N exemplares em `DB::transaction`

### FormRequests + Controllers + Routes

- [X] T050 [P] [US1] `backend/app/Http/Requests/Catalog/LivroCreateRequest.php` (regras de validação por FR-022/023/024 e estrutura conforme `LivroCreate` no OpenAPI)
- [X] T051 [P] [US1] `backend/app/Http/Requests/Catalog/ExemplarBatchRequest.php` (`quantidade: integer|min:1|max:1000`)
- [X] T052 [US1] `backend/app/Http/Controllers/Catalog/LivroController.php::store` (resposta 201 com o livro criado serializado)
- [X] T053 [US1] `backend/app/Http/Controllers/Catalog/ExemplarController.php::storeBatch` (resposta 201 com array de exemplares)
- [X] T054 [US1] Definir rotas `POST /livros` e `POST /livros/{id}/exemplares` em `backend/routes/api.php`

### Frontend

- [X] T055 [P] [US1] `frontend/src/api/catalog/livros.ts` (`criarLivro(payload)`)
- [X] T056 [P] [US1] `frontend/src/api/catalog/exemplares.ts` (`registrarLote(idLivro, quantidade)`)
- [X] T057 [P] [US1] `frontend/src/api/catalog/types.ts` com tipos `Livro`, `LivroCreate`, `Exemplar`, `Autor`, `Editora`, `Categoria` derivados do OpenAPI
- [X] T058 [US1] `frontend/src/features/catalog/CadastrarLivroPage.tsx` com formulário (título, ISBN, ano, editora, autores múltiplos, categorias múltiplas, quantidade inicial de exemplares)
- [X] T059 [US1] Rota `/catalogo/novo` em `frontend/src/routes.tsx` apontando para `CadastrarLivroPage`

**Checkpoint US1**: bibliotecário cria livro + exemplares via API e via UI; logs_atividades acumula entradas; ISBN duplicado é rejeitado com 409.

---

## Phase 4: User Story 2 - Consultar e localizar obras (Priority: P2)

**Goal**: Listagem paginada, busca acento-insensitive e detalhe de obra com contagem
de exemplares por status.

**Independent Test**: Com 50 livros cadastrados, `GET /livros?q=Machado&page=1` retorna
apenas obras correspondentes; `GET /livros/{id}` retorna detalhe com `contagem_exemplares`.

### Tests for User Story 2

- [ ] T060 [P] [US2] Feature test `backend/tests/Feature/Catalog/ConsultaCatalogoTest.php` cobrindo: listagem paginada (20 por página por default, total/last_page corretos), busca por título/ISBN/autor/categoria (case- e acento-insensitive), detalhe com `contagem_exemplares`, página vazia para resultado sem matches
- [ ] T061 [P] [US2] Unit test `backend/tests/Unit/Catalog/BuscaCatalogoServiceTest.php` cobrindo geração correta da query com `unaccent` + `ILIKE`

### Implementation

- [ ] T062 [US2] `backend/app/Services/Catalog/BuscaCatalogoService.php::buscar(termo, page, perPage)` — usa `unaccent(lower(titulo)) ILIKE` + joins em autores e categorias, paginação Laravel
- [ ] T063 [US2] Estender `EloquentLivroRepository` com scope `comDetalhes` (eager load `editora`, `autores`, `categorias`, `exemplares`) e método `contagemPorStatus(idLivro)`
- [ ] T064 [US2] `LivroService::detalhe(id)` retorna `LivroDetalhe` com `contagem_exemplares` (`disponivel`, `emprestado`, `reservado`, `manutencao`)
- [ ] T065 [US2] `LivroService::listar(filtros)` — orquestra busca paginada via `BuscaCatalogoService`
- [ ] T066 [P] [US2] `backend/app/Services/Catalog/AutorService.php::listar(termo, page, perPage)`
- [ ] T067 [P] [US2] `backend/app/Services/Catalog/EditoraService.php::listar(termo, page, perPage)`
- [ ] T068 [P] [US2] `backend/app/Services/Catalog/CategoriaService.php::listar(termo, page, perPage)`
- [ ] T069 [P] [US2] Resources `backend/app/Http/Resources/Catalog/`: `LivroResource`, `LivroDetalheResource`, `AutorResource`, `EditoraResource`, `CategoriaResource`, `ExemplarResource` (envelope `{ data, pagination }` conforme OpenAPI)
- [ ] T070 [P] [US2] `LivroController::index, show`
- [ ] T071 [P] [US2] `AutorController::index, show` em `backend/app/Http/Controllers/Catalog/AutorController.php`
- [ ] T072 [P] [US2] `EditoraController::index, show` em `backend/app/Http/Controllers/Catalog/EditoraController.php`
- [ ] T073 [P] [US2] `CategoriaController::index, show` em `backend/app/Http/Controllers/Catalog/CategoriaController.php`
- [ ] T074 [P] [US2] `ExemplarController::indexPorLivro` (`GET /livros/{id}/exemplares`) e `show` (`GET /exemplares/{id}`)
- [ ] T075 [US2] Definir rotas GET correspondentes em `backend/routes/api.php`

### Frontend

- [ ] T076 [P] [US2] `frontend/src/api/catalog/autores.ts`, `editoras.ts`, `categorias.ts` com `listar(termo, page)`
- [ ] T077 [P] [US2] Estender `frontend/src/api/catalog/livros.ts` com `listar(filtros)` e `detalhe(id)`
- [ ] T078 [US2] `frontend/src/features/catalog/ListaCatalogoPage.tsx` (campo de busca, tabela paginada)
- [ ] T079 [US2] `frontend/src/features/catalog/DetalheLivroPage.tsx` (dados do livro + lista de exemplares + contagem por status)
- [ ] T080 [US2] Rotas `/catalogo` e `/catalogo/:id` em `frontend/src/routes.tsx`

**Checkpoint US2**: SC-002 verificável (busca <1s em 10k livros, ver `T103`); listas e detalhe rendem na UI.

---

## Phase 5: User Story 3 - Editar obras e entidades de apoio (Priority: P3)

**Goal**: Editar metadados (título, ISBN, ano, editora, autores, categorias), nome de
autor/editora/categoria, e estado de exemplares (`disponivel ↔ manutencao` + condição
física).

**Independent Test**: Renomear editora — todos os livros associados continuam apontando
para ela; marcar exemplar como `manutencao` muda contagem por status; tentativa de
edição por `leitor` é negada.

### Tests for User Story 3

- [ ] T081 [P] [US3] Feature test `backend/tests/Feature/Catalog/EdicaoCatalogoTest.php` cobrindo: edição de livro mantém associações, edição de ISBN respeita unicidade, troca de autor preserva o autor antigo, edição de exemplar `disponivel → manutencao + rasgado` audita, edição por `leitor` é negada
- [ ] T082 [P] [US3] Unit test `backend/tests/Unit/Catalog/StatusTransitionTest.php` cobrindo a matriz completa de transições válidas e inválidas

### Implementation

- [ ] T083 [P] [US3] `backend/app/Domain/Exemplar/StatusTransition.php` (matriz de transições válidas; método `validar(de, para)`; lança `TransicaoInvalidaException`)
- [ ] T084 [US3] `LivroService::atualizar(id, LivroUpdateDto)` — em `DB::transaction`: aplica deltas, valida ISBN único (excluindo o próprio id), sincroniza `livros_autores` e `livros_categorias` via `sync()`
- [ ] T085 [US3] `ExemplarService::atualizar(id, status?, condicaoFisica?)` — invoca `StatusTransition::validar` quando `status` muda; restringe transições permitidas via API de catálogo a `disponivel ↔ manutencao` (demais lançam `TransicaoInvalidaException`)
- [ ] T086 [P] [US3] `AutorService::atualizar(id, nome)`
- [ ] T087 [P] [US3] `EditoraService::atualizar(id, nome)`
- [ ] T088 [P] [US3] `CategoriaService::atualizar(id, nome)` (trata `UNIQUE` violation → 409)
- [ ] T089 [P] [US3] FormRequests: `LivroUpdateRequest`, `ExemplarUpdateRequest`, `AutorUpdateRequest`, `EditoraUpdateRequest`, `CategoriaUpdateRequest` em `backend/app/Http/Requests/Catalog/`
- [ ] T090 [US3] Métodos `update` em `LivroController`, `ExemplarController`, `AutorController`, `EditoraController`, `CategoriaController`
- [ ] T091 [US3] Definir rotas `PUT` correspondentes em `backend/routes/api.php`

### Frontend

- [ ] T092 [P] [US3] Estender módulos API (`livros.ts`, `exemplares.ts`, `autores.ts`, `editoras.ts`, `categorias.ts`) com `atualizar(id, payload)`
- [ ] T093 [US3] `frontend/src/features/catalog/EditarLivroPage.tsx` (reusa estrutura de `CadastrarLivroPage`, pré-popula)
- [ ] T094 [US3] Botões de "marcar manutenção / disponível" e seletor de condição na `DetalheLivroPage`
- [ ] T095 [US3] Rota `/catalogo/:id/editar` em `frontend/src/routes.tsx`

**Checkpoint US3**: edições funcionam; transições inválidas retornam 409 claras.

---

## Phase 6: User Story 4 - Remover registros obsoletos com proteção de integridade (Priority: P4)

**Goal**: DELETE seguro de livros, autores, editoras, categorias e exemplares. Recusa
quando há referências (FR-016, FR-017, FR-018).

**Independent Test**: `DELETE /editoras/{id}` com livros associados → 409; `DELETE /editoras/{id}` sem livros → 204; `DELETE /exemplares/{id}` em status `emprestado` → 409.

### Tests for User Story 4

- [ ] T096 [P] [US4] Feature test `backend/tests/Feature/Catalog/RemocaoCatalogoTest.php` cobrindo: bloqueio de editora/autor/categoria com livros, sucesso quando livre, bloqueio de exemplar emprestado/reservado, bloqueio de livro com exemplares, hard delete confirmado, log de delete em `logs_atividades`

### Implementation

- [ ] T097 [US4] `LivroService::remover(id)` — verifica ausência de exemplares (e, no futuro, de `itens_emprestimo`); lança `RecursoEmUsoException` com `details: { exemplares: N }`
- [ ] T098 [US4] `ExemplarService::remover(id)` — recusa se status ∈ `{emprestado, reservado}`; sucesso caso `disponivel`/`manutencao`
- [ ] T099 [P] [US4] `AutorService::remover(id)` — captura `QueryException` 23503 (FK RESTRICT) e converte para `RecursoEmUsoException` com contagem de livros
- [ ] T100 [P] [US4] `EditoraService::remover(id)` (idem)
- [ ] T101 [P] [US4] `CategoriaService::remover(id)` (idem)
- [ ] T102 [US4] Métodos `destroy` (`204 No Content`) em `LivroController`, `ExemplarController`, `AutorController`, `EditoraController`, `CategoriaController`
- [ ] T103 [US4] Definir rotas `DELETE` em `backend/routes/api.php`

### Frontend

- [ ] T104 [P] [US4] Estender módulos API com `remover(id)`
- [ ] T105 [US4] Botões de remoção em `DetalheLivroPage` e telas de listagem de autores/editoras/categorias; tratamento do 409 mostrando a mensagem `error.message`

**Checkpoint US4**: feature completa entregue conforme spec.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T106 Criar script `gen:postman` na raiz `package.json` que executa `openapi-to-postmanv2 -s specs/001-gestao-catalogo/contracts/openapi.yaml -o specs/001-gestao-catalogo/contracts/postman/HelloBooks.postman_collection.json -p` e gerar a collection inicial (entrega 3.3)
- [ ] T107 Criar `backend/database/seeders/CatalogoSeeder.php` com dados de demo (5 editoras, 8 autores, 6 categorias, ~20 livros, ~60 exemplares) para suportar o smoke do `quickstart.md`
- [ ] T108 [P] Criar `README.md` na raiz com seção "Como rodar" apontando para `docker compose up`, `php artisan migrate --seed` e `npm run dev`
- [ ] T109 [P] Adicionar workflow CI `.github/workflows/backend.yml` rodando `php artisan test` em Postgres real (matriz PHP 8.3 + Postgres 16)
- [ ] T110 [P] Adicionar workflow CI `.github/workflows/frontend.yml` rodando `npm run test` e `npm run build`
- [ ] T111 Validar SC-002 com `EXPLAIN ANALYZE` em `BuscaCatalogoServiceTest`: garantir uso do índice `lower(unaccent(titulo))` em 10k linhas seedadas
- [ ] T112 [P] Auditar cobertura de `logs_atividades`: rodar suíte completa e confirmar que toda operação `created/updated/deleted` deixou rastro (SC-003)
- [ ] T113 Executar `quickstart.md` ponta a ponta e marcar todos os critérios "smoke OK"
- [ ] T114 [P] Atualizar `CLAUDE.md` apenas se a estrutura de pastas final divergir do que está documentado
- [ ] T115 Code review final contra a constituição: checar Princípios I–V em PR; preencher checklist na descrição

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → sem dependência externa.
- **Foundational (Phase 2)** → depende de Setup completo. BLOQUEIA todas as user stories.
- **User Stories (Phase 3+)** → cada uma depende SÓ de Foundational. Podem ser feitas em paralelo (times distintos) ou sequencialmente em ordem de prioridade.
- **Polish (Phase 7)** → depende das user stories implementadas que serão entregues.

### User Story Dependencies

- **US1 (P1)**: depende apenas de Foundational. É o MVP.
- **US2 (P2)**: depende de Foundational. Independente de US1 do ponto de vista funcional, mas precisa de dados no banco para demonstrar (use o seeder de US1 ou `CatalogoSeeder` do polish).
- **US3 (P3)**: depende de Foundational. Para validar manualmente precisa de dados; tecnicamente independente.
- **US4 (P4)**: depende de Foundational. Para validar manualmente precisa de dados.

### Within Each User Story

- Testes (incluídos por exigência da constituição) podem ser escritos junto com a implementação (não é TDD estrito — basta entregar com cobertura mínima).
- Migrations → Models → Repositories → Services → Controllers → Rotas → Frontend.
- Models marcados [P] podem ser feitos em paralelo (arquivos distintos).
- Controllers de Autor/Editora/Categoria são paralelos entre si (arquivos distintos).

### Parallel Opportunities

- Phase 1: T002..T009 marcados [P] podem rodar em paralelo após T001.
- Phase 2: T014/T015, T017/T018, T019/T021/T022, T024/T025 marcados [P] são paralelizáveis.
- US1: todas as migrations `[P]` (T028/T029/T030) podem ir juntas; todos os models `[P]` após migrations; todos os repositórios `[P]`.
- US2: serviços de Autor/Editora/Categoria são paralelos; controllers de Autor/Editora/Categoria são paralelos.
- US3 e US4: services de Autor/Editora/Categoria são paralelos.

---

## Parallel Example: User Story 1

```bash
# Após Foundational pronto, rodar em paralelo (developers diferentes):

# Lote 1 — migrations de catálogo (sem dep entre si)
Task: T028 — migration editoras
Task: T029 — migration autores
Task: T030 — migration categorias

# Lote 2 — após migrations livro/exemplares, models todos em paralelo
Task: T035 — Editora model
Task: T036 — Autor model
Task: T037 — Categoria model
Task: T038 — Livro model
Task: T039 — Exemplar model

# Lote 3 — repositories em paralelo
Task: T042..T046 — 5 repositories
```

---

## Implementation Strategy

### MVP First (US1 apenas)

1. Phase 1: Setup (T001–T010).
2. Phase 2: Foundational (T011–T025).
3. Phase 3: User Story 1 (T026–T059).
4. **STOP e VALIDATE**: smoke ponta-a-ponta de cadastrar livro + exemplares; confirmar logs.
5. Deploy/demo do MVP.

### Incremental Delivery

1. Setup + Foundational → fundação pronta.
2. US1 → MVP entregável (demo: cadastrar e ver listado pela `GET /livros`).
3. US2 → busca/detalhe → entrega completa de "operar catálogo".
4. US3 → edições → operação real do dia-a-dia.
5. US4 → remoção segura → fechamento da feature.
6. Phase 7 → polish + Postman + CI.

### Parallel Team Strategy

Com 3 desenvolvedores:
1. Time inteiro: Setup + Foundational.
2. Após Foundational:
   - Dev A: US1 (backend) → US1 (frontend)
   - Dev B: US2 (backend) → US2 (frontend)
   - Dev C: US3 (backend) → US4 (backend), e dá suporte ao frontend de US3/US4
3. Phase 7 em conjunto.

---

## Notes

- `[P]` = arquivos diferentes, sem dependência pendente.
- `[Story]` = rótulo de rastreabilidade — toda task de phase 3+ tem.
- Testes são exigidos pela constituição (Fluxo de Desenvolvimento) — feature tests para endpoints novos, unit tests para regras de negócio em Services.
- Após cada task ou bloco lógico, commit (hooks `speckit-git-commit` opcionais cobrem isso).
- **A feature de autenticação (login + emissão/revogação de JWT) NÃO está nesta lista** — é uma feature separada. Esta feature usa o guard `api` configurado em T016 mas o endpoint de login é entregue depois.
- Total: **115 tasks** (Setup: 10 | Foundational: 15 | US1: 34 | US2: 21 | US3: 15 | US4: 10 | Polish: 10).
