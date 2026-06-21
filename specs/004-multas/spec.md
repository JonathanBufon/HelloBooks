# Feature Specification: Multas e Notificacoes

**Feature Branch**: `004-multas`

**Created**: 2026-06-20

**Updated**: 2026-06-21

**Status**: Draft

**Input**: User description: "Sistema de multas com baixa manual pelo bibliotecario, pagamento presencial pelo leitor, notificacoes in-app para multas pendentes. Fluxo: Leitor paga multa presencialmente -> Bibliotecario acessa o sistema -> Identifica a multa -> Marca como paga no sistema."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar multa em devolucao com atraso ou dano (Priority: P1)

O bibliotecario registra uma multa quando um exemplar e devolvido fora do prazo ou com dano fisico. A multa fica vinculada ao item de emprestimo correspondente com status pendente.

**Why this priority**: Sem registro de multa, nao existe pendencia para dar baixa. Esta historia e a base de todo o fluxo.

**Independent Test**: Selecionar um item de emprestimo devolvido com atraso ou dano, informar motivo e valor, salvar. Verificar que a multa aparece como pendente vinculada ao item correto.

**Acceptance Scenarios**:

1. **Given** um item de emprestimo devolvido com atraso, **When** o bibliotecario registra multa por atraso com valor valido, **Then** a multa fica pendente e vinculada ao item de emprestimo.
2. **Given** um item de emprestimo devolvido com exemplar danificado, **When** o bibliotecario registra multa por dano (rabisco, rasgo ou dobra), **Then** a multa registra o motivo especifico e o valor cobrado.
3. **Given** um item de emprestimo sem atraso nem dano, **When** o bibliotecario tenta registrar multa sem motivo valido, **Then** o sistema impede o registro e informa o erro.
4. **Given** uma multa ja existe para o mesmo item e motivo, **When** o bibliotecario tenta criar outra identica, **Then** o sistema bloqueia a duplicidade.

---

### User Story 2 - Dar baixa em multa paga presencialmente (Priority: P1)

O leitor paga a multa presencialmente ao bibliotecario. O bibliotecario acessa o sistema, localiza a multa pendente do leitor e marca como paga. Este e o fluxo principal do dia a dia.

**Why this priority**: Este e o fluxo central descrito pelo usuario. Sem a baixa manual, multas ficam eternamente pendentes e o sistema perde utilidade operacional.

**Independent Test**: Criar uma multa pendente para um leitor. Acessar como bibliotecario, buscar a multa, marcar como paga. Verificar que o status muda e o leitor deixa de ter pendencia.

**Acceptance Scenarios**:

1. **Given** uma multa pendente para um leitor, **When** o bibliotecario marca como paga, **Then** a multa muda para status paga com data/hora do pagamento e identificacao do bibliotecario que deu baixa.
2. **Given** uma multa ja paga, **When** o bibliotecario tenta dar baixa novamente, **Then** o sistema informa que a multa ja foi quitada.
3. **Given** um leitor com multiplas multas pendentes, **When** o bibliotecario da baixa em uma delas, **Then** apenas a multa selecionada muda de status; as demais permanecem pendentes.

---

### User Story 3 - Consultar e filtrar multas (Priority: P1)

O bibliotecario consulta multas por usuario, status, motivo e periodo para localizar pendencias rapidamente no balcao. Precisa identificar a multa correta antes de dar baixa.

**Why this priority**: O bibliotecario precisa encontrar a multa para poder dar baixa. Sem busca e filtros, o fluxo principal fica inviavel em bibliotecas com volume de multas.

**Independent Test**: Criar multas com status, motivos e usuarios distintos. Usar filtros e confirmar que a listagem mostra apenas os resultados correspondentes. Verificar estado vazio quando nenhum resultado.

**Acceptance Scenarios**:

1. **Given** existem multas pendentes, pagas e perdoadas, **When** o bibliotecario filtra por status pendente, **Then** apenas multas pendentes aparecem.
2. **Given** um usuario possui multas em diferentes emprestimos, **When** o bibliotecario busca pelo nome ou email do usuario, **Then** todas as multas desse usuario aparecem com livro, exemplar, motivo, valor e status.
3. **Given** nao existem multas para os filtros informados, **When** a consulta e executada, **Then** o sistema exibe estado vazio claro.
4. **Given** o bibliotecario precisa localizar multas de um periodo especifico, **When** filtra por intervalo de datas, **Then** apenas multas registradas nesse periodo aparecem.

---

### User Story 4 - Notificacoes in-app de multas pendentes (Priority: P2)

O leitor recebe notificacoes dentro do app quando possui multas pendentes. As notificacoes aparecem ao fazer login e ficam visiveis em um indicador na interface (sino/badge) enquanto houver pendencias. O objetivo e que o leitor saiba que deve procurar o bibliotecario para quitar a multa presencialmente.

**Why this priority**: As notificacoes garantem que o leitor toma conhecimento da multa sem depender de comunicacao verbal. E o mecanismo que fecha o ciclo entre multa registrada e pagamento presencial.

**Independent Test**: Registrar uma multa para um leitor. Fazer login como esse leitor. Verificar que a notificacao aparece. Dar baixa na multa como bibliotecario. Verificar que a notificacao desaparece para o leitor.

**Acceptance Scenarios**:

1. **Given** um leitor possui multas pendentes, **When** faz login no sistema, **Then** ve um indicador de notificacao (badge com quantidade) e pode visualizar a lista de multas pendentes com valor, motivo e livro.
2. **Given** um leitor nao possui multas pendentes, **When** faz login no sistema, **Then** nao ve indicador de notificacao de multas.
3. **Given** o bibliotecario da baixa em uma multa de um leitor, **When** o leitor consulta suas notificacoes novamente, **Then** a multa quitada nao aparece mais como pendente e o contador atualiza.
4. **Given** um leitor possui multas pendentes, **When** visualiza a notificacao, **Then** ve instrucoes claras de que o pagamento deve ser feito presencialmente com o bibliotecario.

---

### User Story 5 - Leitor consulta suas proprias multas (Priority: P2)

O leitor pode acessar uma tela com suas multas (pendentes e historico de pagas/perdoadas) para acompanhar sua situacao. Nao pode alterar nenhuma multa — a visualizacao e somente leitura.

**Why this priority**: Complementa as notificacoes com uma visao detalhada. Reduz demanda no balcao porque o leitor pode consultar sozinho antes de procurar o bibliotecario.

**Independent Test**: Fazer login como leitor com multas em diferentes status. Verificar que a tela mostra todas as multas do leitor com detalhes, sem opcoes de edicao.

**Acceptance Scenarios**:

1. **Given** um leitor possui multas pendentes e pagas, **When** acessa a tela de multas, **Then** ve todas as suas multas com motivo, valor, status, livro e data de registro.
2. **Given** um leitor possui multas pendentes, **When** acessa a tela de multas, **Then** ve o valor total pendente em destaque.
3. **Given** um leitor acessa a tela de multas, **When** tenta alterar alguma multa, **Then** nao existem opcoes de edicao — a tela e somente leitura.

---

### User Story 6 - Perdoar multa com justificativa (Priority: P3)

O bibliotecario pode perdoar uma multa pendente informando uma justificativa administrativa obrigatoria. Multas perdoadas deixam de contar como pendencia do leitor.

**Why this priority**: Fluxo administrativo menos frequente que pagamento, mas necessario para flexibilidade operacional. Exige justificativa para auditoria.

**Independent Test**: Selecionar uma multa pendente, perdoar com justificativa. Verificar que o status muda para perdoada, a justificativa fica registrada, e o leitor nao ve mais como pendencia.

**Acceptance Scenarios**:

1. **Given** uma multa pendente, **When** o bibliotecario perdoa com justificativa, **Then** a multa muda para perdoada e a justificativa fica disponivel para consulta.
2. **Given** o bibliotecario tenta perdoar uma multa sem justificativa, **When** submete o formulario, **Then** o sistema exige preenchimento da justificativa.
3. **Given** uma multa ja paga ou perdoada, **When** o bibliotecario tenta altera-la novamente, **Then** o sistema impede alteracoes que quebrariam a rastreabilidade.

---

### Edge Cases

- Multa duplicada para o mesmo item de emprestimo e mesmo motivo deve ser bloqueada.
- Valor de multa deve ser maior que zero para multas pendentes ou pagas.
- Multa perdoada exige justificativa administrativa obrigatoria.
- Multas de itens ou livros removidos devem manter dados historicos suficientes para auditoria.
- Usuarios inativos nao devem apagar historico de multas ja registradas.
- Filtros sem resultado mostram estado vazio, nao erro.
- Tentativas de alteracao por usuario sem permissao (leitor tentando dar baixa) devem ser negadas.
- Notificacoes devem refletir o estado atual — se a multa foi paga entre o login e a consulta, a notificacao deve desaparecer.
- Leitor so ve suas proprias multas, nunca multas de outros leitores.

## Requirements *(mandatory)*

### Functional Requirements

**Registro de multas**

- **FR-001**: O sistema MUST permitir que bibliotecarios registrem multas vinculadas a um item de emprestimo existente.
- **FR-002**: Cada multa MUST ter motivo, valor, status, data de criacao e vinculo com o item de emprestimo.
- **FR-003**: Os motivos permitidos MUST incluir atraso, dano por rabisco, dano por rasgo e dano por dobra.
- **FR-004**: Os status permitidos MUST incluir pendente, paga e perdoada.
- **FR-005**: Ao criar uma multa, o status inicial MUST ser pendente.
- **FR-006**: O sistema MUST impedir valores negativos ou iguais a zero.
- **FR-007**: O sistema MUST impedir multa sem motivo valido.
- **FR-008**: O sistema MUST impedir duplicidade de multa para o mesmo item de emprestimo e mesmo motivo.

**Baixa manual (pagamento presencial)**

- **FR-009**: Bibliotecarios MUST be able to marcar multa pendente como paga.
- **FR-010**: Ao dar baixa, o sistema MUST registrar data/hora do pagamento e identificacao do bibliotecario que processou.
- **FR-011**: Multas pagas MUST NOT voltar para pendente.
- **FR-012**: O pagamento e exclusivamente presencial — nao ha integracao com gateway financeiro.

**Consulta e filtros**

- **FR-013**: Bibliotecarios MUST be able to consultar multas por status, motivo, usuario, livro e periodo.
- **FR-014**: A listagem de multas MUST mostrar usuario, livro, exemplar, motivo, valor, status e data de registro.

**Notificacoes in-app**

- **FR-015**: O sistema MUST notificar o leitor sobre multas pendentes ao fazer login e de forma persistente na interface (indicador visual com contagem).
- **FR-016**: As notificacoes MUST mostrar quantidade de multas pendentes, valor total, e permitir acesso rapido ao detalhamento.
- **FR-017**: Notificacoes MUST refletir o estado atual — multas quitadas ou perdoadas devem desaparecer das notificacoes.
- **FR-018**: A notificacao MUST informar ao leitor que o pagamento e presencial com o bibliotecario.

**Visualizacao pelo leitor**

- **FR-019**: O leitor MUST be able to consultar suas proprias multas (pendentes, pagas e perdoadas) em tela somente leitura.
- **FR-020**: O leitor MUST ver o valor total pendente em destaque.
- **FR-021**: O leitor MUST NOT ver multas de outros usuarios.
- **FR-022**: O leitor MUST NOT alterar, pagar ou perdoar multas pelo sistema.

**Perdao administrativo**

- **FR-023**: Bibliotecarios MUST be able to perdoar multa pendente com justificativa obrigatoria.
- **FR-024**: Multas perdoadas MUST NOT voltar para pendente.

**Auditoria e seguranca**

- **FR-025**: Toda criacao, pagamento ou perdao de multa MUST gerar registro de auditoria com usuario executor, acao, entidade afetada, identificador e data/hora.
- **FR-026**: Historico de multas MUST permanecer consultavel mesmo quando dados relacionados ficarem inativos.
- **FR-027**: Usuarios sem permissao de bibliotecario MUST NOT criar, alterar, perdoar ou excluir multas.
- **FR-028**: O sistema MUST exibir mensagens claras para conflitos, falta de permissao e erros de validacao.

### Key Entities

- **Multa**: Penalidade financeira vinculada a um item de emprestimo. Possui motivo (atraso, rabisco, rasgo, dobra), valor monetario, status (pendente, paga, perdoada), data de criacao, e dados de regularizacao (data de pagamento/perdao, bibliotecario executor, justificativa quando perdoada).
- **Item de Emprestimo**: Item especifico que representa o exemplar emprestado e origina a multa por atraso ou dano.
- **Usuario (Leitor)**: Pessoa responsavel pela pendencia. Recebe notificacoes in-app e pode consultar suas proprias multas.
- **Usuario (Bibliotecario)**: Operador que registra multas, da baixa em pagamentos presenciais e perdoa multas com justificativa.
- **Notificacao de Multa**: Indicador in-app derivado das multas pendentes do leitor. Nao e uma entidade persistida separadamente — e uma consulta em tempo real sobre multas pendentes do usuario logado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Bibliotecarios conseguem dar baixa em uma multa paga presencialmente em menos de 1 minuto (localizar + marcar como paga).
- **SC-002**: 100% das multas criadas ficam vinculadas a um item de emprestimo e apresentam usuario, livro, motivo, valor e status na consulta.
- **SC-003**: Consultas de multas com filtros retornam resultados ou estado vazio em ate 2 segundos.
- **SC-004**: 100% das mudancas de status de multas geram registro de auditoria com executor e data/hora.
- **SC-005**: Leitores com multas pendentes veem indicador de notificacao em ate 3 segundos apos login.
- **SC-006**: Leitores conseguem identificar valor total pendente e detalhes das multas em ate 2 cliques a partir da notificacao.
- **SC-007**: O sistema bloqueia 100% das tentativas de criar multas sem motivo valido, sem valor positivo ou sem item de emprestimo.
- **SC-008**: Leitores nunca conseguem visualizar multas de outros usuarios ou alterar qualquer multa.

## Assumptions

- Pagamento e exclusivamente presencial — registro administrativo de quitacao, sem integracao com gateway financeiro.
- Notificacoes sao in-app (indicador visual na interface). Notificacoes por e-mail, SMS ou push estao fora de escopo conforme constituicao.
- O leitor tem acesso minimo ao sistema: ver notificacoes de multas e consultar suas proprias multas. Nao faz autoatendimento alem disso.
- Perdao de multa exige justificativa para auditoria.
- Multas surgem em devolucoes com atraso ou dano fisico, registradas manualmente pelo bibliotecario.
- Valores e regras de calculo automatico de multa diaria podem ser definidos em versao futura; nesta versao o valor e informado manualmente pelo bibliotecario.
- A feature depende de emprestimos, itens de emprestimo, exemplares, usuarios e logs de atividade existentes.
- A notificacao de multa nao e uma entidade separada — e derivada de consulta sobre multas pendentes do usuario logado (sem tabela de notificacoes).
