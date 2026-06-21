# Data Model — Multas e Notificacoes

**Phase**: 1
**Feature**: `004-multas`
**Date**: 2026-06-21

Schema PostgreSQL para a feature. Colunas em snake_case e em portugues.
Datas com hora em `timestamptz` (UTC).

## Tabelas existentes (sem alteracao)

### `usuarios`

Tabela ja criada na feature 001. Nenhuma alteracao. Referenciada por:
- `emprestimos.id_usuario` (quem fez o emprestimo)
- `multas.id_bibliotecario_baixa` (quem deu baixa na multa)

### `exemplares`

Tabela ja criada na feature 001. Nenhuma alteracao. Referenciada por:
- `itens_emprestimo.id_exemplar`

### `logs_atividades`

Tabela ja criada na feature 001. Nenhuma alteracao. Multas geram logs via
`AuditarMutacao` listener.

## Novas tabelas

### `emprestimos`

Schema minimo para suportar multas. CRUD completo de emprestimos sera
feature separada — esta migration cria a estrutura definitiva.

| Coluna | Tipo | Constraints |
|---|---|---|
| `id_emprestimo` | `bigserial` | PK |
| `id_usuario` | `bigint` | NOT NULL, FK -> `usuarios(id_usuario)` ON DELETE RESTRICT |
| `data_retirada` | `timestamptz` | NOT NULL |
| `data_devolucao_prevista` | `date` | NOT NULL |
| `data_devolucao_real` | `timestamptz` | NULL (preenchido na devolucao) |
| `status` | `varchar(20)` | NOT NULL DEFAULT `'ativo'`, CHECK (`ativo`, `devolvido`, `atrasado`) |
| `created_at` | `timestamptz` | NOT NULL |
| `updated_at` | `timestamptz` | NOT NULL |

Indices: `INDEX(id_usuario, status)`, `INDEX(data_devolucao_prevista)`.

---

### `itens_emprestimo`

Cada exemplar emprestado e um item. Um emprestimo pode ter N itens.

| Coluna | Tipo | Constraints |
|---|---|---|
| `id_item_emprestimo` | `bigserial` | PK |
| `id_emprestimo` | `bigint` | NOT NULL, FK -> `emprestimos(id_emprestimo)` ON DELETE RESTRICT |
| `id_exemplar` | `bigint` | NOT NULL, FK -> `exemplares(id_exemplar)` ON DELETE RESTRICT |
| `data_devolucao_item` | `timestamptz` | NULL |
| `created_at` | `timestamptz` | NOT NULL |
| `updated_at` | `timestamptz` | NOT NULL |

Indices: `INDEX(id_emprestimo)`, `INDEX(id_exemplar)`.

---

### `multas`

Penalidade financeira vinculada a um item de emprestimo.

| Coluna | Tipo | Constraints |
|---|---|---|
| `id_multa` | `bigserial` | PK |
| `id_item_emprestimo` | `bigint` | NOT NULL, FK -> `itens_emprestimo(id_item_emprestimo)` ON DELETE RESTRICT |
| `motivo` | `varchar(20)` | NOT NULL, CHECK (`atraso`, `rabisco`, `rasgo`, `dobra`) |
| `valor` | `decimal(10,2)` | NOT NULL, CHECK (`valor > 0`) |
| `status` | `varchar(20)` | NOT NULL DEFAULT `'pendente'`, CHECK (`pendente`, `paga`, `perdoada`) |
| `justificativa_perdao` | `text` | NULL (obrigatorio quando status = perdoada) |
| `id_bibliotecario_baixa` | `bigint` | NULL, FK -> `usuarios(id_usuario)` ON DELETE RESTRICT |
| `data_baixa` | `timestamptz` | NULL (preenchido ao pagar ou perdoar) |
| `created_at` | `timestamptz` | NOT NULL |
| `updated_at` | `timestamptz` | NOT NULL |

Indices:
- `UNIQUE(id_item_emprestimo, motivo)` — impede duplicidade de multa por item+motivo
- `INDEX(status)` — filtro mais comum
- `INDEX(id_bibliotecario_baixa)`

Constraint adicional:
- `CHECK ((status != 'perdoada') OR (justificativa_perdao IS NOT NULL))` — perdoada exige justificativa

---

## Relacionamentos

```
Usuario 1──N Emprestimo         (id_usuario FK, RESTRICT)
Emprestimo 1──N ItemEmprestimo  (id_emprestimo FK, RESTRICT)
Exemplar 1──N ItemEmprestimo    (id_exemplar FK, RESTRICT)
ItemEmprestimo 1──N Multa       (id_item_emprestimo FK, RESTRICT)
Usuario 1──N Multa              (id_bibliotecario_baixa FK, RESTRICT) [quem deu baixa]
```

Caminho de consulta leitor → multas:
```
Usuario → Emprestimo → ItemEmprestimo → Multa
```

## Transicoes de estado da Multa

| De \ Para | pendente | paga | perdoada |
|---|---|---|---|
| **pendente** | - (no-op) | PERMITIDO (dar baixa) | PERMITIDO (perdoar com justificativa) |
| **paga** | PROIBIDO | - (no-op) | PROIBIDO |
| **perdoada** | PROIBIDO | PROIBIDO | - (no-op) |

Transicoes sao unidirecionais: `pendente → paga` e `pendente → perdoada`. Nao ha caminho de volta.

Implementar em `app/Domain/Multa/StatusMultaTransition.php` seguindo o padrao de `StatusTransition.php` dos exemplares.

## Regras derivadas dos requisitos (FRs)

| FR | Regra | Implementacao |
|---|---|---|
| FR-001 | Multa vinculada a item de emprestimo | FK `id_item_emprestimo` NOT NULL, RESTRICT |
| FR-006 | Valor > 0 | CHECK constraint no schema + validacao no FormRequest |
| FR-008 | Sem duplicidade item+motivo | UNIQUE(id_item_emprestimo, motivo) |
| FR-010 | Registrar bibliotecario que deu baixa | `id_bibliotecario_baixa` preenchido ao pagar/perdoar |
| FR-011/FR-024 | Status irreversivel | `StatusMultaTransition` valida transicao |
| FR-023 | Perdao exige justificativa | CHECK constraint + validacao no FormRequest |
| FR-025 | Auditoria de toda mutacao | `AuditableTrait` no model Multa |
| FR-027 | Apenas bibliotecario muta multas | Middleware `cargo:bibliotecario` nas rotas de escrita |

## Migrations (ordem)

1. `create_emprestimos_table` — tabela de emprestimos (schema minimo)
2. `create_itens_emprestimo_table` — itens de emprestimo
3. `create_multas_table` — tabela de multas com todas as constraints
