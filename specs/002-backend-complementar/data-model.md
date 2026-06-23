# Data Model: Backend Complementar

**Feature**: 002-backend-complementar | **Date**: 2026-06-20

## Entidades existentes (sem alteracao)

### usuarios

Tabela ja criada na migration `2026_06_10_000001`. Nenhuma alteracao necessaria.

| Campo | Tipo | Constraint |
|---|---|---|
| `id_usuario` | bigint PK | auto increment |
| `nome_completo` | varchar(255) | NOT NULL |
| `endereco` | varchar(255) | nullable |
| `cargo` | varchar(20) | CHECK ('bibliotecario', 'leitor') |
| `email` | varchar(255) | UNIQUE, NOT NULL |
| `senha_hash` | varchar(255) | NOT NULL |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### logs_atividades

Tabela ja criada na migration `2026_06_10_000009`. Nenhuma alteracao necessaria.

| Campo | Tipo | Constraint |
|---|---|---|
| `id_log` | bigint PK | auto increment |
| `id_usuario` | bigint FK | -> usuarios.id_usuario RESTRICT |
| `acao_realizada` | varchar(20) | CHECK ('created', 'updated', 'deleted') |
| `entidade_afetada` | varchar(50) | NOT NULL |
| `id_registro_afetado` | varchar(100) | NOT NULL |
| `data_hora` | timestamptz | DEFAULT now() |

Indices existentes:
- `(entidade_afetada, id_registro_afetado, data_hora)`
- `(id_usuario, data_hora)`

## Novas migrations

Nenhuma nova migration necessaria. Todas as tabelas ja existem.

## Entidades do dominio (novos artefatos de codigo)

### AuthController (novo)

Nao e entidade de banco — e controller que orquestra login/logout/refresh/me usando
o guard JWT ja configurado.

### UsuarioResource (novo)

Campos expostos na API:

```json
{
  "id_usuario": 1,
  "nome_completo": "Bibliotecario HelloBooks",
  "email": "biblio@hello.local",
  "cargo": "bibliotecario",
  "endereco": "Rua X, 123",
  "created_at": "2026-06-10T00:00:00Z",
  "updated_at": "2026-06-10T00:00:00Z"
}
```

Campo `senha_hash` NUNCA exposto (ja declarado em `$hidden` do model).

### LogAtividadeResource (novo)

Campos expostos na API:

```json
{
  "id_log": 42,
  "acao_realizada": "created",
  "entidade_afetada": "livros",
  "id_registro_afetado": "15",
  "data_hora": "2026-06-15T14:30:00Z",
  "usuario": {
    "id_usuario": 1,
    "nome_completo": "Bibliotecario HelloBooks"
  }
}
```

### DashboardStatsResource (novo)

Estrutura da resposta:

```json
{
  "total_livros": 0,
  "total_exemplares": 0,
  "exemplares_por_status": {
    "disponivel": 0,
    "emprestado": 0,
    "reservado": 0,
    "manutencao": 0
  },
  "total_autores": 0,
  "total_editoras": 0,
  "total_categorias": 0,
  "total_usuarios": 0,
  "livros_recentes": [],
  "atividade_recente": []
}
```

## Relacionamentos

```
Usuario 1──N LogAtividade    (id_usuario FK, RESTRICT)
Usuario 1──N Livro           (via logs, indireta)
```

Nenhum novo relacionamento de banco. Os relacionamentos existentes entre livros,
autores, editoras, categorias e exemplares permanecem inalterados.

## Transicoes de estado

Nenhuma transicao de estado nova. O campo `cargo` de `usuarios` e imutavel em termos
de maquina de estados — e um valor definido na criacao e editavel livremente pelo
bibliotecario (sem restricao de transicao).
