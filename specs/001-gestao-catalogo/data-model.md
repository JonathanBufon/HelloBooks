# Data Model — Gestão de Catálogo

**Phase**: 1
**Feature**: `001-gestao-catalogo`
**Date**: 2026-06-10

Schema PostgreSQL para a feature. Todas as colunas em snake_case e em português,
conforme YAML base do projeto. Datas com hora em `timestamptz` (UTC); datas sem hora
em `date`.

## Tabelas

### `usuarios`

Suporta FKs de auditoria desta feature. Cadastro completo e endpoint de login são da
feature de autenticação, mas a tabela é criada aqui.

| Coluna        | Tipo                       | Constraints                                                                |
| ------------- | -------------------------- | -------------------------------------------------------------------------- |
| `id_usuario`  | `bigserial`                | PK                                                                         |
| `nome_completo` | `varchar(255)`           | NOT NULL                                                                   |
| `endereco`    | `varchar(500)`             | NULL (não bloqueante para o MVP)                                           |
| `cargo`       | `varchar(20)`              | NOT NULL, `CHECK (cargo IN ('bibliotecario','leitor'))`                    |
| `email`       | `varchar(255)`             | NOT NULL, UNIQUE                                                           |
| `senha_hash`  | `varchar(255)`             | NOT NULL                                                                   |
| `created_at`  | `timestamptz`              | NOT NULL                                                                   |
| `updated_at`  | `timestamptz`              | NOT NULL                                                                   |

Índices: `UNIQUE(email)`.

---

### `editoras`

| Coluna       | Tipo            | Constraints |
| ------------ | --------------- | ----------- |
| `id_editora` | `bigserial`     | PK          |
| `nome`       | `varchar(255)`  | NOT NULL    |
| `created_at` | `timestamptz`   | NOT NULL    |
| `updated_at` | `timestamptz`   | NOT NULL    |

Índices: `INDEX (lower(unaccent(nome)))` para busca acento-insensitive.

---

### `autores`

| Coluna      | Tipo            | Constraints |
| ----------- | --------------- | ----------- |
| `id_autor`  | `bigserial`     | PK          |
| `nome`      | `varchar(255)`  | NOT NULL    |
| `created_at`| `timestamptz`   | NOT NULL    |
| `updated_at`| `timestamptz`   | NOT NULL    |

Índices: `INDEX (lower(unaccent(nome)))`.

---

### `categorias`

| Coluna          | Tipo           | Constraints                |
| --------------- | -------------- | -------------------------- |
| `id_categoria`  | `bigserial`    | PK                         |
| `nome`          | `varchar(255)` | NOT NULL, UNIQUE           |
| `created_at`    | `timestamptz`  | NOT NULL                   |
| `updated_at`    | `timestamptz`  | NOT NULL                   |

Índices: `UNIQUE(nome)` (categorias são taxonomia controlada — sem duplicatas).

---

### `livros`

| Coluna             | Tipo            | Constraints                                                                       |
| ------------------ | --------------- | --------------------------------------------------------------------------------- |
| `id_livro`         | `bigserial`     | PK                                                                                |
| `id_editora`       | `bigint`        | NOT NULL, FK → `editoras(id_editora)` ON DELETE RESTRICT                          |
| `titulo`           | `varchar(255)`  | NOT NULL                                                                          |
| `isbn`             | `varchar(13)`   | NOT NULL, UNIQUE, `CHECK (char_length(isbn) BETWEEN 10 AND 13)`                   |
| `ano_publicacao`   | `smallint`      | NOT NULL, `CHECK (ano_publicacao BETWEEN 1000 AND extract(year from now())::int + 1)` |
| `created_at`       | `timestamptz`   | NOT NULL                                                                          |
| `updated_at`       | `timestamptz`   | NOT NULL                                                                          |

Índices: `UNIQUE(isbn)`, `INDEX(id_editora)`, `INDEX(lower(unaccent(titulo)))`.

---

### `exemplares`

| Coluna              | Tipo            | Constraints                                                                                                                  |
| ------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `id_exemplar`       | `bigserial`     | PK                                                                                                                           |
| `id_livro`          | `bigint`        | NOT NULL, FK → `livros(id_livro)` ON DELETE RESTRICT                                                                         |
| `status`            | `varchar(20)`   | NOT NULL DEFAULT `'disponivel'`, `CHECK (status IN ('disponivel','emprestado','reservado','manutencao'))`                    |
| `condicao_fisica`   | `varchar(20)`   | NOT NULL DEFAULT `'intacto'`, `CHECK (condicao_fisica IN ('intacto','rabiscado','rasgado','dobrado'))`                       |
| `created_at`        | `timestamptz`   | NOT NULL                                                                                                                     |
| `updated_at`        | `timestamptz`   | NOT NULL                                                                                                                     |

Índices: `INDEX(id_livro, status)` para acelerar contagem por status na tela de
detalhe de livro.

---

### `livros_autores`

Associativa N:M. Não há `id` próprio — chave composta.

| Coluna     | Tipo     | Constraints                                                  |
| ---------- | -------- | ------------------------------------------------------------ |
| `id_livro` | `bigint` | NOT NULL, FK → `livros(id_livro)` ON DELETE CASCADE          |
| `id_autor` | `bigint` | NOT NULL, FK → `autores(id_autor)` ON DELETE RESTRICT        |

Chave primária composta: `PRIMARY KEY (id_livro, id_autor)`.
Índices adicionais: `INDEX(id_autor)` (consulta "livros deste autor").

`CASCADE` em `id_livro`: quando um livro é removido (já sob outras restrições), suas
associações somem junto. `RESTRICT` em `id_autor`: não permite deletar um autor ainda
referenciado (alinha com FR-016).

---

### `livros_categorias`

Mesma estrutura conceitual.

| Coluna         | Tipo     | Constraints                                                          |
| -------------- | -------- | -------------------------------------------------------------------- |
| `id_livro`     | `bigint` | NOT NULL, FK → `livros(id_livro)` ON DELETE CASCADE                  |
| `id_categoria` | `bigint` | NOT NULL, FK → `categorias(id_categoria)` ON DELETE RESTRICT         |

Chave primária composta: `PRIMARY KEY (id_livro, id_categoria)`.
Índices adicionais: `INDEX(id_categoria)`.

---

### `logs_atividades`

Auditoria de TODA mutação em catálogo (e em outras features futuras).

| Coluna                | Tipo            | Constraints                                              |
| --------------------- | --------------- | -------------------------------------------------------- |
| `id_log`              | `bigserial`     | PK                                                       |
| `id_usuario`          | `bigint`        | NOT NULL, FK → `usuarios(id_usuario)` ON DELETE RESTRICT |
| `acao_realizada`      | `varchar(20)`   | NOT NULL, `CHECK (acao_realizada IN ('created','updated','deleted'))` |
| `entidade_afetada`    | `varchar(50)`   | NOT NULL  (ex.: `livros`, `exemplares`, `livros_autores`) |
| `id_registro_afetado` | `varchar(100)`  | NOT NULL (string para suportar PKs compostas — ex.: `"42:7"` para pivot) |
| `data_hora`           | `timestamptz`   | NOT NULL DEFAULT `now()`                                 |

Índices: `INDEX(entidade_afetada, id_registro_afetado, data_hora DESC)`,
`INDEX(id_usuario, data_hora DESC)`.

Particionamento: fora do escopo do MVP. Tabela cresce monotônica; revisitar em ~12
meses se o volume justificar.

---

## Transições de estado do `Exemplar`

Implementadas em `app/Domain/Exemplar/StatusTransition.php`. Qualquer tentativa fora
da matriz lança `InvalidStatusTransitionException` (HTTP 409).

| De \ Para     | disponivel | emprestado | reservado | manutencao |
| ------------- | ---------- | ---------- | --------- | ---------- |
| **disponivel** | ✗ (no-op)  | ✓          | ✓         | ✓          |
| **emprestado** | ✓ *(só via devolução — fora desta feature)* | ✗ | ✗ | ✓ |
| **reservado** | ✓ *(só via cancelamento de reserva — fora desta feature)* | ✓ *(via efetivação de reserva — fora desta feature)* | ✗ (no-op) | ✓ |
| **manutencao** | ✓          | ✗          | ✗         | ✗ (no-op)  |

Nesta feature de catálogo, o bibliotecário pode acionar diretamente:
- `disponivel → manutencao` (detectou dano)
- `manutencao → disponivel` (reparou)
- `disponivel → reservado` e `disponivel → emprestado` ocorrem por outras features
  (reserva, empréstimo); ficam **proibidos** via API de catálogo (recusados em
  middleware de transição).

## Regras derivadas dos requisitos (FRs)

| FR     | Regra                                                                       | Implementação                                                                              |
| ------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| FR-001 | Livro exige editora + ≥1 autor + ≥1 categoria                                | Validação em `LivroService::criar` dentro de `DB::transaction`                              |
| FR-002 | ISBN único                                                                  | `UNIQUE(isbn)` no schema + tratamento de `QueryException` 23505 → HTTP 409                  |
| FR-005 | Exemplar nasce com status `disponivel` e condição `intacto`                 | `DEFAULT` no schema; ignorar overrides do body                                              |
| FR-007 | Transição válida de status                                                  | `StatusTransition` valida antes do `update`                                                 |
| FR-016 | Bloqueia delete de autor/editora/categoria com livros referenciando         | `ON DELETE RESTRICT` nas FKs                                                                |
| FR-017 | Bloqueia delete de livro com exemplares ou histórico                        | `ON DELETE RESTRICT` em exemplares; verificação no Service para `itens_emprestimo` (futuro) |
| FR-018 | Bloqueia delete de exemplar `emprestado` ou `reservado`                     | Verificação em `ExemplarService::remover`                                                   |
| FR-020 | Apenas `bibliotecario` acessa                                               | Middleware `EnsureCargo:bibliotecario` em `routes/api.php`                                   |
| FR-021 | Log de toda mutação em catálogo                                              | Listener `AuditarMutacao` registrado nos models Eloquent                                    |
| FR-023 | Ano entre 1000 e ano corrente+1                                              | `CHECK` no schema + validação no FormRequest                                                 |
| FR-024 | ISBN 10..13 chars                                                            | `CHECK` no schema + validação no FormRequest                                                 |

## Migrations (ordem)

1. `usuarios`
2. `editoras`
3. `autores`
4. `categorias`
5. `livros`
6. `exemplares`
7. `livros_autores`
8. `livros_categorias`
9. `logs_atividades`
10. (Migration "0000_enable_unaccent" ANTES das demais: `CREATE EXTENSION IF NOT EXISTS unaccent`)

A migration de extensão deve rodar antes das que criam índices funcionais com
`unaccent`. Renumerar timestamps para garantir ordem.
