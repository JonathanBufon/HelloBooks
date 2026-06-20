# Tasks: Frontend — Catalogo e Shell

**Input**: Design documents from `specs/003-frontend-catalogo/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Included for critical components as specified in the feature spec ("cobrir com Vitest + RTL os componentes criticos").

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `frontend/src/` for source, `frontend/__tests__/` for tests

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold Vite + React + TypeScript project and configure development environment

- [ ] T001 Scaffold Vite + React 18 + TypeScript project in `frontend/` (index.html, package.json, tsconfig.json, vite-env.d.ts)
- [ ] T002 Install dependencies: react-router-dom, axios, lucide-react; dev: vitest, @testing-library/react, @testing-library/jest-dom, jsdom
- [ ] T003 [P] Configure `frontend/vite.config.ts` with React plugin, dev proxy to `localhost:8015`, and Vitest integration
- [ ] T004 [P] Copy CSS token files from `Hello_Books_Design_System/tokens/` to `frontend/src/styles/` and create `frontend/src/styles/global.css` with base reset
- [ ] T005 [P] Create TypeScript type definitions in `frontend/src/types/api.ts` (Livro, LivroDetalhe, Exemplar, Autor, Editora, Categoria, Pagination, PaginatedResponse, DashboardStats, LogEntry, ApiError) and `frontend/src/types/auth.ts` (LoginRequest, LoginResponse, Usuario, Cargo, AuthState)

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Port DS components, create core infrastructure. MUST complete before any user story.

### DS Component Porting (JSX → TSX with inline styles + CSS custom properties)

Reference: `frontend/Hello_Books_Design_System/components/` (source JSX + .d.ts interfaces)

- [ ] T006 [P] Port Button and IconButton to `frontend/src/components/ds/actions/Button.tsx` and `IconButton.tsx`
- [ ] T007 [P] Port TextInput, Textarea, Select, Checkbox, Switch, SearchInput to `frontend/src/components/ds/forms/`
- [ ] T008 [P] Port DataTable, MetricCard, Badge, StatusBadge, Tag, Avatar to `frontend/src/components/ds/data/`
- [ ] T009 [P] Port Card, CardHeader, PageHeader to `frontend/src/components/ds/layout/`
- [ ] T010 [P] Port Modal and Toast to `frontend/src/components/ds/feedback/`
- [ ] T011 [P] Port BookCard and BookCover to `frontend/src/components/ds/library/`
- [ ] T012 [P] Port Sidebar, SidebarItem, Topbar to `frontend/src/components/ds/navigation/`

### Core Infrastructure

- [ ] T013 [P] Create Axios client with JWT interceptors (request: attach Bearer from localStorage/sessionStorage; response 401: clear token, redirect to /login) in `frontend/src/api/client.ts`
- [ ] T014 [P] Create AuthContext and AuthProvider with login/logout, localStorage vs sessionStorage per "Lembrar de mim", and loading state in `frontend/src/hooks/useAuth.ts`
- [ ] T015 [P] Create ToastContext and ToastProvider with showSuccess/showError/showInfo/showWarning and auto-dismiss in `frontend/src/hooks/useToast.ts`
- [ ] T016 [P] Create usePagination hook (page, totalPages, hasNext, hasPrev, goToPage, nextPage, prevPage) in `frontend/src/hooks/usePagination.ts`
- [ ] T017 [P] Create auth API module (login, logout, refresh, me) in `frontend/src/api/auth.ts`
- [ ] T018 Create ProtectedRoute component with auth check and role-based guard (bibliotecario vs leitor redirect) in `frontend/src/components/layout/ProtectedRoute.tsx`
- [ ] T019 Create AppShell component (Sidebar with role-filtered nav items + Topbar with global search redirect to /catalogo?q= + scrollable main area with Outlet) in `frontend/src/components/layout/AppShell.tsx`
- [ ] T020 Create route definitions (public: /login; protected: /, /catalogo, /catalogo/:id, /catalogo/novo, /catalogo/:id/editar, /autores, /editoras, /categorias, /usuarios, /auditoria) with role guards in `frontend/src/routes.tsx`
- [ ] T021 Create app entry point with AuthProvider, ToastProvider, RouterProvider, token CSS imports in `frontend/src/main.tsx`

**Checkpoint**: Foundation ready — `npm run dev` loads and shows login page. All DS components available for use.

---

## Phase 3: US1 — Login (Priority: P1) MVP

**Goal**: User can authenticate and access the system

**Independent Test**: Navigate to /login, enter credentials, submit → redirects to Dashboard. Invalid credentials show inline error. "Lembrar de mim" persists session across browser restart.

- [ ] T022 [US1] Create LoginPage with two-column layout (institutional purple panel + form), email/password fields, "Lembrar de mim" checkbox, inline error display, POST /auth/login integration, redirect to Dashboard on success in `frontend/src/features/auth/LoginPage.tsx`

**Checkpoint**: Login flow works end-to-end against backend

---

## Phase 4: US2 — Dashboard (Priority: P1)

**Goal**: Bibliotecario sees operational overview after login

**Independent Test**: After login, / shows 4 MetricCards with live data from GET /dashboard/stats, recent books list, recent activity feed, and quick action buttons.

- [ ] T023 [P] [US2] Create dashboard API module (getStats) in `frontend/src/api/dashboard.ts`
- [ ] T024 [US2] Create DashboardPage with PageHeader, 4 MetricCards (total livros, disponiveis, emprestados, manutencao), "Novas Aquisicoes" card (last 5 books with BookCover), "Atividade Recente" card (last 10 log entries), "Acoes Rapidas" card (shortcut buttons) in `frontend/src/features/dashboard/DashboardPage.tsx`

**Checkpoint**: Dashboard displays real data from API; placeholder zeros for future features

---

## Phase 5: US3 — Catalogo Lista (Priority: P1)

**Goal**: User can browse the book catalog with search, filters, and grid/table toggle

**Independent Test**: Navigate to /catalogo, see book list. Toggle between grid (BookCards) and table (DataTable). Search by title/author/ISBN. Filter by category. Pagination works in both modes. Empty state shown when no books.

- [ ] T025 [P] [US3] Create livros API module (list, get, create, update, delete) in `frontend/src/api/catalog/livros.ts`
- [ ] T026 [P] [US3] Create categorias API module (list, get, create, update, delete) in `frontend/src/api/catalog/categorias.ts`
- [ ] T027 [US3] Create CatalogoListaPage with PageHeader ("Cadastrar Livro" → /catalogo/novo), filter bar (SearchInput + category Select + status Select + grid/table toggle), BookCard grid mode, DataTable table mode, pagination, empty state, spinner loading in `frontend/src/features/catalog/CatalogoListaPage.tsx`

**Checkpoint**: Catalog browsing fully functional with both view modes

---

## Phase 6: US4 — Catalogo Detalhe e Exemplares (Priority: P2)

**Goal**: User can view book details and manage exemplars

**Independent Test**: Navigate to /catalogo/:id, see book metadata (title, ISBN, year, publisher, authors as Tags, categories as Tags), exemplar count badges (4 statuses), exemplar DataTable with status/condition badges and edit/remove actions. "Registrar Exemplares" opens modal with quantity field. Exemplar status/condition editable via modal.

- [ ] T028 [P] [US4] Create exemplares API module (listByLivro, create, update, delete) in `frontend/src/api/catalog/exemplares.ts`
- [ ] T029 [US4] Create CatalogoDetalhePage with PageHeader + breadcrumb, book metadata display, exemplar count MetricCards/badges, exemplar DataTable (codigo, StatusBadge status, StatusBadge condicao, date, actions), "Editar Livro" button (→ /catalogo/:id/editar), "Registrar Exemplares" modal (quantity field, POST), exemplar edit modal (status + condicao selects, PUT), exemplar delete confirmation modal (DELETE) in `frontend/src/features/catalog/CatalogoDetalhePage.tsx`

**Checkpoint**: Book detail page shows all data; exemplar CRUD works via modals

---

## Phase 7: US5 — Cadastrar/Editar Livro (Priority: P2)

**Goal**: Bibliotecario can create and edit books with full form

**Independent Test**: Navigate to /catalogo/novo, fill form (title, ISBN, year, publisher select, multi-select authors, multi-select categories), submit → creates book, shows toast, redirects to detail. Navigate to /catalogo/:id/editar → form pre-filled. Inline creation of new author/publisher/category via mini modal. Validation errors shown inline (400, 409 ISBN duplicate).

- [ ] T030 [P] [US5] Create autores API module (list, get, create, update, delete) in `frontend/src/api/catalog/autores.ts`
- [ ] T031 [P] [US5] Create editoras API module (list, get, create, update, delete) in `frontend/src/api/catalog/editoras.ts`
- [ ] T032 [US5] Create CadastrarLivroPage with PageHeader + breadcrumb, form fields (titulo TextInput, isbn TextInput with 10-13 validation, ano_publicacao number input, editora Select loaded from GET /editoras, autores multi-select from GET /autores with "Criar novo" mini modal, categorias multi-select from GET /categorias with "Criar novo" mini modal), inline error display (400/409), toast on success, POST /livros, redirect to /catalogo/:id on success in `frontend/src/features/catalog/CadastrarLivroPage.tsx`
- [ ] T033 [US5] Create EditarLivroPage that loads book data via GET /livros/:id, pre-fills the same form as CadastrarLivroPage, submits via PUT /livros/:id, shows validation errors, toast on success, redirect to /catalogo/:id in `frontend/src/features/catalog/EditarLivroPage.tsx`

**Checkpoint**: Full book create/edit cycle works with inline entity creation

---

## Phase 8: US6 — Autores, Editoras, Categorias (Priority: P2)

**Goal**: Bibliotecario can manage auxiliary catalog entities

**Independent Test**: Navigate to /autores → DataTable with name, date, actions. "Cadastrar Autor" opens modal with name field. Edit opens modal with pre-filled name. Delete shows confirmation modal. 409 error (author has books) shown as toast. Same pattern for /editoras and /categorias. Pagination + search work.

- [ ] T034 [P] [US6] Create AutoresPage with PageHeader, DataTable (nome, created_at, acoes), "Cadastrar Autor" button → modal with nome field, edit modal, delete confirmation modal, 409 toast, pagination, search in `frontend/src/features/catalog-aux/AutoresPage.tsx`
- [ ] T035 [P] [US6] Create EditorasPage (same structure as AutoresPage, adapted for editoras) in `frontend/src/features/catalog-aux/EditorasPage.tsx`
- [ ] T036 [P] [US6] Create CategoriasPage (same structure as AutoresPage, adapted for categorias, with 409 for duplicate name) in `frontend/src/features/catalog-aux/CategoriasPage.tsx`

**Checkpoint**: All three auxiliary CRUD pages functional and independently testable

---

## Phase 9: US7 — Usuarios (Priority: P3)

**Goal**: Bibliotecario can manage system user accounts

**Independent Test**: Navigate to /usuarios → DataTable with name, email, cargo Badge, date, actions. "Cadastrar Usuario" opens modal with nome, email, senha, cargo Select. Edit modal (senha optional). Delete confirmation. 409 for self-deletion or user in use shown as toast. Pagination + search.

- [ ] T037 [P] [US7] Create usuarios API module (list, get, create, update, delete) in `frontend/src/api/usuarios.ts`
- [ ] T038 [US7] Create UsuariosPage with PageHeader, DataTable (nome, email, cargo Badge, created_at, acoes), "Cadastrar Usuario" button → modal (nome_completo, email, senha, cargo Select, endereco optional), edit modal (senha optional), delete confirmation modal, 409 toasts, pagination, search in `frontend/src/features/usuarios/UsuariosPage.tsx`

**Checkpoint**: User management fully functional

---

## Phase 10: US8 — Auditoria (Priority: P3)

**Goal**: Bibliotecario can view system activity logs

**Independent Test**: Navigate to /auditoria → DataTable with data/hora, usuario, acao, entidade, ID registro. Filters: entity Select, action Select, date range inputs (de/ate), user search. Read-only. Pagination works.

- [ ] T039 [P] [US8] Create logs API module (list with filters: entidade, acao, id_usuario, de, ate) in `frontend/src/api/logs.ts`
- [ ] T040 [US8] Create LogsPage with PageHeader, filter bar (entidade Select, acao Select, date inputs de/ate, user search), DataTable (data_hora, usuario.nome_completo, acao_realizada, entidade_afetada, id_registro_afetado), pagination, read-only in `frontend/src/features/auditoria/LogsPage.tsx`

**Checkpoint**: Audit log viewing with all filters functional

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Tests for critical components and final validation

- [ ] T041 [P] Write Vitest + RTL tests for Button, DataTable, Modal components in `frontend/__tests__/components/ds/`
- [ ] T042 [P] Write Vitest + RTL tests for useAuth hook (login, logout, token storage, role check) in `frontend/__tests__/hooks/useAuth.test.ts`
- [ ] T043 [P] Write Vitest + RTL test for LoginPage (render, submit, error display, redirect) in `frontend/__tests__/features/auth/LoginPage.test.tsx`
- [ ] T044 [P] Write Vitest + RTL test for CatalogoListaPage (render, grid/table toggle, search, pagination) in `frontend/__tests__/features/catalog/CatalogoListaPage.test.tsx`
- [ ] T045 Run quickstart.md smoke test validation (full flow: login → dashboard → catalog → detail → create book → edit → auxiliaries → users → audit logs)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundation (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phases 3-10)**: All depend on Foundation phase completion
  - US1 (Login): Can start independently after Foundation
  - US2 (Dashboard): Can start independently after Foundation
  - US3 (Catalogo Lista): Can start independently after Foundation
  - US4 (Detalhe/Exemplares): Can start independently after Foundation
  - US5 (Cadastrar/Editar): Can start independently after Foundation; creates autores.ts and editoras.ts API modules used by US6
  - US6 (Autores/Editoras/Categorias): Depends on US5 for autores.ts and editoras.ts API modules (or run concurrently if API modules are extracted to Foundation)
  - US7 (Usuarios): Can start independently after Foundation
  - US8 (Auditoria): Can start independently after Foundation
- **Polish (Phase 11)**: Depends on at least US1 + US3 for meaningful test coverage

### User Story Dependencies

- **US1 (Login)**: Independent — first to implement for end-to-end auth flow
- **US2 (Dashboard)**: Independent — uses only Foundation components + own API module
- **US3 (Catalogo Lista)**: Independent — creates livros.ts and categorias.ts
- **US4 (Detalhe/Exemplares)**: Soft dependency on US3 (reuses livros.ts); creates exemplares.ts
- **US5 (Cadastrar/Editar)**: Soft dependency on US3 (reuses livros.ts, categorias.ts); creates autores.ts, editoras.ts
- **US6 (Auxiliares)**: Reuses autores.ts and editoras.ts from US5; reuses categorias.ts from US3
- **US7 (Usuarios)**: Fully independent
- **US8 (Auditoria)**: Fully independent

### Within Each User Story

- API modules before page components
- Page components consume DS components from Foundation
- All stories share: Axios client, AuthContext, ToastContext, usePagination, AppShell

### Parallel Opportunities

- All Setup [P] tasks (T003, T004, T005) run in parallel
- All DS porting tasks (T006-T012) run in parallel
- All core infrastructure tasks (T013-T017) run in parallel
- US2, US3, US7, US8 are fully independent — can run in parallel
- Within US6: all three CRUD pages (T034, T035, T036) run in parallel
- All Polish tests (T041-T044) run in parallel

---

## Parallel Example: Foundation Phase

```bash
# Launch all DS component porting tasks together:
Task: "Port Button and IconButton to frontend/src/components/ds/actions/"
Task: "Port TextInput, Textarea, Select, Checkbox, Switch, SearchInput to frontend/src/components/ds/forms/"
Task: "Port DataTable, MetricCard, Badge, StatusBadge, Tag, Avatar to frontend/src/components/ds/data/"
Task: "Port Card, CardHeader, PageHeader to frontend/src/components/ds/layout/"
Task: "Port Modal and Toast to frontend/src/components/ds/feedback/"
Task: "Port BookCard and BookCover to frontend/src/components/ds/library/"
Task: "Port Sidebar, SidebarItem, Topbar to frontend/src/components/ds/navigation/"

# Launch all infrastructure tasks together:
Task: "Create Axios client in frontend/src/api/client.ts"
Task: "Create AuthContext in frontend/src/hooks/useAuth.ts"
Task: "Create ToastContext in frontend/src/hooks/useToast.ts"
Task: "Create usePagination in frontend/src/hooks/usePagination.ts"
Task: "Create auth API module in frontend/src/api/auth.ts"
```

## Parallel Example: Independent User Stories

```bash
# After Foundation, these stories can run simultaneously:
Task: "US2 — DashboardPage"
Task: "US3 — CatalogoListaPage"
Task: "US7 — UsuariosPage"
Task: "US8 — LogsPage"
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundation (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 — Login
4. Complete Phase 4: US2 — Dashboard
5. Complete Phase 5: US3 — Catalogo Lista
6. **STOP and VALIDATE**: Login → Dashboard → Browse catalog works end-to-end
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundation → Framework ready
2. US1 (Login) → Auth works → Can access the system
3. US2 (Dashboard) → Landing page with real data
4. US3 (Catalogo Lista) → Browsing the catalog (MVP!)
5. US4 (Detalhe/Exemplares) → Deep view into books
6. US5 (Cadastrar/Editar) → Full book management
7. US6 (Auxiliares) → Author/publisher/category management
8. US7 (Usuarios) → User administration
9. US8 (Auditoria) → Activity audit trail
10. Polish → Tests + smoke test validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundation together
2. Once Foundation is done:
   - Developer A: US1 (Login) → US5 (Book forms)
   - Developer B: US3 (Catalog list) → US4 (Book detail)
   - Developer C: US2 (Dashboard) → US6 (Auxiliaries) → US7 (Users)
   - Developer D: US8 (Audit) → Polish (tests)
3. Each story integrates independently via shared AppShell and routes

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- DS components are ported from JSX using existing .d.ts interfaces as type source
- All pages use spinner loading state (no skeleton loaders per clarification)
- Sidebar items filtered by cargo (bibliotecario sees all; leitor sees Dashboard + Catalogo)
- "Lembrar de mim" controls localStorage vs sessionStorage for JWT token
- Topbar search redirects to /catalogo?q=<term>
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
