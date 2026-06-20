# Implementation Plan: Backend Complementar

**Branch**: `002-backend-complementar` | **Date**: 2026-06-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-backend-complementar/spec.md`

## Summary

Completar o backend com os 4 blocos faltantes para o frontend funcionar: (1) autenticacao
JWT (login/logout/refresh/me), (2) CRUD de usuarios, (3) endpoint de dashboard com metricas
agregadas, e (4) leitura paginada de logs de auditoria. A infraestrutura ja existe — JWT
configurado, model `Usuario` com `JWTSubject`, middleware `EnsureCargo`, listener de
auditoria, seeders. O trabalho e criar controllers, services, form requests e resources
seguindo a mesma arquitetura da feature 001.

## Technical Context

**Language/Version**: PHP 8.3

**Primary Dependencies**: Laravel 12, `php-open-source-saver/jwt-auth` v2.9 (ja instalado
e configurado), `doctrine/dbal`, `laravel/pint` (lint).

**Storage**: PostgreSQL 16 (tabelas `usuarios` e `logs_atividades` ja existem). Redis 7
(cache para blacklist de tokens JWT — configuracao padrao do jwt-auth).

**Testing**: PHPUnit 11 com Laravel TestCase. Testes de feature por user story, executando
contra PostgreSQL em container.

**Target Platform**: Linux server (Docker Compose para dev local).

**Project Type**: web (monorepo: backend API).

**Performance Goals**: Login em <500ms. Dashboard stats em <1s para ~10k livros.

**Constraints**:
- Contrato REST (Principio I): JSON in/out, OpenAPI em `contracts/`.
- Camadas (Principio II): Controller -> Service -> Repository -> Eloquent.
- Seguranca (Principio III): senhas em hash, JWT com revogacao, logs de atividade.
- Nao alterar endpoints da feature 001.

**Scale/Scope**: ~50 usuarios, ~10k livros. 4 controllers novos, ~15 endpoints.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Avaliacao contra os 5 principios da [Constituicao v1.0.0](../../.specify/memory/constitution.md):

| Principio | Status | Observacao |
|-----------|--------|-----------|
| I. Contrato REST Primeiro | PASS | OpenAPI 3.1 em `contracts/openapi.yaml` define todos os endpoints antes da implementacao. Verbos restritos a GET/POST/PUT/DELETE. Erros em envelope padrao. |
| II. Arquitetura em Camadas | PASS | AuthController, UsuarioController, DashboardController, LogController seguem Controller -> Service -> Repository. Nenhuma regra de negocio em controller. |
| III. Seguranca e Auditabilidade | PASS (com nota) | JWT com blacklist via cache (revogacao imediata). Senhas em hash (cast do Eloquent). Auditoria via listener existente. **Nota**: tabela `tokens_acesso` mencionada na constituicao nao sera criada — blacklist via cache atende o espirito do principio (ver research.md, Decision 1). |
| IV. Integridade Transacional | PASS | Criacao de usuario e atomica (single insert). Dashboard e read-only. Nenhuma mutacao multi-tabela nesta feature. |
| V. Disciplina de Escopo MVP | PASS | Apenas os 4 blocos necessarios para o frontend. Sem circulacao, reservas, multas, membros, relatorios. |

**Verdict**: GATE passa. A nota sobre `tokens_acesso` esta documentada como decisao de
research — nao constitui violacao (o principio exige revogacao, nao uma tabela especifica).

## Project Structure

### Documentation (this feature)

```text
specs/002-backend-complementar/
├── spec.md              # WHAT/WHY
├── plan.md              # Este arquivo (HOW tecnico)
├── research.md          # Phase 0 — decisoes tecnicas
├── data-model.md        # Phase 1 — entidades e schemas
├── quickstart.md        # Phase 1 — setup local e smoke test
├── contracts/
│   └── openapi.yaml     # Contrato REST
└── tasks.md             # Phase 2 — gerado por /speckit-tasks
```

### Source Code (repository root — monorepo)

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   └── AuthController.php
│   │   │   ├── Catalog/          # (existente, nao alterar)
│   │   │   ├── DashboardController.php
│   │   │   ├── UsuarioController.php
│   │   │   └── LogController.php
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   └── LoginRequest.php
│   │   │   └── Usuario/
│   │   │       ├── UsuarioCreateRequest.php
│   │   │       └── UsuarioUpdateRequest.php
│   │   ├── Resources/
│   │   │   ├── UsuarioResource.php
│   │   │   ├── LogAtividadeResource.php
│   │   │   └── DashboardStatsResource.php
│   │   └── Middleware/
│   │       └── EnsureCargo.php    # (existente)
│   ├── Models/
│   │   ├── Usuario.php            # (existente, JWTSubject)
│   │   └── LogAtividade.php       # (existente)
│   ├── Services/
│   │   ├── Auth/
│   │   │   └── AuthService.php
│   │   ├── UsuarioService.php
│   │   └── DashboardService.php
│   ├── Repositories/
│   │   ├── UsuarioRepositoryInterface.php
│   │   ├── EloquentUsuarioRepository.php
│   │   ├── LogRepositoryInterface.php
│   │   └── EloquentLogRepository.php
│   ├── Domain/
│   │   ├── Usuario/
│   │   │   └── CargoUsuario.php   # (existente)
│   │   └── Exceptions/
│   │       ├── AutoExclusaoException.php
│   │       └── EmailDuplicadoException.php
│   └── Listeners/
│       └── AuditarMutacao.php     # (existente)
├── routes/
│   └── api.php                    # Adicionar rotas de auth, usuarios, dashboard, logs
├── tests/
│   └── Feature/
│       ├── Auth/
│       │   └── AuthTest.php
│       ├── UsuarioTest.php
│       ├── DashboardTest.php
│       └── LogTest.php
└── database/
    └── seeders/
        └── UsuarioSeeder.php      # (existente: biblio@hello.local)
```

**Structure Decision**: Backend-only, seguindo a mesma organizacao da feature 001. Novos
controllers em `Auth/` (namespace separado) e na raiz de `Controllers/` (para dashboard,
usuarios e logs que nao sao do catalogo).

## Complexity Tracking

Nenhuma violacao de constituicao identificada. A decisao sobre `tokens_acesso` esta
documentada em research.md e nao constitui violacao — o principio III exige revogacao
de sessao, que e atendida via blacklist em cache.
