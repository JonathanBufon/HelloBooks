# Data Model: Frontend — Catalogo e Shell

**Feature**: 003-frontend-catalogo | **Date**: 2026-06-20

Este documento define os tipos TypeScript do frontend que mapeiam os schemas das APIs
do backend (specs/001-gestao-catalogo e specs/002-backend-complementar).

## Tipos de API (src/types/api.ts)

### Envelope de Erro

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

### Paginacao

```typescript
interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
```

### Catalogo — Livros

```typescript
interface Livro {
  id_livro: number;
  titulo: string;
  isbn: string;
  ano_publicacao: number;
  id_editora: number;
  editora?: Editora;
  autores?: Autor[];
  categorias?: Categoria[];
  created_at?: string;
  updated_at?: string;
}

interface LivroDetalhe extends Livro {
  exemplares: Exemplar[];
  contagem_exemplares: {
    disponivel: number;
    emprestado: number;
    reservado: number;
    manutencao: number;
  };
}

interface LivroCreate {
  titulo: string;
  isbn: string;
  ano_publicacao: number;
  id_editora: number;
  autores: Array<{ id_autor: number } | { nome: string }>;
  categorias: Array<{ id_categoria: number } | { nome: string }>;
}

interface LivroUpdate {
  titulo?: string;
  isbn?: string;
  ano_publicacao?: number;
  id_editora?: number;
  autores?: Array<{ id_autor: number }>;
  categorias?: Array<{ id_categoria: number }>;
}
```

### Catalogo — Exemplares

```typescript
type ExemplarStatus = 'disponivel' | 'emprestado' | 'reservado' | 'manutencao';
type CondicaoFisica = 'intacto' | 'rabiscado' | 'rasgado' | 'dobrado';

interface Exemplar {
  id_exemplar: number;
  id_livro: number;
  status: ExemplarStatus;
  condicao_fisica: CondicaoFisica;
  created_at?: string;
  updated_at?: string;
}

interface ExemplarUpdate {
  status?: 'disponivel' | 'manutencao';
  condicao_fisica?: CondicaoFisica;
}

interface ExemplarCreate {
  quantidade: number;  // 1-1000
}
```

### Catalogo — Autores

```typescript
interface Autor {
  id_autor: number;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

interface AutorCreate {
  nome: string;
}
```

### Catalogo — Editoras

```typescript
interface Editora {
  id_editora: number;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

interface EditoraCreate {
  nome: string;
}
```

### Catalogo — Categorias

```typescript
interface Categoria {
  id_categoria: number;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoriaCreate {
  nome: string;
}
```

## Tipos de Auth (src/types/auth.ts)

```typescript
interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
  usuario: Usuario;
}

type Cargo = 'bibliotecario' | 'leitor';

interface Usuario {
  id_usuario: number;
  nome_completo: string;
  email: string;
  cargo: Cargo;
  endereco?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface UsuarioCreate {
  nome_completo: string;
  email: string;
  senha: string;
  cargo: Cargo;
  endereco?: string | null;
}

interface UsuarioUpdate {
  nome_completo?: string;
  email?: string;
  senha?: string;
  cargo?: Cargo;
  endereco?: string | null;
}
```

## Tipos de Dashboard (src/types/api.ts)

```typescript
interface DashboardStats {
  total_livros: number;
  total_exemplares: number;
  exemplares_por_status: {
    disponivel: number;
    emprestado: number;
    reservado: number;
    manutencao: number;
  };
  total_autores: number;
  total_editoras: number;
  total_categorias: number;
  total_usuarios: number;
  livros_recentes: Array<{
    id_livro: number;
    titulo: string;
    autores: string[];
    created_at: string;
  }>;
  atividade_recente: LogEntry[];
}
```

## Tipos de Logs (src/types/api.ts)

```typescript
type AcaoRealizada = 'created' | 'updated' | 'deleted';

interface LogEntry {
  id_log: number;
  acao_realizada: AcaoRealizada;
  entidade_afetada: string;
  id_registro_afetado: string;
  data_hora: string;
  usuario?: {
    id_usuario: number;
    nome_completo: string;
  };
}
```

## Estado do Cliente

### AuthContext

```typescript
interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

### ToastContext

```typescript
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  dismiss: (id: string) => void;
}
```

## Mapeamento Telas x Endpoints x Tipos

| Tela | Endpoints | Tipos de Resposta |
|------|-----------|-------------------|
| LoginPage | `POST /auth/login` | `LoginResponse` |
| DashboardPage | `GET /dashboard/stats` | `DashboardStats` |
| CatalogoListaPage | `GET /livros`, `GET /categorias` | `PaginatedResponse<Livro>`, `PaginatedResponse<Categoria>` |
| CatalogoDetalhePage | `GET /livros/{id}` | `LivroDetalhe` |
| CadastrarLivroPage | `POST /livros`, `GET /autores`, `GET /editoras`, `GET /categorias` | `Livro`, `PaginatedResponse<Autor>`, etc. |
| EditarLivroPage | `PUT /livros/{id}`, `GET /livros/{id}`, ... | `Livro`, `LivroDetalhe` |
| AutoresPage | `GET/POST/PUT/DELETE /autores` | `PaginatedResponse<Autor>`, `Autor` |
| EditorasPage | `GET/POST/PUT/DELETE /editoras` | `PaginatedResponse<Editora>`, `Editora` |
| CategoriasPage | `GET/POST/PUT/DELETE /categorias` | `PaginatedResponse<Categoria>`, `Categoria` |
| UsuariosPage | `GET/POST/PUT/DELETE /usuarios` | `PaginatedResponse<Usuario>`, `Usuario` |
| LogsPage | `GET /logs` | `PaginatedResponse<LogEntry>` |

## Relacionamentos entre Entidades (lado do frontend)

```
Usuario ---autentica---> AuthContext (token + usuario logado)

DashboardStats
  ├── livros_recentes: [{id_livro, titulo, autores[]}]  (resumo, sem Livro completo)
  └── atividade_recente: LogEntry[]

Livro
  ├── Editora        (id_editora -> Editora)
  ├── Autor[]        (N:N via autores[])
  └── Categoria[]    (N:N via categorias[])

LivroDetalhe extends Livro
  ├── Exemplar[]
  └── contagem_exemplares: {disponivel, emprestado, reservado, manutencao}

LogEntry
  └── usuario?: {id_usuario, nome_completo}  (join embutido na API)
```
