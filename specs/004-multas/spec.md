# Feature Specification: Multas

**Feature Branch**: `004-multas`

**Created**: 2026-06-20

**Status**: Draft

**Input**: User description: "faz uma spec 004 documentando sobre as multas"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar multa em devolucao com atraso ou dano (Priority: P1)

O bibliotecario precisa registrar uma multa quando um exemplar e devolvido fora do prazo ou com dano fisico, para manter o historico financeiro e operacional vinculado ao emprestimo.

**Why this priority**: Sem registro confiavel de multa, a biblioteca perde controle sobre penalidades por atraso e danos, e nao consegue justificar bloqueios ou regularizacoes futuras.

**Independent Test**: Pode ser testado ao selecionar um item de emprestimo elegivel, informar motivo e valor da multa, salvar, e verificar que a multa fica vinculada ao item correto com status pendente.

**Acceptance Scenarios**:

1. **Given** um item de emprestimo devolvido com atraso, **When** o bibliotecario registra uma multa por atraso com valor valido, **Then** a multa fica pendente e vinculada ao item de emprestimo.
2. **Given** um item de emprestimo devolvido com exemplar danificado, **When** o bibliotecario registra uma multa por dano, **Then** a multa registra o motivo especifico do dano e o valor cobrado.
3. **Given** um item de emprestimo sem atraso nem dano informado, **When** o bibliotecario tenta registrar multa sem motivo valido, **Then** o sistema impede o registro e informa o erro de negocio.

---

### User Story 2 - Consultar e filtrar multas (Priority: P1)

O bibliotecario precisa consultar multas por usuario, status, motivo e periodo, para acompanhar pendencias e responder rapidamente a duvidas no balcao.

**Why this priority**: A consulta e essencial para operacao diaria, conciliacao de pendencias e atendimento ao usuario.

**Independent Test**: Pode ser testado criando multas com status e motivos distintos, usando filtros e confirmando que a listagem mostra apenas os resultados correspondentes.

**Acceptance Scenarios**:

1. **Given** existem multas pendentes, pagas e perdoadas, **When** o bibliotecario filtra por status pendente, **Then** apenas multas pendentes aparecem.
2. **Given** um usuario possui multas em diferentes emprestimos, **When** o bibliotecario busca pelo usuario, **Then** todas as multas desse usuario aparecem com livro, exemplar, motivo, valor e status.
3. **Given** nao existem multas para os filtros informados, **When** a consulta e executada, **Then** o sistema exibe estado vazio claro sem inventar dados.

---

### User Story 3 - Regularizar multa (Priority: P2)

O bibliotecario precisa marcar multas como pagas ou perdoadas, mantendo justificativa e rastreabilidade para auditoria.

**Why this priority**: A biblioteca precisa encerrar pendencias financeiras de forma controlada e auditavel, especialmente quando uma multa e perdoada por decisao administrativa.

**Independent Test**: Pode ser testado ao selecionar uma multa pendente, alterar seu status para paga ou perdoada, informar justificativa quando aplicavel, e verificar que a mudanca fica registrada.

**Acceptance Scenarios**:

1. **Given** uma multa pendente, **When** o bibliotecario marca como paga, **Then** a multa muda para paga e deixa de contar como pendencia aberta.
2. **Given** uma multa pendente, **When** o bibliotecario perdoa a multa com justificativa, **Then** a multa muda para perdoada e a justificativa fica disponivel para consulta.
3. **Given** uma multa ja paga ou perdoada, **When** o bibliotecario tenta altera-la novamente, **Then** o sistema impede alteracoes que quebrariam a rastreabilidade.

---

### User Story 4 - Ver pendencias no contexto do usuario (Priority: P3)

O bibliotecario precisa ver rapidamente se um usuario possui multas pendentes ao consultar sua conta ou iniciar atendimento, para decidir se pode prosseguir com novas operacoes.

**Why this priority**: Este fluxo reduz erros no atendimento, mas depende das telas de usuarios e circulacao estarem integradas ao controle de multas.

**Independent Test**: Pode ser testado ao abrir um usuario com multas pendentes e confirmar que o total pendente e o bloqueio operacional aparecem de forma clara.

**Acceptance Scenarios**:

1. **Given** um usuario possui uma ou mais multas pendentes, **When** o bibliotecario consulta esse usuario, **Then** o sistema mostra total pendente e lista resumida das multas abertas.
2. **Given** um usuario nao possui multas pendentes, **When** o bibliotecario consulta esse usuario, **Then** o sistema indica que nao ha pendencias financeiras.

### Edge Cases

- Multa duplicada para o mesmo item de emprestimo e mesmo motivo deve ser bloqueada ou apresentada como conflito.
- Valor de multa deve ser maior que zero para multas pendentes ou pagas.
- Multa perdoada deve exigir justificativa administrativa.
- Multas de itens removidos ou livros removidos devem manter dados historicos suficientes para auditoria.
- Usuarios removidos ou inativos nao devem apagar historico de multas ja registradas.
- Se um item de emprestimo ainda nao foi devolvido, multa por dano fisico so pode ser registrada quando houver avaliacao documentada do exemplar.
- Filtros sem resultado devem mostrar estado vazio, nao erro.
- Tentativas de alteracao por usuario sem permissao devem ser negadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que bibliotecarios registrem multas vinculadas a um item de emprestimo existente.
- **FR-002**: Cada multa MUST ter motivo, valor, status, data de criacao e vinculo com o item de emprestimo que originou a penalidade.
- **FR-003**: Os motivos permitidos MUST incluir atraso, dano por rabisco, dano por rasgo e dano por dobra.
- **FR-004**: Os status permitidos MUST incluir pendente, paga e perdoada.
- **FR-005**: Ao criar uma multa, o status inicial MUST ser pendente.
- **FR-006**: O sistema MUST impedir valores negativos ou iguais a zero para multas pendentes ou pagas.
- **FR-007**: O sistema MUST impedir multa sem motivo valido.
- **FR-008**: O sistema MUST impedir duplicidade de multa para o mesmo item de emprestimo e mesmo motivo, salvo quando uma politica administrativa futura permitir reaplicacao documentada.
- **FR-009**: Bibliotecarios MUST be able to consultar multas por status, motivo, usuario, livro ou periodo.
- **FR-010**: A listagem de multas MUST mostrar usuario, livro, exemplar, motivo, valor, status e data de registro.
- **FR-011**: Bibliotecarios MUST be able to marcar multa pendente como paga.
- **FR-012**: Bibliotecarios MUST be able to marcar multa pendente como perdoada com justificativa obrigatoria.
- **FR-013**: Multas pagas ou perdoadas MUST NOT voltar para pendente sem processo administrativo separado.
- **FR-014**: O sistema MUST apresentar o total de multas pendentes de um usuario quando esse usuario for consultado em contexto operacional.
- **FR-015**: Toda criacao, pagamento ou perdao de multa MUST gerar registro de auditoria com usuario executor, acao, entidade afetada, identificador do registro e data/hora.
- **FR-016**: O historico de multas MUST permanecer consultavel mesmo quando dados relacionados ficarem inativos, desde que isso seja necessario para auditoria.
- **FR-017**: Usuarios sem permissao de bibliotecario MUST NOT criar, alterar, perdoar ou excluir multas.
- **FR-018**: O sistema MUST exibir mensagens claras para conflitos, falta de permissao, validacao de valor e item de emprestimo inexistente.

### Key Entities *(include if feature involves data)*

- **Multa**: Penalidade financeira ou administrativa vinculada a um item de emprestimo. Possui motivo, valor, status, data de criacao e historico de regularizacao.
- **Item de Emprestimo**: Item especifico que representa o exemplar emprestado e origina a multa por atraso ou dano.
- **Usuario**: Pessoa associada ao emprestimo e responsavel pela pendencia apresentada ao bibliotecario.
- **Exemplar**: Unidade fisica do livro cuja devolucao ou condicao pode gerar multa.
- **Regularizacao de Multa**: Evento de pagamento ou perdao que encerra uma multa pendente e deve preservar rastreabilidade.
- **Log de Atividade**: Registro auditavel de criacao ou mudanca de estado de multa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Bibliotecarios conseguem registrar uma multa valida em menos de 2 minutos a partir do item de emprestimo correspondente.
- **SC-002**: 100% das multas criadas ficam vinculadas a um item de emprestimo e apresentam usuario, livro, motivo, valor e status na consulta.
- **SC-003**: 95% das consultas de multas com filtros retornam uma lista ou estado vazio em ate 2 segundos em ambiente operacional esperado.
- **SC-004**: 100% das mudancas de status de multas geram historico auditavel com executor e data/hora.
- **SC-005**: Bibliotecarios conseguem identificar o total pendente de um usuario em ate 10 segundos durante atendimento.
- **SC-006**: O sistema bloqueia 100% das tentativas de criar multas sem motivo valido, sem valor positivo ou sem item de emprestimo existente.

## Assumptions

- O escopo desta feature cobre gestao operacional de multas por bibliotecarios; autoatendimento do leitor para pagamento online fica fora desta versao.
- Pagamento significa registro administrativo de quitacao, sem integracao com gateway financeiro.
- Perdao de multa exige justificativa para auditoria.
- Multas surgem principalmente em devolucoes com atraso ou dano fisico, mas tambem podem ser registradas manualmente por bibliotecario quando vinculadas a item de emprestimo valido.
- A feature depende de emprestimos, itens de emprestimo, exemplares, usuarios e logs de atividade existentes ou planejados.
- Valores e regras de calculo automatico de multa diaria podem ser definidos em planejamento futuro; esta especificacao exige que o valor final registrado seja validado e auditavel.
