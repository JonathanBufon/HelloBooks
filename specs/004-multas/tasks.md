# Tasks: Multas e Notificacoes

**Input**: Design documents from `specs/004-multas/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Backend feature tests included per constitution (testes minimos por feature: testes de feature/integracao para todo endpoint REST novo).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` (Laravel — app/, database/, routes/, tests/)
- **Frontend**: `frontend/src/` for source, `frontend/__tests__/` for tests

---

## Phase 1: Setup (Migrations)

**Purpose**: Create database tables for emprestimos (minimal schema) and multas

- [x] T001 Create migration `create_emprestimos_table` (id_emprestimo, id_usuario FK, data_retirada, data_devolucao_prevista, data_devolucao_real nullable, status CHECK ativo/devolvido/atrasado, timestamps) in `backend/database/migrations/`
- [x] T002 Create migration `create_itens_emprestimo_table` (id_item_emprestimo, id_emprestimo FK, id_exemplar FK, data_devolucao_item nullable, timestamps) in `backend/database/migrations/`
- [x] T003 Create migration `create_multas_table` (id_multa, id_item_emprestimo FK, motivo CHECK atraso/rabisco/rasgo/dobra, valor decimal(10,2) CHECK >0, status CHECK pendente/paga/perdoada, justificativa_perdao text nullable, id_bibliotecario_baixa FK nullable, data_baixa nullable, timestamps, UNIQUE(id_item_emprestimo,motivo), CHECK perdoada requires justificativa) in `backend/database/migrations/`

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Domain objects, models, repositories, service, resources. MUST complete before any user story.

### Domain Objects

- [x] T004 [P] Create MotivoMulta enum (atraso, rabisco, rasgo, dobra) and StatusMulta enum (pendente, paga, perdoada) in `backend/app/Domain/Multa/MotivoMulta.php` and `backend/app/Domain/Multa/StatusMulta.php`
- [x] T005 [P] Create StatusMultaTransition (pendente→paga, pendente→perdoada allowed; all others blocked) following StatusTransition pattern in `backend/app/Domain/Multa/StatusMultaTransition.php`
- [x] T006 [P] Create MultaDuplicadaException and TransicaoMultaInvalidaException extending DomainException in `backend/app/Domain/Exceptions/`

### Models

- [x] T007 [P] Create Emprestimo model (belongsTo Usuario, hasMany ItemEmprestimo, timestamps) in `backend/app/Models/Emprestimo.php`
- [x] T008 [P] Create ItemEmprestimo model (belongsTo Emprestimo, belongsTo Exemplar, hasMany Multa, timestamps) in `backend/app/Models/ItemEmprestimo.php`
- [x] T009 [P] Create Multa model (AuditableTrait, belongsTo ItemEmprestimo, belongsTo bibliotecarioBaixa via Usuario, casts for enums, timestamps) in `backend/app/Models/Multa.php`

### Repositories

- [x] T010 [P] Create MultaRepositoryInterface and EloquentMultaRepository (listarPaginado with filters, buscarPorItemEMotivo, buscarPendentesDoUsuario, resumoPendentesDoUsuario) in `backend/app/Repositories/Multa/`
- [x] T011 [P] Create ItemEmprestimoRepositoryInterface and EloquentItemEmprestimoRepository in `backend/app/Repositories/Emprestimo/`

### Service

- [x] T012 Create MultaService with methods: registrar, pagar, pagarEmLote, perdoar, listar, detalhar, listarDoUsuario, resumoDoUsuario, temMultasPendentes (for future emprestimos feature, FR-029) in `backend/app/Services/MultaService.php`

### Resources

- [x] T013 [P] Create MultaResource (id_multa, motivo, valor, status, dates, usuario nested, livro nested, exemplar nested) in `backend/app/Http/Resources/MultaResource.php`
- [x] T014 [P] Create MultaDetalheResource (extends MultaResource with bibliotecario_baixa nested, item_emprestimo details) in `backend/app/Http/Resources/MultaDetalheResource.php`
- [x] T015 [P] Create MultaResumoResource (quantidade_pendente, valor_total_pendente) in `backend/app/Http/Resources/MultaResumoResource.php`

### Frontend Types

- [x] T016 [P] Create TypeScript types (Multa, MultaCreate, MultaDetalhe, MultaResumo, MinhasMultasResponse, MotivoMulta, StatusMulta) in `frontend/src/types/multa.ts`

### Infrastructure

- [x] T017 Register MultaRepository and ItemEmprestimoRepository bindings in `backend/app/Providers/AppServiceProvider.php`
- [x] T018 Create EmprestimoTestSeeder with test emprestimos/itens for smoke testing multas in `backend/database/seeders/EmprestimoTestSeeder.php`

**Checkpoint**: Foundation ready — models, service, repositories, resources available. User story implementation can begin.

---

## Phase 3: US1 — Registrar Multa (Priority: P1) MVP

**Goal**: Bibliotecario can register a fine linked to a loan item

**Independent Test**: POST /multas with valid id_item_emprestimo, motivo, valor → 201 with status=pendente. Duplicate item+motivo → 409. Missing motivo → 422. valor <= 0 → 422.

- [x] T019 [P] [US1] Create MultaCreateRequest (id_item_emprestimo required exists, motivo required in enum, valor required numeric gt:0) in `backend/app/Http/Requests/Multa/MultaCreateRequest.php`
- [x] T020 [US1] Create MultaController with store method (inject MultaService, call registrar, return MultaResource 201) in `backend/app/Http/Controllers/MultaController.php`
- [x] T021 [US1] Add `POST /multas` route with middleware `auth:api, cargo:bibliotecario` in `backend/routes/api.php`
- [x] T022 [P] [US1] Add create function to frontend multas API module in `frontend/src/api/multas.ts`

**Checkpoint**: Multas can be registered via API. Status always starts as pendente.

---

## Phase 4: US2 — Dar Baixa em Multa (Priority: P1)

**Goal**: Bibliotecario can mark a pending fine as paid (individual or batch)

**Independent Test**: PUT /multas/{id}/pagar on pending fine → 200 with status=paga, data_baixa and id_bibliotecario_baixa filled. Already paid → 409. PUT /multas/pagar-lote with id_usuario → 200 paying all pending fines for that user.

- [x] T023 [US2] Add pagar method to MultaController (call MultaService.pagar, return MultaResource) in `backend/app/Http/Controllers/MultaController.php`
- [x] T024 [US2] Add pagarLote method to MultaController (accept id_usuario, call MultaService.pagarEmLote, return array of MultaResource) in `backend/app/Http/Controllers/MultaController.php`
- [x] T025 [US2] Add `PUT /multas/{id}/pagar` and `PUT /multas/pagar-lote` routes with middleware `cargo:bibliotecario` in `backend/routes/api.php`
- [x] T026 [P] [US2] Add pagar and pagarTodas functions to frontend multas API module in `frontend/src/api/multas.ts`

**Checkpoint**: Fines can be paid individually and in batch. Status transitions are irreversible.

---

## Phase 5: US3 — Consultar e Filtrar Multas (Priority: P1)

**Goal**: Bibliotecario can browse fines with search, filters, and view details. Frontend page combines register, pay, and list.

**Independent Test**: GET /multas → paginated list. Filter by status=pendente → only pending. Filter by id_usuario → only that user's fines. GET /multas/{id} → detail with relationships. Frontend: navigate to /multas, see DataTable with filters, register fine via modal, pay fine via action button.

- [ ] T027 [P] [US3] Create MultaIndexRequest (status optional in enum, motivo optional in enum, id_usuario optional integer, q optional string, de/ate optional date) in `backend/app/Http/Requests/Multa/MultaIndexRequest.php`
- [ ] T028 [US3] Add index method (paginated list with filters via MultaService.listar) and show method (detail via MultaService.detalhar) to MultaController in `backend/app/Http/Controllers/MultaController.php`
- [ ] T029 [US3] Add `GET /multas` and `GET /multas/{id}` routes with middleware `cargo:bibliotecario` in `backend/routes/api.php`
- [ ] T030 [P] [US3] Add list and get functions to frontend multas API module in `frontend/src/api/multas.ts`
- [ ] T031 [US3] Create MultasPage with PageHeader, filter bar (SearchInput for usuario/livro, Select for status, Select for motivo, date inputs de/ate), DataTable (usuario, livro, motivo, valor with StatusBadge, status with StatusBadge, data, acoes), "Registrar Multa" modal, "Dar Baixa" action button per row, "Pagar Todas" batch button, pagination in `frontend/src/features/multas/MultasPage.tsx`
- [ ] T032 [US3] Add `/multas` route (bibliotecario only) and "Multas" Sidebar nav item with Lucide `Receipt` icon in `frontend/src/routes.tsx` and `frontend/src/components/layout/AppShell.tsx`

**Checkpoint**: Full multas management page functional. Bibliotecario can register, pay, list, and filter fines.

---

## Phase 6: US4 — Notificacoes In-App (Priority: P2)

**Goal**: Leitor sees a notification badge in Topbar when they have pending fines

**Independent Test**: Register a fine for a leitor. Login as leitor → badge shows count in Topbar. Pay the fine as bibliotecario. Leitor refreshes → badge disappears.

- [ ] T033 [P] [US4] Create MinhasMultasController with resumo method (call MultaService.resumoDoUsuario for authenticated user, return MultaResumoResource) in `backend/app/Http/Controllers/MinhasMultasController.php`
- [ ] T034 [US4] Add `GET /minhas-multas/resumo` route with middleware `auth:api` (no cargo restriction) in `backend/routes/api.php`
- [ ] T035 [P] [US4] Create minhas-multas API module with getResumo function in `frontend/src/api/minhas-multas.ts`
- [ ] T036 [P] [US4] Create useMultasPendentes hook (calls getResumo on mount, exposes quantidade and valorTotal, refetch on navigation) in `frontend/src/hooks/useMultasPendentes.ts`
- [ ] T037 [US4] Create NotificationBadge component (bell icon with count badge, click navigates to /minhas-multas, shows "Pagamento presencial com bibliotecario" tooltip) and integrate into Topbar in AppShell for leitor role in `frontend/src/components/layout/NotificationBadge.tsx` and `frontend/src/components/layout/AppShell.tsx`

**Checkpoint**: Leitor sees badge with pending fine count after login. Badge updates when fines are paid.

---

## Phase 7: US5 — Leitor Consulta Suas Multas (Priority: P2)

**Goal**: Leitor can view their own fines in a read-only page with total pending amount

**Independent Test**: Login as leitor with pending and paid fines. Navigate to /minhas-multas → see all own fines with details. Total pendente highlighted. No edit/pay buttons. Cannot see other users' fines.

- [ ] T038 [US5] Add index method to MinhasMultasController (call MultaService.listarDoUsuario for authenticated user, paginated, return MinhasMultasResponse with data + pagination + resumo) in `backend/app/Http/Controllers/MinhasMultasController.php`
- [ ] T039 [US5] Add `GET /minhas-multas` route with middleware `auth:api` (no cargo restriction, optional status filter) in `backend/routes/api.php`
- [ ] T040 [P] [US5] Add list function to frontend minhas-multas API module in `frontend/src/api/minhas-multas.ts`
- [ ] T041 [US5] Create MinhasMultasPage with PageHeader, MetricCard showing valor total pendente, DataTable (livro, motivo, valor, StatusBadge status, data de registro, data_baixa), "Pagamento presencial" info banner, pagination, read-only (no action buttons) in `frontend/src/features/minhas-multas/MinhasMultasPage.tsx`
- [ ] T042 [US5] Add `/minhas-multas` route (leitor + bibliotecario) and "Minhas Multas" Sidebar nav item with Lucide `AlertCircle` icon for leitor role in `frontend/src/routes.tsx` and `frontend/src/components/layout/AppShell.tsx`

**Checkpoint**: Leitor can see all own fines with total pending. Page is read-only. Bibliotecario cannot access this page (uses /multas instead).

---

## Phase 8: US6 — Perdoar Multa (Priority: P3)

**Goal**: Bibliotecario can forgive a pending fine with mandatory justification

**Independent Test**: PUT /multas/{id}/perdoar with justificativa → 200 with status=perdoada. Without justificativa → 422. Already paid/forgiven → 409. Leitor notification updates.

- [ ] T043 [P] [US6] Create MultaPerdoarRequest (justificativa required string min:1 max:1000) in `backend/app/Http/Requests/Multa/MultaPerdoarRequest.php`
- [ ] T044 [US6] Add perdoar method to MultaController (call MultaService.perdoar, return MultaResource) in `backend/app/Http/Controllers/MultaController.php`
- [ ] T045 [US6] Add `PUT /multas/{id}/perdoar` route with middleware `cargo:bibliotecario` in `backend/routes/api.php`
- [ ] T046 [P] [US6] Add perdoar function to frontend multas API module in `frontend/src/api/multas.ts`
- [ ] T047 [US6] Add perdoar modal with justificativa Textarea field (required) and confirmation button to MultasPage in `frontend/src/features/multas/MultasPage.tsx`

**Checkpoint**: Bibliotecario can forgive fines with justification. Forgiven fines disappear from leitor notifications.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Tests and final validation

- [ ] T048 [P] Write backend feature tests for MultaController (store, pagar, pagarLote, perdoar, index, show; validation errors, duplicates, status transitions, authorization) in `backend/tests/Feature/MultaControllerTest.php`
- [ ] T049 [P] Write backend feature tests for MinhasMultasController (resumo, index; scoped to authenticated user, no cross-user leakage, cargo restrictions) in `backend/tests/Feature/MinhasMultasControllerTest.php`
- [ ] T050 [P] Write frontend Vitest + RTL test for MultasPage (render, filter, register modal, pagar action, perdoar modal) in `frontend/__tests__/features/multas/MultasPage.test.tsx`
- [ ] T051 Run quickstart.md smoke test validation (full flow: register fine → list → pay → batch pay → forgive → leitor notification → leitor view)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundation (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundation phase completion
  - US1 (Registrar): Can start independently after Foundation
  - US2 (Dar Baixa): Depends on US1 (needs multa to exist for paying)
  - US3 (Consultar): Depends on US1+US2 (frontend page uses all endpoints)
  - US4 (Notificacoes): Can start independently after Foundation (backend only needs models)
  - US5 (Leitor Consulta): Depends on US4 (shares MinhasMultasController)
  - US6 (Perdoar): Can start independently after Foundation; frontend depends on US3 (adds modal to MultasPage)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Registrar)**: Independent — first to implement
- **US2 (Dar Baixa)**: Soft dependency on US1 (needs registered multa to pay)
- **US3 (Consultar)**: Soft dependency on US1+US2 (frontend page uses all three endpoints)
- **US4 (Notificacoes)**: Independent backend; frontend depends on Foundation
- **US5 (Leitor Consulta)**: Depends on US4 (shares controller)
- **US6 (Perdoar)**: Independent backend; frontend adds modal to US3's MultasPage

### Within Each User Story

- FormRequests before Controllers
- Controllers before Routes
- Backend before Frontend API modules
- Frontend API modules before Frontend pages
- All stories share: MultaService, MultaRepository, Multa model, MultaResource

### Parallel Opportunities

- All Foundation domain/model/repo tasks (T004-T011, T013-T016) run in parallel
- US4 backend (T033-T034) can run in parallel with US1-US3 implementation
- US6 backend (T043-T045) can run in parallel with US4-US5
- All Polish tests (T048-T050) run in parallel

---

## Parallel Example: Foundation Phase

```bash
# Launch all domain objects together:
Task: "Create MotivoMulta and StatusMulta enums"
Task: "Create StatusMultaTransition"
Task: "Create domain exceptions"

# Launch all models together:
Task: "Create Emprestimo model"
Task: "Create ItemEmprestimo model"
Task: "Create Multa model"

# Launch all repos + resources + types together:
Task: "Create MultaRepository"
Task: "Create ItemEmprestimoRepository"
Task: "Create MultaResource"
Task: "Create MultaDetalheResource"
Task: "Create MultaResumoResource"
Task: "Create frontend types"
```

## Parallel Example: Independent Phases

```bash
# After Foundation, these can run in parallel:
Task: "US1 — Register fine (backend)"
Task: "US4 — Notification badge (backend)"
Task: "US6 — Forgive fine (backend)"
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Complete Phase 1: Setup (migrations)
2. Complete Phase 2: Foundation (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 — Registrar Multa
4. Complete Phase 4: US2 — Dar Baixa
5. Complete Phase 5: US3 — Consultar e Filtrar
6. **STOP and VALIDATE**: Bibliotecario can register, pay, and browse fines end-to-end
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundation → Framework ready
2. US1 (Registrar) → Fines can be created
3. US2 (Dar Baixa) → Fines can be paid (individual + batch)
4. US3 (Consultar) → Full management page (MVP!)
5. US4 (Notificacoes) → Leitor sees badge
6. US5 (Leitor Consulta) → Leitor sees detail page
7. US6 (Perdoar) → Administrative forgiveness
8. Polish → Tests + smoke test validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundation together
2. Once Foundation is done:
   - Developer A: US1 (Register) → US2 (Pay) → US3 (List page)
   - Developer B: US4 (Notifications) → US5 (Leitor page)
   - Developer C: US6 (Forgive) → Polish (tests)
3. Each story integrates independently via shared MultaService and routes

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Backend follows Controller → Service → Repository → Model pattern
- Frontend follows existing patterns from spec 003 (API modules, feature pages, hooks)
- Emprestimos tables are minimal schema — CRUD de emprestimos sera feature separada
- Notificacao is not a separate entity — derived from pending multas query
- Batch payment (FR-012a) via PUT /multas/pagar-lote endpoint
- Bloqueio de emprestimos (FR-029) via MultaService.temMultasPendentes method
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
