# Feature Specification: Frontend — Catalogo e Shell

**Feature Branch**: `003-frontend-catalogo`

**Created**: 2026-06-20

**Status**: Draft

**Input**: Construir o frontend React do HelloBooks cobrindo as telas que o backend ja
suporta (catalogo completo) e o shell da aplicacao (login, sidebar, topbar, dashboard),
usando o Hello Books Design System como referencia visual e de componentes.

## Contexto

O backend entrega:
- **001-gestao-catalogo**: CRUD de livros, autores, editoras, categorias, exemplares
  (25 endpoints, paginados, com busca).
- **002-backend-complementar** (em paralelo): autenticacao JWT, CRUD de usuarios,
  dashboard/stats, logs de auditoria.

O **Hello Books Design System** (`frontend/Hello_Books_Design_System/`) fornece:
- Tokens CSS (cores, tipografia, espacamento, raios, sombras).
- 26 componentes React prontos (Button, TextInput, Select, DataTable, Modal, Toast,
  Sidebar, Topbar, BookCard, MetricCard, etc.).
- UI Kit com telas de referencia: LoginScreen, DashboardScreen, CatalogScreen,
  MemberProfileScreen, CirculationScreen.
- Guias de conteudo: idioma pt-BR, tom administrativo, botoes com verbo de acao,
  mensagens especificas, sem emoji.

O frontend DEVE replicar a linguagem visual do design system, consumindo os tokens
e portando os componentes do DS para o projeto React/TypeScript/Vite.

## Escopo

### O que FAZER

#### Infraestrutura do Projeto Frontend

- Projeto React 18 + TypeScript 5.4 + Vite em `frontend/`.
- Axios com instancia unica (`api/client.ts`) e interceptors:
  - Request: anexa `Authorization: Bearer <token>` do localStorage.
  - Response 401: redireciona para login e limpa token.
- React Router v6 com rotas protegidas (redirect para login se nao autenticado).
- Portar tokens CSS do design system para `frontend/src/styles/`.
- Portar componentes do DS para `frontend/src/components/ds/` como componentes
  TypeScript (.tsx) com tipagem adequada.
- Estrutura de pastas:

```
frontend/src/
  api/
    client.ts                  # Axios instance
    catalog/
      livros.ts                # CRUD livros
      autores.ts               # CRUD autores
      editoras.ts              # CRUD editoras
      categorias.ts            # CRUD categorias
      exemplares.ts            # CRUD exemplares
    auth.ts                    # login/logout/refresh/me
    dashboard.ts               # GET /dashboard/stats
    usuarios.ts                # CRUD usuarios
    logs.ts                    # GET /logs
  components/
    ds/                        # Componentes portados do Design System
    layout/
      AppShell.tsx             # Sidebar + Topbar + main
      ProtectedRoute.tsx       # Guard de autenticacao
  features/
    auth/
      LoginPage.tsx
    dashboard/
      DashboardPage.tsx
    catalog/
      CatalogoListaPage.tsx    # Lista com grid/tabela, busca, filtros
      CatalogoDetalhePage.tsx  # Detalhe do livro + exemplares
      CadastrarLivroPage.tsx   # Form de criacao (modal ou pagina)
      EditarLivroPage.tsx      # Form de edicao
    catalog-aux/
      AutoresPage.tsx          # CRUD de autores
      EditorasPage.tsx         # CRUD de editoras
      CategoriasPage.tsx       # CRUD de categorias
    usuarios/
      UsuariosPage.tsx         # Lista + CRUD de usuarios
    auditoria/
      LogsPage.tsx             # Visualizacao de logs
  hooks/
    useAuth.ts                 # Context de autenticacao
    usePagination.ts           # Hook de paginacao
    useToast.ts                # Hook de feedback
  routes.tsx
  main.tsx
```

#### Tela 1 — Login (`/login`)

- Duas colunas: painel institucional roxo (gradiente + logo + features) e formulario.
- Campos: email, senha, checkbox "Lembrar de mim".
- Botao "Entrar no Sistema" chama `POST /auth/login`.
- Erro de credenciais exibido inline.
- Apos login, redireciona para Dashboard.
- Referencia: `ui_kits/hellobooks/LoginScreen.jsx`.

#### Tela 2 — Dashboard (`/`)

- PageHeader: "Dashboard" / "Situacao operacional da biblioteca".
- 4 MetricCards: Total de Livros, Exemplares Disponiveis, Exemplares Emprestados,
  Exemplares em Manutencao. Dados de `GET /dashboard/stats`.
- Card "Novas Aquisicoes" — ultimos 5 livros (BookCover + titulo + autor).
- Card "Atividade Recente" — ultimas 10 acoes do log.
- Card "Acoes Rapidas" — botoes de atalho (Cadastrar Livro navega para catalogo).
- Referencia: `ui_kits/hellobooks/DashboardScreen.jsx`.
- **Nota**: metricas de emprestimo/devolucao/membros ficam zeradas ou com placeholder
  ate as features futuras serem implementadas. Nao inventar dados.

#### Tela 3 — Catalogo Lista (`/catalogo`)

- PageHeader com botao "Cadastrar Livro" (abre modal ou navega).
- Barra de filtros: SearchInput (busca por titulo/autor/ISBN), Select de categorias,
  Select de status, toggle grid/tabela.
- **Modo grid**: BookCards com capa, titulo, autor, status, exemplares.
- **Modo tabela**: DataTable com colunas capa, titulo/autor, categoria, status,
  exemplares (disponivel/total), acoes (botao Ver).
- Paginacao nos dois modos.
- Dados de `GET /livros?q=&page=&per_page=`.
- Empty state: "Nenhum livro cadastrado ainda. Comece adicionando o primeiro titulo
  ao catalogo."
- Referencia: `ui_kits/hellobooks/CatalogScreen.jsx`.

#### Tela 4 — Detalhe do Livro (`/catalogo/:id`)

- PageHeader com breadcrumb ["Inicio", "Catalogo", titulo do livro].
- Dados do livro: titulo, ISBN, ano, editora, autores (Tags), categorias (Tags).
- Contagem de exemplares por status (4 mini MetricCards ou badges).
- DataTable de exemplares: codigo, status (StatusBadge), condicao fisica
  (StatusBadge), data de cadastro, acoes (editar status/condicao, remover).
- Botoes: "Editar Livro", "Registrar Exemplares" (abre modal com campo quantidade).
- Dados de `GET /livros/{id}` (retorna LivroDetalhe com exemplares e contagem).

#### Tela 5 — Cadastrar/Editar Livro (`/catalogo/novo`, `/catalogo/:id/editar`)

- Modal ou pagina com formulario:
  - Titulo (TextInput, required)
  - ISBN (TextInput, required, validacao 10-13 chars)
  - Ano de publicacao (TextInput type=number)
  - Editora (Select carregado de `GET /editoras`)
  - Autores (multi-select ou lista com add/remove, carregado de `GET /autores`)
  - Categorias (multi-select ou lista com add/remove, carregado de `GET /categorias`)
- Possibilidade de criar autor/editora/categoria inline (mini modal ou input com botao
  "Criar novo").
- Submit chama `POST /livros` ou `PUT /livros/{id}`.
- Validacao de erros inline (400) e ISBN duplicado (409).
- Toast de sucesso apos salvar.

#### Tela 6 — Autores (`/autores`)

- PageHeader: "Autores" / "Gerenciamento de autores do acervo".
- DataTable com colunas: nome, data de cadastro, acoes (editar, remover).
- Botao "Cadastrar Autor" abre modal com campo nome.
- Editar abre modal com nome preenchido.
- Remover com Modal de confirmacao. Erro 409 se autor tem livros associados
  (mostrar toast de erro).
- Paginacao + busca.

#### Tela 7 — Editoras (`/editoras`)

- Mesma estrutura de Autores, adaptada para editoras.
- `GET/POST/PUT/DELETE /editoras`.

#### Tela 8 — Categorias (`/categorias`)

- Mesma estrutura de Autores, adaptada para categorias.
- `GET/POST/PUT/DELETE /categorias`.
- Erro 409 para nome duplicado.

#### Tela 9 — Usuarios (`/usuarios`)

- PageHeader: "Usuarios" / "Gerenciamento de contas do sistema".
- DataTable: nome, email, cargo (Badge), data de cadastro, acoes.
- Botao "Cadastrar Usuario" abre modal com campos: nome, email, senha, cargo (Select:
  bibliotecario/leitor).
- Edicao via modal (sem campo senha, ou campo opcional).
- Remocao com confirmacao. Erros: 409 auto-exclusao, 409 usuario em uso.
- Paginacao + busca.

#### Tela 10 — Logs de Auditoria (`/auditoria`)

- PageHeader: "Auditoria" / "Registro de atividades do sistema".
- Filtros: Select de entidade, Select de acao, DatePicker (de/ate), busca por usuario.
- DataTable: data/hora, usuario, acao, entidade, ID registro.
- Sem edicao — apenas leitura.
- Paginacao.

#### Shell da Aplicacao (AppShell)

- Sidebar fixa a esquerda (292px) com:
  - Logo Hello Books
  - Itens de navegacao: Dashboard, Catalogo, Autores, Editoras, Categorias, Usuarios,
    Auditoria
  - Card do usuario logado no rodape
- Topbar com SearchInput global e info do usuario.
- Area principal rolavel.
- Item ativo destacado na sidebar conforme rota atual.
- Referencia: `ui_kits/hellobooks/AppShell.jsx`.

### O que NAO fazer

- **Telas de Circulacao** (emprestimos/devolucoes) — sem backend. A sidebar pode mostrar
  o item desabilitado ou oculto.
- **Telas de Membros** — sem backend de membros. Idem.
- **Telas de Reservas** — sem backend.
- **Telas de Multas** — sem backend.
- **Telas de Relatorios** — fora do MVP.
- **Telas de Configuracoes** — sem backend.
- **Responsividade mobile** — foco em desktop (1280px+). Pode ser adicionado depois.
- **Testes E2E** (Cypress/Playwright) — fora do escopo inicial; cobrir com Vitest + RTL
  os componentes criticos.
- **Internacionalizacao (i18n)** — interface fixa em pt-BR.
- **Dark mode** — design system nao preve; nao implementar.
- **Inventar dados** que o backend nao fornece. Se a API nao retorna dado, exibir "-"
  ou omitir o campo.

## Diretrizes de Design (do Design System)

### Conteudo

- Idioma: pt-BR. Termos de dominio consistentes: Livro, Exemplar, Autor, Editora,
  Categoria, Catalogo, Acervo.
- Tom: administrativo, objetivo, claro.
- Botoes: verbo de acao ("Cadastrar Livro", "Registrar Exemplares", "Ver Detalhes").
- Mensagens de erro especificas: "ISBN invalido. Use o formato ISBN-13."
- Empty states explicam o proximo passo.
- Sem emoji. Iconografia via Lucide Icons.

### Visual

- Cor primaria: `#5B00C9` (roxo institucional). Usar para hierarquia, acao e estado ativo.
- Fundo app: `#F3F6FF`. Superficies: brancas. Inputs: `#EEF3FF`.
- Gradiente (`#5B00C9 -> #7C3AED`) apenas em destaques: login, botao primario.
- Tipografia: Inter, pesos 400-800, escala 12px-36px.
- Espacamento base 4px. Cards: padding 28px. Secoes: gap 32px.
- Cantos: chips 8px, inputs/botoes 12px, cards 20px, modais 24px.
- Sombras suaves com tom roxo.
- Icones: Lucide, stroke 2px, 18px menus, 20px botoes, 24px cards.

### Componentes do DS a portar

Os componentes do design system em `frontend/Hello_Books_Design_System/components/`
devem ser portados para TypeScript com props tipadas:

| Componente | Fonte DS | Uso principal |
|---|---|---|
| Button | `actions/Button.jsx` | Acoes em toda a aplicacao |
| IconButton | `actions/IconButton.jsx` | Toggle de visualizacao, acoes icone-only |
| TextInput | `forms/TextInput.jsx` | Campos de formulario |
| Textarea | `forms/Textarea.jsx` | Campos multi-linha |
| Select | `forms/Select.jsx` | Dropdowns |
| Checkbox | `forms/Checkbox.jsx` | Opcoes on/off |
| Switch | `forms/Switch.jsx` | Toggles |
| SearchInput | `forms/SearchInput.jsx` | Barras de busca |
| DataTable | `data/DataTable.jsx` | Tabelas operacionais |
| MetricCard | `data/MetricCard.jsx` | Cards de metrica no dashboard |
| Badge | `data/Badge.jsx` | Labels genericas |
| StatusBadge | `data/StatusBadge.jsx` | Status do dominio |
| Tag | `data/Tag.jsx` | Categorias, autores |
| Avatar | `data/Avatar.jsx` | Foto/iniciais do usuario |
| Card, CardHeader | `layout/Card.jsx` | Container de conteudo |
| PageHeader | `layout/PageHeader.jsx` | Cabecalho de pagina |
| Sidebar | `navigation/Sidebar.jsx` | Navegacao lateral |
| SidebarItem | `navigation/SidebarItem.jsx` | Item de navegacao |
| Topbar | `navigation/Topbar.jsx` | Barra superior |
| Modal | `feedback/Modal.jsx` | Dialogos de formulario e confirmacao |
| Toast | `feedback/Toast.jsx` | Feedback de acoes |
| BookCard | `library/BookCard.jsx` | Card de livro na grade |
| BookCover | `library/BookCover.jsx` | Capa estilizada do livro |

## Mapeamento de Telas x Endpoints

| Tela | Endpoints consumidos |
|---|---|
| Login | `POST /auth/login` |
| Dashboard | `GET /dashboard/stats` |
| Catalogo Lista | `GET /livros`, `GET /categorias` |
| Catalogo Detalhe | `GET /livros/{id}` |
| Cadastrar/Editar Livro | `GET/POST /livros`, `PUT /livros/{id}`, `GET /autores`, `GET /editoras`, `GET /categorias` |
| Registrar Exemplares | `POST /livros/{id}/exemplares` |
| Editar Exemplar | `PUT /exemplares/{id}` |
| Remover Exemplar | `DELETE /exemplares/{id}` |
| Autores | `GET/POST/PUT/DELETE /autores` |
| Editoras | `GET/POST/PUT/DELETE /editoras` |
| Categorias | `GET/POST/PUT/DELETE /categorias` |
| Usuarios | `GET/POST/PUT/DELETE /usuarios` |
| Auditoria | `GET /logs` |

## Technical Notes

- Seguir constituicao: React + TypeScript + Axios (principio em Restricoes Tecnologicas).
- Vite como bundler. Vitest + React Testing Library para testes.
- Estado: React Context para auth. Sem Redux/Zustand no MVP — estado local com hooks
  e prop drilling simples bastam.
- Paginacao: componente reutilizavel que lê `{ total, per_page, current_page, last_page }`
  da API.
- Tratamento de erros: interceptor global (401 -> logout), toast para erros de operacao,
  inline para validacao de formulario.
- Build dev com proxy para `localhost:8015` (backend Docker).

## Dependencies

- **001-gestao-catalogo**: endpoints de catalogo ja funcionando.
- **002-backend-complementar**: endpoints de auth, usuarios, dashboard, logs.
- **Hello Books Design System**: tokens e componentes de referencia.
