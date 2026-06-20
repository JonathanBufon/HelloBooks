# Tasks: Backend Complementar

**Input**: Design documents from `/specs/002-backend-complementar/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: Required by spec. Create PHPUnit feature tests for each user story before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (`US1`, `US2`, `US3`, `US4`)
- Every task includes an exact repository path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing Laravel backend for the complementary backend feature without altering catalog behavior.

- [X] T001 Review JWT guard and blacklist settings in `backend/config/auth.php` and `backend/config/jwt.php`
- [X] T002 [P] Verify admin seed credentials `biblio@hello.local` / `secret123` in `backend/database/seeders/UsuarioSeeder.php`
- [X] T003 [P] Create feature directories for auth, user, and log requests in `backend/app/Http/Requests/Auth/`, `backend/app/Http/Requests/Usuario/`, and `backend/app/Http/Requests/Log/`
- [X] T004 [P] Create feature test directories in `backend/tests/Feature/Auth/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared contracts, resources, repositories, and domain errors required before user stories can be implemented.

**Critical**: No user story work should begin until this phase is complete.

- [X] T005 [P] Create `UsuarioResource` hiding `senha_hash` in `backend/app/Http/Resources/UsuarioResource.php`
- [X] T006 [P] Create `LogAtividadeResource` with nested executor data in `backend/app/Http/Resources/LogAtividadeResource.php`
- [X] T007 [P] Create `EmailDuplicadoException` with code `EMAIL_DUPLICADO` in `backend/app/Domain/Exceptions/EmailDuplicadoException.php`
- [X] T008 [P] Create `AutoExclusaoException` with code `AUTO_EXCLUSAO_PROIBIDA` in `backend/app/Domain/Exceptions/AutoExclusaoException.php`
- [X] T009 [P] Create `UsuarioRepositoryInterface` in `backend/app/Repositories/UsuarioRepositoryInterface.php`
- [X] T010 Create `EloquentUsuarioRepository` with pagination, lookup, create, update, and delete methods in `backend/app/Repositories/EloquentUsuarioRepository.php`
- [X] T011 [P] Create `LogRepositoryInterface` in `backend/app/Repositories/LogRepositoryInterface.php`
- [X] T012 Create `EloquentLogRepository` with paginated filters and recent activity query in `backend/app/Repositories/EloquentLogRepository.php`
- [X] T013 Register usuario and log repository bindings in `backend/app/Providers/AppServiceProvider.php`

**Checkpoint**: Shared resources and repositories are ready for all user stories.

---

## Phase 3: User Story 1 - Autenticar no sistema (Priority: P0) MVP

**Goal**: Bibliotecario can login, logout, refresh the JWT, and inspect the authenticated user.

**Independent Test**: `POST /api/v1/auth/login` returns a bearer token for `biblio@hello.local` / `secret123`; `GET /api/v1/auth/me` succeeds with the token; logout invalidates the token and subsequent authenticated requests return 401.

### Tests for User Story 1

- [ ] T014 [US1] Write login success and invalid credential tests in `backend/tests/Feature/Auth/AuthTest.php`
- [ ] T015 [US1] Write logout, refresh, and me endpoint tests in `backend/tests/Feature/Auth/AuthTest.php`

### Implementation for User Story 1

- [ ] T016 [P] [US1] Create `LoginRequest` validating `email` and `senha` in `backend/app/Http/Requests/Auth/LoginRequest.php`
- [ ] T017 [US1] Implement `AuthService` using jwt-auth login, invalidate, refresh, and me flows in `backend/app/Services/Auth/AuthService.php`
- [ ] T018 [US1] Implement `AuthController` responses with `token`, `token_type`, `expires_in`, and `usuario` in `backend/app/Http/Controllers/Auth/AuthController.php`
- [ ] T019 [US1] Add public `/api/v1/auth/login` route and protected logout, refresh, me routes in `backend/routes/api.php`
- [ ] T020 [US1] Run and satisfy auth feature tests in `backend/tests/Feature/Auth/AuthTest.php`

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Gerenciar usuarios (Priority: P1)

**Goal**: Bibliotecario can list, create, inspect, update, and delete users using existing `usuarios` fields.

**Independent Test**: With a valid bibliotecario token, `/api/v1/usuarios` supports pagination and search, create rejects duplicate email, update can change optional `senha`, delete blocks self-deletion, and responses never expose `senha_hash`.

### Tests for User Story 2

- [ ] T021 [US2] Write user listing and detail tests in `backend/tests/Feature/UsuarioTest.php`
- [ ] T022 [US2] Write user create, duplicate email, and password hashing tests in `backend/tests/Feature/UsuarioTest.php`
- [ ] T023 [US2] Write user update, delete, self-delete, 401, and 403 tests in `backend/tests/Feature/UsuarioTest.php`

### Implementation for User Story 2

- [ ] T024 [P] [US2] Create `UsuarioIndexRequest` for `page`, `per_page`, and `q` in `backend/app/Http/Requests/Usuario/UsuarioIndexRequest.php`
- [ ] T025 [P] [US2] Create `UsuarioCreateRequest` for `nome_completo`, `email`, `senha`, `cargo`, and `endereco` in `backend/app/Http/Requests/Usuario/UsuarioCreateRequest.php`
- [ ] T026 [P] [US2] Create `UsuarioUpdateRequest` with optional `senha` in `backend/app/Http/Requests/Usuario/UsuarioUpdateRequest.php`
- [ ] T027 [US2] Implement `UsuarioService` duplicate email, password hashing, update, delete, and self-delete rules in `backend/app/Services/UsuarioService.php`
- [ ] T028 [US2] Implement `UsuarioController` CRUD actions and resources in `backend/app/Http/Controllers/UsuarioController.php`
- [ ] T029 [US2] Add protected `/api/v1/usuarios` CRUD routes with `auth:api` and `cargo:bibliotecario` in `backend/routes/api.php`
- [ ] T030 [US2] Run and satisfy usuario feature tests in `backend/tests/Feature/UsuarioTest.php`

**Checkpoint**: User Story 2 is independently functional after authentication.

---

## Phase 5: User Story 3 - Visualizar metricas no dashboard (Priority: P2)

**Goal**: Bibliotecario can fetch a single aggregate stats payload for dashboard cards, recent books, and recent activity.

**Independent Test**: With a valid bibliotecario token, `/api/v1/dashboard/stats` returns all counts, `exemplares_por_status`, five recent books with authors, ten recent log entries, and zero/empty values when no data exists.

### Tests for User Story 3

- [ ] T031 [US3] Write dashboard populated data tests in `backend/tests/Feature/DashboardTest.php`
- [ ] T032 [US3] Write dashboard empty database and 401/403 tests in `backend/tests/Feature/DashboardTest.php`

### Implementation for User Story 3

- [ ] T033 [P] [US3] Create `DashboardStatsResource` response formatter in `backend/app/Http/Resources/DashboardStatsResource.php`
- [ ] T034 [US3] Implement `DashboardService` aggregate queries for catalog counts, exemplar status counts, recent books, users, and activity in `backend/app/Services/DashboardService.php`
- [ ] T035 [US3] Implement `DashboardController` stats action in `backend/app/Http/Controllers/DashboardController.php`
- [ ] T036 [US3] Add protected `/api/v1/dashboard/stats` route in `backend/routes/api.php`
- [ ] T037 [US3] Run and satisfy dashboard feature tests in `backend/tests/Feature/DashboardTest.php`

**Checkpoint**: User Story 3 is independently functional after authentication.

---

## Phase 6: User Story 4 - Consultar log de auditoria (Priority: P2)

**Goal**: Bibliotecario can inspect paginated audit logs with filters for entity, action, user, and date range.

**Independent Test**: With a valid bibliotecario token, `/api/v1/logs` returns logs ordered by `data_hora DESC`, includes executor data, applies each filter, and rejects unauthenticated or non-bibliotecario access.

### Tests for User Story 4

- [ ] T038 [US4] Write log listing and ordering tests in `backend/tests/Feature/LogTest.php`
- [ ] T039 [US4] Write log filter, pagination, 401, and 403 tests in `backend/tests/Feature/LogTest.php`

### Implementation for User Story 4

- [ ] T040 [P] [US4] Create `LogIndexRequest` validating filters in `backend/app/Http/Requests/Log/LogIndexRequest.php`
- [ ] T041 [US4] Implement filtered log pagination using `LogRepositoryInterface` in `backend/app/Http/Controllers/LogController.php`
- [ ] T042 [US4] Add protected `/api/v1/logs` route in `backend/routes/api.php`
- [ ] T043 [US4] Run and satisfy log feature tests in `backend/tests/Feature/LogTest.php`

**Checkpoint**: User Story 4 is independently functional after authentication.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Align contracts, documentation, formatting, and smoke validation across the whole feature.

- [ ] T044 [P] Update OpenAPI contract for final implemented error codes and payloads in `specs/002-backend-complementar/contracts/openapi.yaml`
- [ ] T045 [P] Update quickstart smoke commands if route responses changed in `specs/002-backend-complementar/quickstart.md`
- [ ] T046 Run Laravel Pint formatting for changed backend PHP files under `backend/app/` and `backend/tests/`
- [ ] T047 Run full backend feature suite covering auth, users, dashboard, logs, and catalog regressions from `backend/tests/Feature/`
- [ ] T048 Validate quickstart smoke flow end-to-end using `specs/002-backend-complementar/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational; can be implemented independently after auth is available for manual testing.
- **Polish (Phase 7)**: Depends on desired user stories being complete.

### User Story Dependencies

- **US1 (P0) - Auth**: Starts after Foundational; MVP and practical prerequisite for exercising protected routes.
- **US2 (P1) - Usuarios**: Starts after Foundational; uses auth middleware and shared `UsuarioResource`/repository.
- **US3 (P2) - Dashboard**: Starts after Foundational; protected by auth/cargo and reads catalog/user/log data.
- **US4 (P2) - Logs**: Starts after Foundational; protected by auth/cargo and reads existing `logs_atividades`.

### Within Each User Story

- Write feature tests first and confirm they fail.
- Implement FormRequests and resources before services/controllers where applicable.
- Implement services/repositories before endpoints.
- Add routes last for the story.
- Run the story-specific test file before moving to the next story.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel after T001.
- T005, T006, T007, T008, T009, and T011 can run in parallel during Foundational.
- US2, US3, and US4 can be staffed in parallel after Foundational, but manual smoke testing is easiest after US1.
- Test files for different stories can be written in parallel, but tasks editing the same test file within a story should run sequentially.
- FormRequest/resource tasks in different stories can run in parallel because they touch different files.

---

## Parallel Example: User Story 2

```bash
Task: "Write user listing and detail tests in backend/tests/Feature/UsuarioTest.php"
Task: "Create UsuarioIndexRequest in backend/app/Http/Requests/Usuario/UsuarioIndexRequest.php"
Task: "Create UsuarioCreateRequest in backend/app/Http/Requests/Usuario/UsuarioCreateRequest.php"
Task: "Create UsuarioUpdateRequest in backend/app/Http/Requests/Usuario/UsuarioUpdateRequest.php"
```

## Parallel Example: User Story 3

```bash
Task: "Write dashboard populated data tests in backend/tests/Feature/DashboardTest.php"
Task: "Write dashboard empty database and 401/403 tests in backend/tests/Feature/DashboardTest.php"
Task: "Create DashboardStatsResource in backend/app/Http/Resources/DashboardStatsResource.php"
```

## Parallel Example: User Story 4

```bash
Task: "Write log listing and ordering tests in backend/tests/Feature/LogTest.php"
Task: "Write log filter, pagination, 401, and 403 tests in backend/tests/Feature/LogTest.php"
Task: "Create LogIndexRequest in backend/app/Http/Requests/Log/LogIndexRequest.php"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate auth independently with `backend/tests/Feature/Auth/AuthTest.php` and quickstart login/me/logout smoke commands.

### Incremental Delivery

1. Setup + Foundational establishes shared resources, repositories, and exceptions.
2. Deliver US1 auth first because protected routes depend on it for manual verification.
3. Deliver US2 usuarios as the main administrative CRUD increment.
4. Deliver US3 dashboard and US4 logs in either order after US1, because both are read-only protected endpoints.
5. Run polish tasks after all selected stories are complete.

### Validation Commands

```bash
docker compose exec backend php artisan test --filter=Auth
docker compose exec backend php artisan test --filter=Usuario
docker compose exec backend php artisan test --filter=Dashboard
docker compose exec backend php artisan test --filter=Log
docker compose exec backend ./vendor/bin/pint --test
```

---

## Notes

- No migration for `tokens_acesso`; JWT revocation uses the jwt-auth blacklist/cache.
- No new circulation, reservation, fine, member-profile, notification, or report endpoints.
- Do not modify existing catalog endpoint behavior from `001-gestao-catalogo`.
- Preserve `Controller -> Service -> Repository -> Eloquent` layering.
