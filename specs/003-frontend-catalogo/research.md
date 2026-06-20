# Research: Frontend — Catalogo e Shell

**Feature**: 003-frontend-catalogo | **Date**: 2026-06-20

## R1. Estrategia de Porting dos Componentes do Design System

**Decision**: Converter componentes JSX para TSX com inline styles e CSS custom properties,
mesma abordagem do DS original.

**Rationale**: O Design System usa exclusivamente inline styles via objetos JavaScript,
consumindo tokens CSS (`var(--color-primary)`, `var(--radius-md)`, etc.). Os arquivos `.d.ts`
ja fornecem interfaces TypeScript prontas. A conversao e direta: mesclar `.jsx` + `.d.ts` em
um unico `.tsx`, sem alterar a abordagem de estilizacao.

**Vantagens**:
- Zero overhead de build (sem CSS Modules, sem Styled Components, sem Tailwind)
- Componentes portados sao visualmente identicos ao DS de referencia
- Tokens CSS sao importados uma unica vez via `tokens.css` e ficam disponiveis globalmente
- Hover/focus states gerenciados via `useState` (mesmo padrao do DS)

**Alternatives considered**:
- **CSS Modules**: Exigiria reescrever todos os inline styles para classes CSS. Divergencia
  desnecessaria do DS de referencia. Rejeitado.
- **Styled Components / Emotion**: Adiciona dependencia de runtime e diverge do padrao do DS.
  Rejeitado.
- **Tailwind CSS**: Exigiria mapeamento de todos os tokens para utilidades Tailwind.
  Complexidade desproporcional para um DS ja pronto. Rejeitado.

## R2. Setup do Projeto Vite + React 18 + TypeScript

**Decision**: Scaffolding via `npm create vite@latest` com template `react-ts`, ajustado
para a estrutura do projeto.

**Rationale**: Vite e o bundler padrao para projetos React modernos. O template `react-ts`
cria a configuracao minima necessaria (tsconfig, vite.config.ts, index.html). Personalizar
a estrutura de pastas conforme spec (api/, components/ds/, features/, hooks/, types/, styles/).

**Dependencias a instalar**:
- `react`, `react-dom` (React 18)
- `react-router-dom` (v6, routing + protected routes)
- `axios` (cliente HTTP)
- `lucide-react` (icones, compativel com Lucide do DS)
- `@types/react`, `@types/react-dom` (tipos)

**Dependencias dev**:
- `typescript` (~5.4)
- `vite` (~5.x)
- `@vitejs/plugin-react`
- `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

## R3. Axios Interceptor para JWT

**Decision**: Instancia unica Axios em `api/client.ts` com interceptors de request e response.

**Rationale**: A constituicao exige autenticacao JWT com revogacao. O frontend armazena o token
em `localStorage` e o anexa via interceptor de request. O interceptor de response captura 401 e
redireciona para login.

**Implementacao**:
```
api/client.ts:
  - baseURL: import.meta.env.VITE_API_URL || '/api/v1'
  - Request interceptor: if token in localStorage, set Authorization: Bearer <token>
  - Response interceptor: if 401, clear localStorage, redirect to /login
```

**Alternatives considered**:
- **Cookies httpOnly**: Mais seguro contra XSS, mas exige backend configurado com CORS +
  credentials e set-cookie. O backend usa JWT em header (Bearer), nao cookies. Rejeitado.
- **sessionStorage**: Perde a sessao ao fechar aba. "Lembrar de mim" do login sugere
  persistencia entre sessoes. localStorage e o padrao. Aceito.

## R4. React Router v6 — Rotas Protegidas

**Decision**: Componente `ProtectedRoute` que verifica AuthContext e redireciona para `/login`.

**Rationale**: Padrao consagrado do React Router v6. O `ProtectedRoute` envolve o `<Outlet />`
das rotas autenticadas. Se `useAuth()` retorna usuario nulo, renderiza `<Navigate to="/login" />`.

**Estrutura de rotas**:
```
/login           -> LoginPage (publica)
/                -> AppShell (protegida) contendo:
  /              -> DashboardPage
  /catalogo      -> CatalogoListaPage
  /catalogo/:id  -> CatalogoDetalhePage
  /catalogo/novo -> CadastrarLivroPage
  /catalogo/:id/editar -> EditarLivroPage
  /autores       -> AutoresPage
  /editoras      -> EditorasPage
  /categorias    -> CategoriasPage
  /usuarios      -> UsuariosPage
  /auditoria     -> LogsPage
```

## R5. Estado e Gerenciamento de Dados

**Decision**: React Context para auth; estado local com `useState`/`useEffect` para dados
de pagina; sem biblioteca de estado global.

**Rationale**: A spec define explicitamente "Sem Redux/Zustand no MVP — estado local com hooks
e prop drilling simples bastam". O AuthContext armazena usuario logado + token + funcoes
login/logout. Dados de pagina (livros, autores, etc.) sao buscados via Axios em `useEffect`
e armazenados em estado local do componente.

**Alternatives considered**:
- **React Query / TanStack Query**: Excelente para cache de dados server-side, mas adiciona
  complexidade e dependencia. O MVP tem escopo pequeno (~10 telas) e nao precisa de cache
  sofisticado. Pode ser adicionado depois se necessario. Rejeitado para o MVP.
- **Redux Toolkit**: Overhead desproporcional para o MVP. Rejeitado.
- **Zustand**: Leve, mas a spec exclui explicitamente. Rejeitado.

## R6. Vitest + React Testing Library

**Decision**: Vitest como test runner (integrado ao Vite), RTL para testes de componentes,
jsdom como ambiente DOM.

**Rationale**: Vitest compartilha a configuracao do Vite (aliases, plugins), tornando o setup
mais simples. RTL incentiva testes baseados em comportamento do usuario (queries por role,
text, label), alinhado com acessibilidade.

**Cobertura minima**:
- Componentes criticos do DS (Button, DataTable, Modal, Toast)
- Hooks (useAuth, usePagination, useToast)
- Fluxo de login (LoginPage)
- Listagem e paginacao (CatalogoListaPage)

## R7. Proxy de Desenvolvimento e CORS

**Decision**: Vite dev server proxy para `localhost:8015` via `vite.config.ts`.

**Rationale**: O backend roda em Docker na porta 8015. Em desenvolvimento, o frontend Vite
roda em outra porta (5173 por padrao). Para evitar problemas de CORS, configurar proxy no
Vite.

**Configuracao**:
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8015',
      changeOrigin: true,
    }
  }
}
```

## R8. Importacao de Tokens CSS do Design System

**Decision**: Copiar arquivos de tokens CSS para `src/styles/` e importar no `main.tsx`.

**Rationale**: O DS fornece tokens em 6 arquivos CSS (`fonts.css`, `colors.css`, `typography.css`,
`spacing.css`, `radii.css`, `base.css`). Esses arquivos definem custom properties no `:root`.
Copiar para o projeto frontend garante independencia do DS (que e somente leitura). Os
componentes portados ja consomem os tokens via `var()` em inline styles.

**Alternatives considered**:
- **Importar diretamente de `Hello_Books_Design_System/`**: Funciona, mas acopla o build ao
  DS. Se o DS mudar de local, o frontend quebra. Copiar e mais robusto. Aceito.
- **Converter tokens para JS/TS constants**: Quebraria o padrao de inline styles com `var()`.
  Os componentes portados dependem de CSS custom properties. Rejeitado.

## R9. Sistema de Toast

**Decision**: React Context + Provider com fila de toasts, renderizado no AppShell.

**Rationale**: Toasts sao usados em toda a aplicacao para feedback de operacoes CRUD. Um hook
`useToast()` retorna funcoes `showSuccess()`, `showError()` que enfileiram mensagens. O
`ToastProvider` renderiza toasts posicionados no canto superior direito com auto-dismiss
(5s por padrao).

## R10. Componente de Paginacao

**Decision**: Hook `usePagination` que recebe metadata da API (`{ total, per_page,
current_page, last_page }`) e retorna helpers de navegacao.

**Rationale**: Todas as listagens (livros, autores, editoras, categorias, usuarios, logs)
usam o mesmo formato de paginacao retornado pela API. Um hook reutilizavel evita duplicacao.

**Interface**:
```typescript
usePagination(pagination: Pagination) => {
  page: number,
  totalPages: number,
  hasNext: boolean,
  hasPrev: boolean,
  goToPage: (p: number) => void,
  nextPage: () => void,
  prevPage: () => void,
}
```

O componente visual de paginacao sera integrado ao DataTable (que ja renderiza controles de
paginacao no DS de referencia).
