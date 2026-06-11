# Implementation Plan: Gestão de Catálogo

**Branch**: `001-gestao-catalogo` | **Date**: 2026-06-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-gestao-catalogo/spec.md`

## Summary

Implementação do MVP de catálogo da biblioteca: CRUD completo de **livros, autores,
editoras, categorias e exemplares** (com associações N:M `livros_autores` e
`livros_categorias`), operado exclusivamente pelo cargo `bibliotecario`. A entrega
compreende três artefatos práticos cobrados pelo projeto:

1. **Endpoints REST** (verbos HTTP `GET`, `POST`, `PUT`, `DELETE`) com payload JSON e
   códigos HTTP semânticos.
2. **Interação API ↔ banco** via camada `Controller → Service → Repository → Eloquent`,
   com transações Postgres em mutações que tocam múltiplas tabelas (criar livro +
   associar autores/categorias; criar exemplares em lote).
3. **Collection do Postman** derivada do contrato OpenAPI para documentar e demonstrar
   a API ao avaliador / time.

O sistema vive em **monorepo** — backend Laravel em `backend/`, frontend React em
`frontend/`, contratos compartilhados em `specs/001-gestao-catalogo/contracts/`. O escopo
do MVP (Princípio V da constituição) é mantido: nenhum endpoint público para `leitor`,
nenhuma notificação, nenhum lookup externo de ISBN.

## Technical Context

**Language/Version**: PHP 8.3 (backend); TypeScript 5.4 (frontend)

**Primary Dependencies**:
- Backend: Laravel 12, `php-open-source-saver/jwt-auth` (fork mantido do tymon/jwt-auth),
  `doctrine/dbal` (para alteração de colunas em migrations Postgres), `laravel/pint`
  (lint).
- Frontend: React 18, TypeScript 5.4, Axios, React Router, Vite (build), Vitest +
  Testing Library (testes).
- Documentação API: `darkaonline/l5-swagger` (gera OpenAPI a partir de anotações) ou
  manutenção manual do `openapi.yaml` em `contracts/`. Decisão final em `research.md`.
- Geração Postman: conversão do OpenAPI via `openapi-to-postmanv2` (CLI Node).

**Storage**: PostgreSQL 16 (relacional, fonte de verdade); Redis 7 (cache de leitura
opcional para catálogo, e fila para jobs futuros — não usado obrigatoriamente nesta
feature).

**Testing**: PHPUnit 11 com Laravel Test (feature + unit tests), executando contra
PostgreSQL em container (mesma engine de produção — sem SQLite para testes, conforme
princípio IV). Frontend: Vitest + React Testing Library.

**Target Platform**: Linux server (Docker Compose para dev local; deploy fora do escopo
desta feature).

**Project Type**: web (monorepo: backend API + frontend SPA).

**Performance Goals**: SC-002 (busca em <1s para 10.000 livros). Suportar ~50
bibliotecários simultâneos sem degradação (carga típica de biblioteca acadêmica
média).

**Constraints**:
- Contrato REST (Princípio I): toda funcionalidade exposta via `GET/POST/PUT/DELETE`,
  JSON in/out, OpenAPI versionado em `contracts/`.
- Integridade transacional (Princípio IV): mutações multi-tabela em `DB::transaction`;
  transições de `status` de exemplar validadas em camada de domínio.
- Auditabilidade (Princípio III): toda mutação grava em `logs_atividades`. Implementado
  via listener de Eloquent Events (`created`, `updated`, `deleted`) registrado nos
  models de catálogo.
- Schema em snake_case e em português, conforme YAML do projeto.

**Scale/Scope**: ~10k livros, ~50 bibliotecários ativos, ~100k exemplares no horizonte
de 2 anos. Esta feature entrega 10 grupos de endpoints REST (livros, exemplares de um
livro, autores, editoras, categorias) e ~25 endpoints individuais.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Avaliação contra os 5 princípios da [Constituição v1.0.0](../../.specify/memory/constitution.md):

| Princípio | Status | Observação |
|-----------|--------|-----------|
| I. Contrato REST Primeiro | ✅ PASS | OpenAPI 3.1 produzido em `contracts/openapi.yaml` antes da implementação. Verbos restritos a `GET/POST/PUT/DELETE`. Erros em envelope `{ error: { code, message, details? } }`. |
| II. Arquitetura em Camadas | ✅ PASS | Controllers chamam Services; Services chamam Repositories; Repositories encapsulam Eloquent. Nenhuma regra de negócio em controller; nenhum SQL bruto fora de Repository/scope. |
| III. Segurança, Sessões e Auditabilidade | ✅ PASS (com nota) | Middleware `auth:api` + middleware `EnsureCargo` aplicados nas rotas de catálogo. Log de atividade via listener nos models de catálogo. **Nota**: Login/JWT/revogação são da feature de autenticação (dependência) — esta feature consome a sessão, não a emite. |
| IV. Integridade Transacional | ✅ PASS | `DB::transaction` em: criação de livro + associações; criação em lote de exemplares; troca de status de exemplar com validação. FKs declaradas com `RESTRICT` em catálogo, `CASCADE` apenas nas associativas `livros_autores` e `livros_categorias`. |
| V. Disciplina de Escopo do MVP | ✅ PASS | Apenas operações do bibliotecário entregues. Nenhum endpoint público para `leitor`, nenhuma notificação, nenhum import em massa. Postman collection é artefato de documentação — não introduz escopo novo. |

**Verdict**: GATE passa. Sem violações que demandem entrada em Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-gestao-catalogo/
├── spec.md              # WHAT/WHY (já entregue)
├── plan.md              # Este arquivo (HOW técnico)
├── research.md          # Phase 0 — decisões com Decision / Rationale / Alternatives
├── data-model.md        # Phase 1 — entidades, FKs, índices, transições
├── quickstart.md        # Phase 1 — como subir local e validar smoke
├── contracts/
│   ├── openapi.yaml     # Phase 1 — contrato REST canônico
│   └── postman/
│       └── HelloBooks.postman_collection.json   # Derivado do OpenAPI
├── checklists/
│   └── requirements.md  # Já entregue
└── tasks.md             # Phase 2 — gerado por /speckit-tasks (NÃO por este comando)
```

### Source Code (repository root — monorepo)

```text
backend/                                 # Laravel 12
├── app/
│   ├── Http/
│   │   ├── Controllers/Catalog/
│   │   │   ├── LivroController.php
│   │   │   ├── AutorController.php
│   │   │   ├── EditoraController.php
│   │   │   ├── CategoriaController.php
│   │   │   └── ExemplarController.php
│   │   ├── Requests/Catalog/            # FormRequest por endpoint
│   │   └── Middleware/
│   │       └── EnsureCargo.php          # Bloqueio por cargo (bibliotecario)
│   ├── Models/
│   │   ├── Usuario.php
│   │   ├── Livro.php
│   │   ├── Autor.php
│   │   ├── Editora.php
│   │   ├── Categoria.php
│   │   ├── Exemplar.php
│   │   └── LogAtividade.php
│   ├── Services/Catalog/
│   │   ├── LivroService.php
│   │   ├── ExemplarService.php
│   │   └── BuscaCatalogoService.php
│   ├── Repositories/Catalog/
│   │   ├── LivroRepository.php
│   │   ├── AutorRepository.php
│   │   ├── EditoraRepository.php
│   │   ├── CategoriaRepository.php
│   │   └── ExemplarRepository.php
│   ├── Domain/
│   │   ├── Exemplar/StatusTransition.php   # validação de transições
│   │   └── Exceptions/                    # exceções de domínio
│   └── Listeners/AuditarMutacao.php       # grava logs_atividades em events Eloquent
├── database/
│   ├── migrations/
│   │   ├── 2026_06_10_000001_create_usuarios_table.php
│   │   ├── 2026_06_10_000002_create_editoras_table.php
│   │   ├── 2026_06_10_000003_create_autores_table.php
│   │   ├── 2026_06_10_000004_create_categorias_table.php
│   │   ├── 2026_06_10_000005_create_livros_table.php
│   │   ├── 2026_06_10_000006_create_exemplares_table.php
│   │   ├── 2026_06_10_000007_create_livros_autores_table.php
│   │   ├── 2026_06_10_000008_create_livros_categorias_table.php
│   │   └── 2026_06_10_000009_create_logs_atividades_table.php
│   └── seeders/
│       └── CatalogoSeeder.php           # dados de demo para testes manuais e Postman
├── routes/
│   └── api.php                          # define rotas REST de /api/v1/*
├── tests/
│   ├── Feature/Catalog/                 # 1 arquivo por user story
│   │   ├── CadastroLivroTest.php        # P1
│   │   ├── ConsultaCatalogoTest.php     # P2
│   │   ├── EdicaoCatalogoTest.php       # P3
│   │   └── RemocaoCatalogoTest.php      # P4
│   └── Unit/Catalog/
│       ├── StatusTransitionTest.php
│       └── BuscaCatalogoServiceTest.php
└── composer.json

frontend/                                 # React 18 + Vite + TS
├── src/
│   ├── api/
│   │   ├── client.ts                    # instância Axios única + interceptors
│   │   └── catalog/                     # módulos por recurso
│   │       ├── livros.ts
│   │       ├── exemplares.ts
│   │       ├── autores.ts
│   │       ├── editoras.ts
│   │       └── categorias.ts
│   ├── features/catalog/
│   │   ├── CadastrarLivroPage.tsx       # P1
│   │   ├── ListaCatalogoPage.tsx        # P2
│   │   ├── DetalheLivroPage.tsx         # P2
│   │   └── EditarLivroPage.tsx          # P3
│   ├── components/                       # UI compartilhada
│   ├── routes.tsx
│   └── main.tsx
├── tests/
│   └── catalog/                         # componentes críticos com Vitest + RTL
├── package.json
├── tsconfig.json
└── vite.config.ts

docker/                                  # Docker Compose dev
├── docker-compose.yml                   # postgres + redis + backend + frontend
└── .env.example
```

**Structure Decision**: **Monorepo web** (Option 2 do template + raiz compartilhada).
Backend Laravel em `backend/`, frontend React em `frontend/`, infra de dev em `docker/`,
contratos em `specs/*/contracts/`. Esta decisão foi confirmada pelo usuário e está
registrada como decisão em `research.md`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Nenhuma violação de constituição identificada. Seção vazia intencionalmente.
