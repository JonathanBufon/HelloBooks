# Feature Specification: Backend Complementar

**Feature Branch**: `002-backend-complementar`

**Created**: 2026-06-20

**Status**: Draft

**Input**: Completar o backend com os endpoints que faltam para suportar o frontend do MVP:
autenticacao (login/logout/JWT), CRUD de usuarios, endpoint de dashboard (metricas
agregadas) e leitura de logs de auditoria. Nao inclui circulacao, reservas, multas ou
membros — esses sao features futuras.

## Contexto

O backend da feature `001-gestao-catalogo` entregou CRUD completo de livros, autores,
editoras, categorias e exemplares. Porem, para que o frontend consiga funcionar como
aplicacao real, faltam quatro blocos:

1. **Autenticacao** — login/logout com JWT, sem os quais nenhuma rota e acessivel.
2. **Usuarios** — CRUD basico para o bibliotecario gerenciar contas.
3. **Dashboard** — endpoint de metricas agregadas para alimentar cards e graficos.
4. **Logs de Auditoria** — leitura dos `logs_atividades` que ja sao gravados mas nao
   tem endpoint de consulta.

A infraestrutura ja existe: tabela `usuarios` com campo `cargo`, middleware `EnsureCargo`,
tabela `logs_atividades` com listener `AuditarMutacao`. Esta spec preenche as lacunas
sem alterar o que ja funciona.

## Clarifications

### Session 2026-06-20

- Q: Como a revogacao/persistencia de tokens JWT deve ser implementada? → A: Usar blacklist/cache do `jwt-auth`; nao criar `tokens_acesso`.
- Q: Quais campos de usuario a API deve expor e aceitar? → A: API usa `nome_completo` e entrada `senha`; persistencia usa `senha_hash` oculto.
- Q: Quais credenciais do usuario admin padrao devem ser usadas em seed, testes e quickstart? → A: `biblio@hello.local` / `secret123`.
- Q: Como a senha de usuario deve ser alterada nesta feature? → A: Permitir alterar senha no `PUT /usuarios/{id}` com campo opcional `senha`.
- Q: Quais regras devem bloquear a remocao de usuario nesta feature? → A: Validar auto-exclusao e restricoes de FKs existentes; nao validar emprestimos ativos.

## Escopo

### O que FAZER

#### Bloco 1 — Autenticacao (JWT)

- `POST /api/v1/auth/login` — recebe `email` + `senha`, valida credenciais, retorna
  `{ token, usuario }`. Token JWT com expiracao configuravel (default 60 min).
- `POST /api/v1/auth/logout` — revoga o token corrente (invalida no server-side).
- `POST /api/v1/auth/refresh` — renova token antes de expirar, retorna novo token.
- `GET /api/v1/auth/me` — retorna dados do usuario autenticado.
- Revogacao de token via blacklist/cache nativa do `php-open-source-saver/jwt-auth`;
  nao criar tabela `tokens_acesso` nesta feature.
- Middleware `auth:api` ja existe e usa `php-open-source-saver/jwt-auth` — completar
  configuracao se necessario.

**Rotas de auth NAO exigem middleware `auth:api`** (exceto logout, refresh e me).

#### Bloco 2 — CRUD de Usuarios

- `GET /api/v1/usuarios` — lista paginada (page, per_page, q). Apenas `bibliotecario`.
- `POST /api/v1/usuarios` — cria usuario (`nome_completo`, `email`, `senha`, `cargo`,
  `endereco` opcional). Apenas `bibliotecario`.
- `GET /api/v1/usuarios/{id}` — detalhe de um usuario.
- `PUT /api/v1/usuarios/{id}` — atualiza dados (`nome_completo`, `email`, `cargo`,
  `endereco`). Senha pode ser alterada no mesmo PUT com campo opcional `senha`.
- `DELETE /api/v1/usuarios/{id}` — remove usuario quando nao for a propria conta e nao
  violar restricoes de FK existentes.

Campos expostos do usuario: `id_usuario`, `nome_completo`, `email`, `cargo` (enum:
`bibliotecario`, `leitor`), `endereco`, `created_at`, `updated_at`. O campo `senha`
e aceito apenas na entrada e persistido internamente como `senha_hash`, que nunca e
exposto em respostas.

#### Bloco 3 — Dashboard (metricas agregadas)

- `GET /api/v1/dashboard/stats` — retorna metricas agregadas em um unico request:

```json
{
  "total_livros": 12480,
  "total_exemplares": 35200,
  "exemplares_por_status": {
    "disponivel": 28400,
    "emprestado": 4200,
    "reservado": 1100,
    "manutencao": 1500
  },
  "total_autores": 3200,
  "total_editoras": 480,
  "total_categorias": 64,
  "total_usuarios": 52,
  "livros_recentes": [
    { "id_livro": 1, "titulo": "...", "autores": ["..."], "created_at": "..." }
  ],
  "atividade_recente": [
    { "acao_realizada": "created", "entidade_afetada": "livros", "data_hora": "...", "usuario": "..." }
  ]
}
```

- `livros_recentes`: ultimos 5 livros cadastrados (com autores).
- `atividade_recente`: ultimas 10 entradas de `logs_atividades` (com nome do usuario).
- Protegido por `auth:api` + `cargo:bibliotecario`.

#### Bloco 4 — Leitura de Logs de Auditoria

- `GET /api/v1/logs` — lista paginada de `logs_atividades` com filtros:
  - `entidade` (ex: `livros`, `exemplares`, `usuarios`)
  - `acao` (ex: `created`, `updated`, `deleted`)
  - `id_usuario` (filtra por autor da acao)
  - `de` / `ate` (intervalo de datas)
- Retorna com dados do usuario que executou a acao (join com `usuarios`).
- Apenas `bibliotecario`.
- Ordenacao: mais recente primeiro (`data_hora DESC`).

### O que NAO fazer

- **Circulacao** (emprestimos, devoluções) — feature separada futura.
- **Reservas** — feature separada futura.
- **Multas** — feature separada futura.
- **Membros/Leitores** — CRUD de membros com perfil expandido e feature separada futura.
  O CRUD de usuarios desta spec cobre apenas a tabela `usuarios` existente.
- **Relatórios analiticos** — fora do MVP (constituicao, principio V).
- **Notificacoes** — fora do MVP.
- **Endpoints publicos para leitor** — fora do MVP.
- **Importacao em massa** — fora do MVP.
- **Reset de senha / forgot password** — pode ser adicionado depois; nao e bloqueante.
- **Nao alterar** nada dos endpoints de catalogo ja implementados (001).

## User Scenarios & Testing

### User Story 1 — Autenticar no sistema (Priority: P0)

O bibliotecario precisa fazer login para acessar qualquer funcionalidade. Sem autenticacao,
todas as rotas retornam 401.

**Acceptance Scenarios**:

1. **Given** um usuario com email `biblio@hello.local` e senha `secret123` cadastrado no
   banco, **When** ele faz `POST /auth/login` com essas credenciais, **Then** recebe 200
   com `{ token, usuario: { id_usuario, nome_completo, email, cargo } }`.
2. **Given** credenciais invalidas, **When** faz `POST /auth/login`, **Then** recebe 401
   com mensagem de erro.
3. **Given** um token valido, **When** faz `POST /auth/logout`, **Then** o token e
   revogado e chamadas subsequentes com ele retornam 401.
4. **Given** um token prestes a expirar, **When** faz `POST /auth/refresh`, **Then** recebe
   um novo token valido e o anterior e revogado.
5. **Given** um token valido, **When** faz `GET /auth/me`, **Then** recebe os dados do
   usuario autenticado.

### User Story 2 — Gerenciar usuarios (Priority: P1)

O bibliotecario precisa criar contas para outros bibliotecarios e leitores, editar dados
e remover contas inativas.

**Acceptance Scenarios**:

1. **Given** o bibliotecario autenticado, **When** lista usuarios, **Then** recebe pagina
   com usuarios e paginacao.
2. **Given** nenhum usuario com email `novo@biblioteca.edu`, **When** cria usuario com
   `nome_completo`, email, senha e cargo, **Then** o usuario e criado e retornado (sem
   campo senha ou `senha_hash`).
3. **Given** ja existe usuario com email `biblio@hello.local`, **When** tenta criar outro
   com mesmo email, **Then** recebe 409 com erro `EMAIL_DUPLICADO`.
4. **Given** um usuario que nao e a propria conta autenticada e nao viola FKs existentes,
   **When** o bibliotecario o remove, **Then** retorna 204.
5. **Given** o bibliotecario tenta deletar a propria conta, **Then** recebe 409 com erro
   `AUTO_EXCLUSAO_PROIBIDA`.
6. **Given** o bibliotecario autenticado, **When** atualiza um usuario com campo opcional
   `senha`, **Then** a senha e substituida por hash novo e nao aparece na resposta.

### User Story 3 — Visualizar metricas no dashboard (Priority: P2)

O bibliotecario ao abrir o sistema quer ver um panorama geral: quantos livros, exemplares
por status, atividade recente.

**Acceptance Scenarios**:

1. **Given** o bibliotecario autenticado, **When** faz `GET /dashboard/stats`, **Then**
   recebe objeto com contagens, livros recentes e atividade recente.
2. **Given** nenhum livro cadastrado, **When** faz `GET /dashboard/stats`, **Then** recebe
   contagens zeradas e arrays vazios (sem erro).

### User Story 4 — Consultar log de auditoria (Priority: P2)

O bibliotecario precisa rastrear quem fez o que e quando, para fins de controle.

**Acceptance Scenarios**:

1. **Given** o bibliotecario autenticado, **When** faz `GET /logs`, **Then** recebe lista
   paginada de acoes com dados do usuario executor.
2. **Given** filtro `entidade=livros`, **When** consulta logs, **Then** recebe apenas
   acoes sobre livros.
3. **Given** filtro de datas `de=2026-06-01&ate=2026-06-15`, **When** consulta logs,
   **Then** recebe apenas acoes nesse intervalo.

## Technical Notes

- Seguir mesma arquitetura da 001: Controller -> Service -> Repository -> Eloquent.
- FormRequests para validacao de cada endpoint.
- Resources (API Resources) para formatacao de resposta.
- Testes de feature para cada user story (PHPUnit + Laravel TestCase).
- Nao criar migration para `tokens_acesso`; logout/refresh devem invalidar tokens via
  blacklist/cache do `jwt-auth`.
- Seeder: manter usuario admin padrao (`biblio@hello.local` / `secret123` / `bibliotecario`).
- OpenAPI: adicionar endpoints ao contrato em `specs/002-backend-complementar/contracts/openapi.yaml`.

## Dependencies

- **001-gestao-catalogo**: depende do schema existente (tabelas `usuarios`, `logs_atividades`,
  `livros`, `exemplares`, etc.) e da infraestrutura (middleware, listeners).
- **jwt-auth**: pacote `php-open-source-saver/jwt-auth` ja esta no `composer.json`.
