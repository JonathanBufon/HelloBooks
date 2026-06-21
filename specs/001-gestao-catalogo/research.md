# Research — Gestão de Catálogo

**Phase**: 0
**Feature**: `001-gestao-catalogo`
**Date**: 2026-06-10

Este documento registra decisões técnicas que afetam o plano. Cada entrada segue o
formato **Decision / Rationale / Alternatives**.

---

## D-001 — Layout do repositório: monorepo único

**Decision**: Monorepo único contendo backend Laravel em `backend/` e frontend React
em `frontend/`. Infra de dev em `docker/`. Contratos em `specs/<feature>/contracts/`.

**Rationale**:
- Confirmado pelo usuário em 2026-06-10: "vamo fazer um monorepo aqui, API, front, tudo
  fica aqui".
- Sincronização entre tipos do backend e tipos do frontend fica trivial (poderemos
  derivar tipos TS do OpenAPI no mesmo workspace).
- Comandos `/speckit-*` produzem artefatos em `specs/` que serão consumidos por ambos
  os lados; um único repo evita divergência de versão de contrato.

**Alternatives considered**:
- Dois repos (api / web) — descartado: overhead de sincronização desproporcional ao
  tamanho do time.
- Monorepo com pnpm workspaces englobando o PHP — descartado: PHP não é pacote npm,
  ganho nulo.

---

## D-002 — Autenticação: `php-open-source-saver/jwt-auth`

**Decision**: Adotar `php-open-source-saver/jwt-auth` (fork mantido de
`tymon/jwt-auth`) como provedor de JWT no Laravel. Tabela `tokens_acesso` modelada
nesta plan para receber os tokens emitidos quando a feature de autenticação for
implementada; esta feature de catálogo já consome o guard JWT, mas o **endpoint de
login não é entregue aqui** (é da feature de auth).

**Rationale**:
- Constituição (Princípio III) exige JWT com persistência em `tokens_acesso` e
  revogação — `jwt-auth` suporta blacklist e personalização de claims.
- Sanctum, embora oficial do Laravel, prioriza tokens opacos / SPA cookie-based;
  forçá-lo a emitir JWT real é trabalho extra.
- Passport (OAuth2 completo) é overkill para um único cliente SPA interno.

**Alternatives considered**:
- Laravel Sanctum — descartado pelos motivos acima.
- Laravel Passport — overkill.
- Implementação manual com `firebase/php-jwt` + guard custom — descartado: aumenta
  superfície de erro de segurança sem ganho.

**Esta feature**:
- Configura o guard `api` para JWT em `config/auth.php`.
- Aplica `auth:api` + `EnsureCargo:bibliotecario` nas rotas de catálogo.
- A migration `usuarios` é criada aqui (precisamos do FK target para
  `logs_atividades`).
- A migration `tokens_acesso`, o endpoint `POST /api/v1/auth/login`, a emissão e a
  revogação de token ficam para a feature de autenticação (próxima na fila).

---

## D-003 — Geração e versionamento do OpenAPI

**Decision**: OpenAPI 3.1 **mantido à mão** em `specs/001-gestao-catalogo/contracts/openapi.yaml`.
O arquivo é a fonte de verdade do contrato. Anotações em código (l5-swagger) NÃO são
usadas nesta feature.

**Rationale**:
- Princípio I exige contrato definido **antes** da implementação. Anotações em código
  invertem esta ordem — o contrato passa a ser efeito colateral da implementação.
- Arquivo YAML versionado é grep-ável, diff-ável e legível em revisão de código sem
  abrir UI.
- O OpenAPI é a fonte para a collection do Postman (D-005) e potencialmente para
  geração de tipos TS no frontend.

**Alternatives considered**:
- `darkaonline/l5-swagger` com anotações nos controllers — descartado: contrato
  fica acoplado à implementação.
- Geração programática via reflection — descartado: alto custo de manutenção.

---

## D-004 — Estratégia de testes do backend

**Decision**: PHPUnit 11 + Laravel Test, executando contra **PostgreSQL real em
container Docker**. `RefreshDatabase` para isolar transações por teste. Sem SQLite.

**Rationale**:
- Princípio IV: integridade transacional e ENUMs nativos do Postgres NÃO se comportam
  igual no SQLite. Testar contra Postgres é o que valida o comportamento real.
- Schema usa `CHECK constraint` e tipos enum nativos (D-007) — SQLite ignora ambos.
- O `docker-compose` de dev já sobe Postgres; a CI usa a mesma imagem.

**Alternatives considered**:
- SQLite em memória — descartado pelo motivo acima.
- Postgres compartilhado entre testes (sem reset) — descartado: testes flaky.

---

## D-005 — Collection do Postman: gerada a partir do OpenAPI

**Decision**: A collection Postman é **derivada automaticamente** do `openapi.yaml`
usando a ferramenta `openapi-to-postmanv2` (CLI Node, da Postman). Comando documentado
no `quickstart.md` e adicionado a um script `npm run gen:postman` na raiz.

**Rationale**:
- Entrega 3.3 do projeto: collection Postman para documentar e demonstrar a API.
- Gerar do OpenAPI evita drift entre contrato e collection (single source of truth).
- Manter a collection editada à mão divergeria rapidamente da especificação a cada
  alteração.

**Alternatives considered**:
- Construir collection à mão no app Postman e exportar — descartado: divergência
  inevitável.
- Postman API com sync automático — descartado: requer conta Postman e overhead de
  setup.

**Variáveis de ambiente da collection**:
- `{{base_url}}` → `http://localhost:8015/api/v1`
- `{{jwt_token}}` → preenchida manualmente após login (gerada pela feature de auth)

---

## D-006 — Camada Repository: padrão final

**Decision**: Repositório com interface explícita (`LivroRepositoryInterface`)
implementada por `EloquentLivroRepository`. Binding via `AppServiceProvider`.

**Rationale**:
- Princípio II exige isolamento da persistência. Interface deixa explícito o contrato
  que o Service consome.
- Permite mockar repositório em testes unitários de Service sem subir banco.
- Custo de manutenção razoável dado que temos só 5 repositórios nesta feature.

**Alternatives considered**:
- Sem interface, apenas classe concreta — descartado: viola o "Repositories são a
  única porta" do Princípio II por permitir Eloquent direto em outros pontos.
- Eloquent diretamente no Service — descartado: acopla domínio à persistência.

---

## D-007 — Modelagem de enums no Postgres

**Decision**: Colunas de enum (`cargo`, `status` do exemplar, `condicao_fisica`,
`status` de empréstimo etc.) modeladas como **`VARCHAR + CHECK constraint`** em vez de
`CREATE TYPE` nativo do Postgres.

**Rationale**:
- Alterar valores em ENUM nativo do Postgres exige `ALTER TYPE` e tem armadilhas em
  migrations Laravel.
- `CHECK constraint` é fácil de adicionar/remover via migration padrão e funciona
  perfeitamente para o conjunto pequeno e estável de valores que temos.
- Eloquent + cast para `BackedEnum` PHP cobre a parte de domínio (tipagem) sem
  precisar do enum nativo do banco.

**Alternatives considered**:
- ENUM nativo do Postgres (`CREATE TYPE`) — descartado pela dor de evoluir.
- String livre + validação só em PHP — descartado: viola Princípio IV (validação no
  banco protege contra inserts diretos).

---

## D-008 — Auditoria via Eloquent Events

**Decision**: Uma classe `AuditarMutacao` se inscreve nos eventos `created`, `updated`,
`deleted` dos models de catálogo (`Livro`, `Autor`, `Editora`, `Categoria`, `Exemplar`,
e pivots `LivroAutor`, `LivroCategoria`). Cada evento grava uma linha em
`logs_atividades` com `id_usuario` (via `Auth::id()`), ação, entidade e id afetado.

**Rationale**:
- Princípio III exige log para toda mutação. Centralizar no listener evita lembrar
  de logar em cada Service.
- Eventos Eloquent disparam dentro da mesma transação — log e mutação ficam juntos
  no rollback.

**Alternatives considered**:
- Decorator no Service que grava log — descartado: duplica código em cada Service.
- Trigger no Postgres — descartado: log perde contexto do `id_usuario` da sessão
  HTTP.
- Package `spatie/laravel-activitylog` — considerado, mas adiciona dependência
  externa para algo que tem 30 linhas. Descartado para o MVP; pode ser adotado depois
  se a tabela própria provar limitação.

---

## D-009 — Paginação

**Decision**: Paginação padrão Laravel (`->paginate(20)`), retornando metadata
(`total`, `per_page`, `current_page`, `last_page`) no envelope JSON.

**Rationale**:
- FR-009 exige page size 20 e indicação de total.
- O wrapper padrão do Laravel já entrega esse formato; não há motivo para reinventar.

**Alternatives considered**:
- Cursor pagination — descartado: o catálogo terá uso de busca/listagem com saltos
  arbitrários de página, não scroll infinito.

---

## D-010 — Busca acento-insensitive em Postgres

**Decision**: Habilitar a extensão `unaccent` no Postgres e usar
`unaccent(coluna) ILIKE unaccent(:termo)` na query de busca. Migration habilita
`CREATE EXTENSION IF NOT EXISTS unaccent`.

**Rationale**:
- FR-010 exige busca case-insensitive e acento-insensitive.
- `unaccent` é a forma idiomática no Postgres e permite criar índice funcional
  (`CREATE INDEX ... ON livros (lower(unaccent(titulo)))`) para sustentar SC-002
  (busca < 1s em 10k livros).

**Alternatives considered**:
- Normalização em PHP antes de salvar duplicata da coluna — descartado: aumenta
  superfície de bug e duplicação de dado.
- Full-text search (`tsvector`) — overkill para o MVP; reavaliar pós-MVP se a busca
  precisar de ranking.
