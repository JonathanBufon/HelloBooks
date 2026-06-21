# Implementation Plan: Multas e Notificacoes

**Branch**: `004-multas` | **Date**: 2026-06-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-multas/spec.md`

## Summary

Implementar gestao de multas full-stack: backend Laravel (migrations, model, service, controller,
endpoints REST) e frontend React (telas de gestao para bibliotecario, tela somente leitura para
leitor, notificacoes in-app via badge no Topbar). Multas sao vinculadas a itens de emprestimo;
como a infra de emprestimos nao existe, cria-se schema minimo de `emprestimos` e
`itens_emprestimo` nesta feature. Baixa de multa e manual — leitor paga presencialmente e
bibliotecario registra no sistema.

## Technical Context

**Language/Version**: PHP 8.x + Laravel 12 (backend), TypeScript 5.4 (frontend)

**Primary Dependencies**: Backend — Laravel, JWT auth, PostgreSQL. Frontend — React 18, Vite 5, Axios, React Router v6, Lucide React.

**Storage**: PostgreSQL (3 novas tabelas: emprestimos, itens_emprestimo, multas)

**Testing**: PHPUnit (backend feature/unit tests), Vitest + RTL (frontend)

**Target Platform**: Web desktop (1280px+), navegadores modernos

**Project Type**: Web application (SPA + REST API)

**Performance Goals**: Padrao — endpoints < 200ms, frontend interativo < 3s

**Constraints**:
- Idioma fixo pt-BR
- Sem responsividade mobile
- Pagamento exclusivamente presencial (sem gateway)
- Notificacoes exclusivamente in-app (sem email/SMS/push)

**Scale/Scope**: 3 novas migrations, ~6 endpoints REST novos, ~3 telas frontend novas, badge de notificacao no Topbar

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Status | Justificativa |
|---|---|---|
| I. Contrato REST Primeiro | PASS | Endpoints definidos em `contracts/openapi.yaml` antes da implementacao. Verbos GET/POST/PUT. JSON. Envelope de erro padrao. Rotas: `/multas`, `/multas/{id}`, `/multas/{id}/pagar`, `/multas/{id}/perdoar`, `/minhas-multas`, `/minhas-multas/resumo`. |
| II. Arquitetura em Camadas | PASS | Controller → Service → Repository → Model. MultaController trata HTTP. MultaService concentra regras de negocio (transicao de status, validacao de duplicidade). EloquentMultaRepository acessa banco. FormRequests validam input. |
| III. Seguranca, Sessoes e Auditabilidade | PASS | JWT via middleware `auth:api`. Cargo `bibliotecario` via `EnsureCargo` para rotas de escrita. Leitor so acessa `/minhas-multas` (read-only, scoped ao proprio usuario). `AuditableTrait` no model Multa gera logs em `logs_atividades`. |
| IV. Integridade Transacional | PASS | Criar multa e atualizar status executam em `DB::transaction`. FK RESTRICT em todas as referencias. UNIQUE(id_item_emprestimo, motivo) impede duplicidade. CHECK constraints no schema. Transicoes de status validadas por `StatusMultaTransition`. |
| V. Disciplina de Escopo do MVP | PASS | Multas estao explicitamente em escopo (constituicao). Notificacoes sao in-app (nao email/SMS/push). Leitor tem acesso minimo (read-only). Tabelas de emprestimos sao schema minimo — CRUD de emprestimos e feature separada. |
| Restricoes Tecnologicas | PASS | PHP + Laravel, PostgreSQL, React + TypeScript + Axios. Snake_case portugues. Timestamptz UTC. CHECK constraints. |

**Gate result**: PASS — nenhuma violacao. Prosseguir.

**Post-design re-check**: PASS — contratos definidos, data model alinhado, transicoes de estado validaveis.

## Project Structure

### Documentation (this feature)

```text
specs/004-multas/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── openapi.yaml     # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
backend/
├── database/migrations/
│   ├── XXXX_create_emprestimos_table.php
│   ├── XXXX_create_itens_emprestimo_table.php
│   └── XXXX_create_multas_table.php
├── app/
│   ├── Domain/
│   │   ├── Exceptions/
│   │   │   ├── MultaDuplicadaException.php
│   │   │   └── TransicaoMultaInvalidaException.php
│   │   └── Multa/
│   │       ├── MotivoMulta.php           # Enum: atraso, rabisco, rasgo, dobra
│   │       ├── StatusMulta.php           # Enum: pendente, paga, perdoada
│   │       └── StatusMultaTransition.php # Validacao de transicoes
│   ├── Models/
│   │   ├── Emprestimo.php
│   │   ├── ItemEmprestimo.php
│   │   └── Multa.php
│   ├── Repositories/
│   │   ├── Multa/
│   │   │   ├── MultaRepositoryInterface.php
│   │   │   └── EloquentMultaRepository.php
│   │   └── Emprestimo/
│   │       ├── ItemEmprestimoRepositoryInterface.php
│   │       └── EloquentItemEmprestimoRepository.php
│   ├── Services/
│   │   └── MultaService.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── MultaController.php
│   │   │   └── MinhasMultasController.php
│   │   ├── Requests/
│   │   │   └── Multa/
│   │   │       ├── MultaCreateRequest.php
│   │   │       ├── MultaIndexRequest.php
│   │   │       └── MultaPerdoarRequest.php
│   │   └── Resources/
│   │       ├── MultaResource.php
│   │       ├── MultaDetalheResource.php
│   │       └── MultaResumoResource.php
│   └── routes/
│       └── api.php                       # Novas rotas adicionadas
└── tests/
    └── Feature/
        ├── MultaControllerTest.php
        └── MinhasMultasControllerTest.php

frontend/
├── src/
│   ├── api/
│   │   ├── multas.ts                     # API module: CRUD multas (bibliotecario)
│   │   └── minhas-multas.ts              # API module: consulta multas (leitor)
│   ├── features/
│   │   ├── multas/
│   │   │   └── MultasPage.tsx            # Listagem + filtros + acoes (bibliotecario)
│   │   └── minhas-multas/
│   │       └── MinhasMultasPage.tsx       # Listagem read-only (leitor)
│   ├── components/
│   │   └── layout/
│   │       └── NotificationBadge.tsx     # Badge de multas no Topbar
│   ├── hooks/
│   │   └── useMultasPendentes.ts         # Hook para badge de notificacao
│   ├── types/
│   │   └── multa.ts                      # Tipos: Multa, MultaResumo, etc.
│   └── routes.tsx                        # Novas rotas: /multas, /minhas-multas
└── __tests__/
    └── features/
        └── multas/
            └── MultasPage.test.tsx
```

**Structure Decision**: Feature full-stack seguindo os padroes estabelecidos nas features 001-003.
Backend em `backend/` com camadas Controller → Service → Repository → Model. Frontend em
`frontend/` com API modules, feature pages e hooks.

## Complexity Tracking

> Nenhuma violacao da constituicao. Tabela vazia.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| — | — | — |
