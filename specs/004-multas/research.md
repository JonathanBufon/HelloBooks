# Research — Multas e Notificacoes

**Phase**: 0
**Feature**: `004-multas`
**Date**: 2026-06-21

## R1: Dependencia de emprestimos/itens_emprestimo

**Problema**: A spec define que multas sao vinculadas a `itens_emprestimo`, mas as tabelas `emprestimos` e `itens_emprestimo` nao existem no banco. Nenhum model, migration, controller ou service de emprestimo foi implementado.

**Decision**: Criar tabelas `emprestimos` e `itens_emprestimo` com schema minimo nesta feature, suficiente para multas referenciarem. O CRUD completo de emprestimos (checkout, devolucao, renovacao) sera feature separada. As tabelas criadas aqui sao definitivas — a feature de emprestimos adicionara colunas/logica, nao recriara tabelas.

**Rationale**: Multas sao penalidades sobre emprestimos — vincular multa direto a exemplar+usuario perderia a rastreabilidade do contexto (qual emprestimo gerou a multa). Criar a tabela minima agora evita refatoracao futura e mantem o modelo de dominio correto.

**Alternatives considered**:
- Vincular multa diretamente a exemplar + usuario (sem emprestimo): Rejeitado porque perde contexto do emprestimo e nao permite auditar qual retirada gerou a multa.
- Esperar feature de emprestimos: Rejeitado porque bloqueia a entrega de multas sem necessidade — o schema minimo e trivial.

## R2: Notificacoes in-app — abordagem sem tabela

**Problema**: O leitor precisa ver notificacoes de multas pendentes. A constituicao proibe notificacoes por email/SMS/push. Como implementar?

**Decision**: Notificacoes sao derivadas em tempo real via endpoint `GET /auth/me` expandido (ou novo `GET /minhas-multas`) que retorna contagem e lista de multas pendentes do usuario logado. Nao ha tabela de notificacoes — a "notificacao" e a existencia de multas pendentes. O frontend exibe um badge no Topbar e uma tela de consulta para o leitor.

**Rationale**: Criar uma tabela de notificacoes adicionaria complexidade desnecessaria para o MVP. A multa pendente JA E a notificacao. O frontend consulta o backend ao montar o AppShell e exibe a contagem. Simplicidade alinhada com principio V (Disciplina de Escopo).

**Alternatives considered**:
- Tabela `notificacoes` com CRUD: Rejeitado por overengineering — multa pendente ja e a notificacao.
- WebSocket/SSE para push em tempo real: Rejeitado — fora de escopo do MVP, polling simples basta.

## R3: Acesso do leitor a multas

**Problema**: A constituicao lista "Interface de autoatendimento para leitor" como fora de escopo. Mas a spec exige que o leitor veja suas multas.

**Decision**: O leitor tera acesso minimo: ver badge de notificacao no Topbar + tela somente leitura `/minhas-multas`. Nao configura autoatendimento (nao paga, nao cancela, nao faz nada alem de ler). Isso se enquadra em "uso pelo leitor e minimo" da constituicao.

**Rationale**: O principio V permite uso minimo pelo leitor. Ver suas multas e o minimo necessario para que saiba que deve procurar o bibliotecario. A tela e read-only, sem qualquer acao.

**Alternatives considered**:
- Nao dar acesso nenhum ao leitor: Rejeitado porque o usuario pediu explicitamente notificacoes in-app para o leitor.

## R4: Endpoint de contagem de multas no /auth/me

**Problema**: O leitor precisa ver o badge de notificacao ao fazer login. Como entregar essa informacao sem criar endpoint separado obrigatorio?

**Decision**: Expandir a resposta de `GET /auth/me` com campo opcional `multas_pendentes` (count + total_valor) quando o usuario tem cargo `leitor`. Adicionalmente, criar `GET /minhas-multas` para a listagem completa. O bibliotecario nao recebe esse campo — ele consulta multas pela tela administrativa.

**Rationale**: Aproveitar o endpoint que ja e chamado no boot do frontend (useAuth) evita request adicional. O campo extra e leve (duas colunas agregadas).

**Alternatives considered**:
- Endpoint separado `GET /notificacoes`: Rejeitado por overengineering.
- Incluir em todos os cargos: Rejeitado — bibliotecario consulta multas pela tela administrativa.

## R5: Schema da tabela multas

**Decision**: Seguir o padrao existente (snake_case, portugues, bigserial PK, timestamptz). Campos:
- `id_multa` (PK)
- `id_item_emprestimo` (FK → itens_emprestimo)
- `motivo` (CHECK: atraso, rabisco, rasgo, dobra)
- `valor` (decimal 10,2, > 0)
- `status` (CHECK: pendente, paga, perdoada)
- `justificativa_perdao` (nullable, obrigatoria quando status = perdoada)
- `id_bibliotecario_baixa` (FK → usuarios, nullable, preenchido ao dar baixa)
- `data_baixa` (timestamptz, nullable)
- `created_at`, `updated_at`

**Rationale**: Segue os padroes de nomenclatura e tipos do projeto. `id_bibliotecario_baixa` rastreia quem deu baixa (auditoria). `justificativa_perdao` so e obrigatoria em perdao.

## R6: Rotas e permissoes

**Decision**:
- `GET /multas` — bibliotecario: lista paginada com filtros
- `POST /multas` — bibliotecario: registrar multa
- `PUT /multas/{id}/pagar` — bibliotecario: dar baixa
- `PUT /multas/{id}/perdoar` — bibliotecario: perdoar com justificativa
- `GET /minhas-multas` — leitor (auth:api, sem cargo): lista suas multas pendentes + historico

**Rationale**: Acoes de pagar e perdoar sao endpoints dedicados (nao PUT generico) para clareza semantica e validacao especifica. O leitor so acessa `/minhas-multas`.

**Alternatives considered**:
- PUT generico `/multas/{id}` com status no body: Rejeitado porque mistura validacoes distintas (pagar vs perdoar com justificativa).
