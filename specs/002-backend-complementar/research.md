# Research: Backend Complementar

**Feature**: 002-backend-complementar | **Date**: 2026-06-20

## Decision 1 — Persistencia de tokens JWT

**Decision**: Manter blacklist via cache (comportamento padrao do `jwt-auth`) e NAO criar
tabela `tokens_acesso`.

**Rationale**: O pacote `php-open-source-saver/jwt-auth` ja esta configurado com blacklist
via cache (Redis). Criar uma tabela `tokens_acesso` duplicaria a responsabilidade e
introduziria complexidade sem ganho real — o cache ja garante revogacao imediata via
`JWTAuth::invalidate()`. A constituicao menciona `tokens_acesso`, porem o espirito do
principio III (revogacao de sessao) e atendido: logout invalida o token no server-side
e chamadas subsequentes retornam 401.

**Alternatives considered**:
- Tabela `tokens_acesso` com hash do token: atenderia a letra da constituicao, mas
  adiciona migration, model, repository e consulta ao banco em cada request autenticado
  (verificar se token esta revogado). O cache e mais performatico para este caso.
- Nota: se futuramente for necessario listar sessoes ativas do usuario ou revogar todas
  as sessoes, a tabela pode ser adicionada como amendment.

## Decision 2 — Campos do model Usuario vs spec

**Decision**: Usar os campos existentes na tabela `usuarios` (`nome_completo`, `endereco`,
`senha_hash`, `cargo`, `email`) sem criar migration nova para renomear.

**Rationale**: A tabela ja existe com esses campos (migration `000001`). Renomear
`nome_completo` para `nome` quebraria os seeders e a feature 001. A spec 002 deve
alinhar seus endpoints aos campos reais: `nome_completo` (nao `nome`).

**Alternatives considered**:
- Renomear campo via migration: risco de quebrar 001 e seeders existentes.
- Alias no model (accessor `getNomeAttribute`): adiciona complexidade sem necessidade.

## Decision 3 — Estrutura do endpoint de dashboard

**Decision**: Endpoint unico `GET /api/v1/dashboard/stats` que agrega tudo em um request.

**Rationale**: O dashboard precisa de ~6 contagens + 2 listas curtas. Fazer 8 requests
separados seria ineficiente para o frontend. Um unico endpoint com queries otimizadas
(COUNT, LIMIT 5/10) resolve em <100ms.

**Alternatives considered**:
- Endpoints separados por metrica: mais RESTful em teoria, mas gera N+1 de requests
  no frontend e complica o loading state.
- Cache com Redis: pode ser adicionado depois se necessario; para ~50 usuarios
  simultaneos e <10k livros, a query direta e suficiente.

## Decision 4 — Estrategia de auth (rotas publicas vs protegidas)

**Decision**: Grupo de rotas `/auth/login` sem middleware; `/auth/logout`, `/auth/refresh`,
`/auth/me` com `auth:api`. Demais rotas de usuarios, dashboard e logs com
`auth:api` + `cargo:bibliotecario`.

**Rationale**: Login e a unica acao que um usuario nao autenticado precisa executar.
Refresh e logout exigem token valido. CRUD de usuarios, dashboard e logs sao operacoes
administrativas restritas ao bibliotecario.

**Alternatives considered**:
- Login com rate limiting: pode ser adicionado depois via middleware `throttle` do
  Laravel; nao e bloqueante para o MVP.

## Decision 5 — Auto-exclusao de usuario

**Decision**: Bloquear `DELETE /usuarios/{id}` quando `id` == usuario autenticado, com
erro 409 `AUTO_EXCLUSAO_PROIBIDA`.

**Rationale**: Evita que o unico bibliotecario se remova do sistema, ficando sem acesso
administrativo. Validacao simples no controller/service.

**Alternatives considered**:
- Permitir e confiar no frontend: fragil, facilmente contornavel via API direta.
- Validar se restam outros bibliotecarios: mais robusto, mas escopo desnecessario no MVP.

## Decision 6 — Formato de resposta de login

**Decision**: Retornar `{ token, token_type: "bearer", expires_in, usuario: {...} }`.

**Rationale**: Segue convencao do jwt-auth e fornece tudo que o frontend precisa em um
unico request (token + dados do usuario logado).

## Findings: Estado atual do backend

### JWT
- Pacote `php-open-source-saver/jwt-auth` v2.9 instalado.
- `config/auth.php`: guard `api` com driver `jwt`, provider `usuarios`.
- `config/jwt.php`: configuracao completa (TTL, blacklist, algoritmos).
- `.env.example`: `JWT_SECRET=hellobooks-dev-jwt-secret-32-bytes-minimum`.

### Model Usuario
- Extends `Authenticatable`, implements `JWTSubject`.
- Campos fillable: `nome_completo`, `endereco`, `cargo`, `email`, `senha_hash`.
- Cast `cargo` para enum `CargoUsuario`, `senha_hash` para `hashed`.
- Metodos JWT implementados: `getJWTIdentifier()`, `getJWTCustomClaims()` (inclui cargo).

### Audit
- `AuditarMutacao` listener funcional com metodos `created()`, `updated()`, `deleted()`.
- `LogAtividade` model com relacao `belongsTo(Usuario)`.
- Tabela `logs_atividades` com indices em `(entidade, registro, data_hora)` e `(usuario, data_hora)`.

### Seeder
- `UsuarioSeeder`: cria `biblio@hello.local` / `secret123` / `bibliotecario`.
- Chamado via `DatabaseSeeder`.

### Middleware
- `EnsureCargo`: verifica cargo do usuario, retorna 403 `CARGO_INSUFICIENTE`.
- Registrado como alias `cargo` em `bootstrap/app.php`.

### Repository Pattern
- 5 interfaces + 5 implementacoes Eloquent ja registradas no `AppServiceProvider`.
