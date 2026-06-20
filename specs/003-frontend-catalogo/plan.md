# Implementation Plan: Frontend — Catalogo e Shell

**Branch**: `003-frontend-catalogo` | **Date**: 2026-06-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-frontend-catalogo/spec.md`

## Summary

Construir o frontend React/TypeScript/Vite do HelloBooks cobrindo as 10 telas que o backend
ja suporta (catalogo completo, autenticacao, dashboard, usuarios, auditoria) e o shell da
aplicacao (login, sidebar, topbar). Os 26 componentes do Hello Books Design System serao
portados de JSX para TypeScript (.tsx) com tipagem adequada, consumindo os tokens CSS do DS.
A comunicacao com o backend usa uma instancia unica Axios com interceptors JWT. Estado
gerenciado via React Context (auth) e hooks locais.

## Technical Context

**Language/Version**: TypeScript 5.4

**Primary Dependencies**: React 18, Vite 5, Axios, React Router v6, Lucide React (icones)

**Storage**: N/A (client-side localStorage para JWT token apenas)

**Testing**: Vitest + React Testing Library (RTL)

**Target Platform**: Web desktop (1280px+), navegadores modernos (Chrome, Firefox, Edge, Safari)

**Project Type**: Single-page web application (SPA)

**Performance Goals**: Nenhum requisito explicito; SPA padrao — First Contentful Paint < 2s,
Time to Interactive < 3s em dev local

**Constraints**:
- Idioma fixo pt-BR (sem i18n)
- Sem responsividade mobile (desktop-first, 1280px+)
- Sem dark mode
- Sem testes E2E (Cypress/Playwright) — apenas Vitest + RTL
- Dados inventados proibidos — se a API nao retorna dado, exibir "-" ou omitir

**Scale/Scope**: ~10 telas, ~30 endpoints consumidos (catalogo 001 + complementar 002),
26 componentes portados do DS

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Status | Justificativa |
|-----------|--------|---------------|
| I. Contrato REST Primeiro | PASS | Frontend consome endpoints REST existentes (specs/001 + 002). Nenhum endpoint novo criado. Todas as requisicoes usam JSON, verbos HTTP semanticos, e envelope de erro padrao. |
| II. Arquitetura em Camadas (Backend Laravel) | N/A | Feature puramente frontend. Nenhum codigo backend novo. |
| III. Seguranca, Sessoes e Auditabilidade | PASS | JWT armazenado em localStorage, anexado via Axios interceptor. Logout chama `POST /auth/logout` para revogar token. Response 401 interceptado para redirect a login e limpar token. Logs de auditoria exibidos na tela `/auditoria`. |
| IV. Integridade Transacional dos Dados | N/A | Frontend nao acessa banco diretamente. Integridade transacional mantida pelo backend. |
| V. Disciplina de Escopo do MVP | PASS | Spec exclui explicitamente: circulacao, membros, reservas, multas, relatorios, configuracoes, mobile, dark mode. Sidebar pode mostrar itens futuros desabilitados. |
| Restricoes Tecnologicas | PASS | React + TypeScript + Axios conforme acordado. Vite como bundler. |

**Gate result**: PASS — nenhuma violacao. Prosseguir para Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-frontend-catalogo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts        # ou integrado no vite.config.ts
├── src/
│   ├── main.tsx
│   ├── routes.tsx
│   ├── vite-env.d.ts
│   ├── api/
│   │   ├── client.ts                  # Axios instance + interceptors
│   │   ├── auth.ts                    # login/logout/refresh/me
│   │   ├── dashboard.ts               # GET /dashboard/stats
│   │   ├── usuarios.ts                # CRUD usuarios
│   │   ├── logs.ts                    # GET /logs
│   │   └── catalog/
│   │       ├── livros.ts              # CRUD livros
│   │       ├── autores.ts             # CRUD autores
│   │       ├── editoras.ts            # CRUD editoras
│   │       ├── categorias.ts          # CRUD categorias
│   │       └── exemplares.ts          # CRUD exemplares
│   ├── components/
│   │   ├── ds/                        # Componentes portados do Design System (26)
│   │   │   ├── actions/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── IconButton.tsx
│   │   │   ├── data/
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── Tag.tsx
│   │   │   ├── feedback/
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Toast.tsx
│   │   │   ├── forms/
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── SearchInput.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Switch.tsx
│   │   │   │   ├── TextInput.tsx
│   │   │   │   └── Textarea.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Card.tsx           # Card + CardHeader
│   │   │   │   └── PageHeader.tsx
│   │   │   ├── library/
│   │   │   │   ├── BookCard.tsx
│   │   │   │   └── BookCover.tsx
│   │   │   └── navigation/
│   │   │       ├── Sidebar.tsx
│   │   │       ├── SidebarItem.tsx
│   │   │       └── Topbar.tsx
│   │   └── layout/
│   │       ├── AppShell.tsx           # Sidebar + Topbar + main
│   │       └── ProtectedRoute.tsx     # Guard de autenticacao
│   ├── features/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── catalog/
│   │   │   ├── CatalogoListaPage.tsx
│   │   │   ├── CatalogoDetalhePage.tsx
│   │   │   ├── CadastrarLivroPage.tsx
│   │   │   └── EditarLivroPage.tsx
│   │   ├── catalog-aux/
│   │   │   ├── AutoresPage.tsx
│   │   │   ├── EditorasPage.tsx
│   │   │   └── CategoriasPage.tsx
│   │   ├── usuarios/
│   │   │   └── UsuariosPage.tsx
│   │   └── auditoria/
│   │       └── LogsPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts                 # Context + provider de autenticacao
│   │   ├── usePagination.ts           # Hook de paginacao reutilizavel
│   │   └── useToast.ts                # Hook de feedback (toast)
│   ├── types/
│   │   ├── api.ts                     # Tipos de resposta da API (Livro, Autor, etc.)
│   │   └── auth.ts                    # Tipos de autenticacao (LoginResponse, Usuario)
│   └── styles/
│       ├── tokens.css                 # Tokens CSS portados do DS
│       ├── global.css                 # Reset + estilos globais
│       └── components/               # CSS por componente DS (se necessario)
├── Hello_Books_Design_System/         # Referencia (somente leitura)
└── __tests__/                         # Testes Vitest + RTL
    ├── components/
    └── features/
```

**Structure Decision**: Projeto frontend como SPA em `frontend/` usando a estrutura de
pastas definida na spec. O Design System existente em `frontend/Hello_Books_Design_System/`
serve como referencia somente leitura — componentes sao portados para `src/components/ds/`.
Testes ficam em `frontend/__tests__/` espelhando a estrutura de `src/`.

## Complexity Tracking

> Nenhuma violacao da constituicao. Tabela vazia.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
