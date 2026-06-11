# Feature Specification: Gestão de Catálogo

**Feature Branch**: `001-gestao-catalogo`

**Created**: 2026-06-10

**Status**: Draft

**Input**: User description: "Gestão de catálogo: CRUD de livros, autores, editoras, categorias e exemplares (incluindo tabelas associativas livros_autores e livros_categorias) para uso pelo bibliotecário no MVP."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastrar livro novo no acervo (Priority: P1)

O bibliotecário recebe lotes de livros novos e precisa registrá-los no acervo da
biblioteca: cada obra com seu título, ISBN, ano de publicação, editora, autor(es) e
categoria(s) — e, em seguida, registrar quantos exemplares físicos chegaram daquela obra.
Sem este fluxo o sistema não tem catálogo, e nenhuma outra operação (empréstimo, reserva,
multa) faz sentido.

**Why this priority**: É a fundação do MVP. Sem cadastro de livro + exemplares, a
biblioteca não tem inventário no sistema. Todas as demais features dependem desta.

**Independent Test**: Pode ser validado de ponta a ponta criando uma obra nova
(`"Dom Casmurro", ISBN 9788535910663, Editora "Companhia das Letras", autor "Machado de
Assis", categoria "Romance"`), registrando 3 exemplares físicos e confirmando que a obra
e seus 3 exemplares aparecem em uma consulta posterior, com status `disponivel` e condição
`intacto`.

**Acceptance Scenarios**:

1. **Given** o bibliotecário autenticado e nenhum livro com o ISBN `9788535910663` no
   sistema, **When** ele submete o cadastro do livro com editora, ao menos um autor e ao
   menos uma categoria informados, **Then** o livro é criado e fica disponível para
   consulta, sem nenhum exemplar associado ainda.
2. **Given** um livro recém-cadastrado sem exemplares, **When** o bibliotecário registra
   3 exemplares físicos novos para aquele livro, **Then** cada exemplar passa a existir
   com status `disponivel` e condição `intacto`, e o livro passa a contabilizar 3
   exemplares disponíveis.
3. **Given** uma editora ou autor ou categoria que ainda não existe no sistema, **When**
   o bibliotecário inicia o cadastro de um livro, **Then** ele consegue criar a entidade
   faltante (editora, autor ou categoria) no mesmo fluxo, sem precisar abandonar o
   cadastro do livro.
4. **Given** já existe um livro com o ISBN `9788535910663`, **When** o bibliotecário
   tenta cadastrar outro livro com o mesmo ISBN, **Then** o sistema recusa a operação
   informando que o ISBN já está em uso.
5. **Given** o bibliotecário não autenticado ou autenticado com cargo `leitor`, **When**
   ele tenta acessar qualquer operação de cadastro do catálogo, **Then** o sistema nega
   o acesso.

---

### User Story 2 - Consultar e localizar obras no catálogo (Priority: P2)

O bibliotecário precisa localizar rapidamente uma obra ou exemplar para atender uma
solicitação de empréstimo, conferir disponibilidade, ou checar dados de cadastro. A
consulta abrange listagem paginada, busca por título/autor/ISBN/categoria e detalhamento
de uma obra específica (com seus exemplares e respectivos status).

**Why this priority**: Logo após cadastrar, a operação mais frequente é localizar. Sem
consulta eficiente, o cadastro vira um depósito cego.

**Independent Test**: Com 50 livros cadastrados, o bibliotecário consegue (a) listar
todos com paginação, (b) filtrar pelos que têm a palavra "Machado" no autor e ver
apenas as obras desse autor, (c) abrir o detalhe de uma obra e ver a quantidade de
exemplares por status (disponível / emprestado / reservado / manutenção).

**Acceptance Scenarios**:

1. **Given** existem 50 livros cadastrados, **When** o bibliotecário lista o catálogo,
   **Then** ele recebe uma página com no máximo 20 livros e indicação de quantas páginas
   restam.
2. **Given** existem livros de autores diferentes no catálogo, **When** o bibliotecário
   busca pelo termo "Machado", **Then** o sistema retorna apenas obras cujo título, ISBN
   ou nome de algum dos autores associados contenha "Machado" (case-insensitive).
3. **Given** uma obra com 5 exemplares (3 disponíveis, 1 emprestado, 1 em manutenção),
   **When** o bibliotecário abre o detalhe da obra, **Then** ele vê o resumo de contagem
   por status e a lista de cada exemplar com seu status individual e condição física.
4. **Given** uma busca sem resultados, **When** o bibliotecário consulta um termo
   inexistente, **Then** o sistema responde com uma lista vazia (não com erro).

---

### User Story 3 - Editar informações de obras e entidades de apoio (Priority: P3)

Erros de digitação acontecem, editoras mudam de nome, categorias precisam ser ajustadas
e a condição física de exemplares evolui (um exemplar pode passar a `manutencao` após
detecção de dano). O bibliotecário precisa atualizar esses dados sem precisar recriar
os registros.

**Why this priority**: Cadastro perfeito de primeira é raro. Sem edição, o catálogo
acumula sujeira e força workarounds (exclusão + recriação) que perdem histórico.

**Independent Test**: Cadastrar uma editora com nome incorreto, depois renomeá-la, e
verificar que (a) o novo nome aparece, (b) todos os livros associados continuam
apontando para a mesma editora (sem duplicar), (c) nenhum exemplar ou empréstimo é
afetado.

**Acceptance Scenarios**:

1. **Given** uma editora cadastrada com nome `"Companhia das Letas"` (typo) e dois
   livros associados a ela, **When** o bibliotecário corrige o nome para
   `"Companhia das Letras"`, **Then** ambos os livros continuam associados à mesma
   editora, agora com o nome correto.
2. **Given** um exemplar com status `disponivel` e condição `intacto`, **When** o
   bibliotecário marca o exemplar como `manutencao` com condição `rasgado`, **Then** o
   exemplar deixa de aparecer como disponível para empréstimo e o histórico desta
   mudança fica auditado.
3. **Given** um livro associado a 2 autores, **When** o bibliotecário remove um dos
   autores da associação, **Then** o livro permanece cadastrado, agora com 1 autor; o
   autor removido continua existindo no sistema (não é excluído).
4. **Given** uma tentativa de edição por um usuário com cargo `leitor`, **When** o
   usuário submete a alteração, **Then** o sistema nega a operação.

---

### User Story 4 - Remover registros obsoletos com proteção de integridade (Priority: P4)

Uma obra descontinuada, um exemplar fisicamente perdido, ou uma categoria criada por
engano precisam ser removidos. Mas remover às cegas quebra o histórico de empréstimos
e referências. O bibliotecário precisa de uma remoção segura, que recusa apagar o que
ainda está em uso.

**Why this priority**: Importante para higiene do catálogo, mas frequência baixa e o
custo de não ter (manter registros obsoletos) é cosmético, não funcional.

**Independent Test**: Tentar remover uma editora com livros associados — deve falhar
com mensagem clara. Em seguida, remover uma editora sem livros — deve ter sucesso.

**Acceptance Scenarios**:

1. **Given** uma editora associada a pelo menos um livro, **When** o bibliotecário
   tenta removê-la, **Then** o sistema recusa a remoção e informa quantos livros ainda
   a referenciam.
2. **Given** uma editora sem livros associados, **When** o bibliotecário a remove,
   **Then** ela deixa de existir no sistema.
3. **Given** um exemplar com status `disponivel` e sem histórico de empréstimo, **When**
   o bibliotecário o remove, **Then** o exemplar deixa de existir e a contagem do livro
   é atualizada.
4. **Given** um exemplar atualmente `emprestado` ou `reservado`, **When** o
   bibliotecário tenta removê-lo, **Then** o sistema recusa a remoção e exige liberação
   prévia.
5. **Given** um livro com exemplares ou com histórico de empréstimo, **When** o
   bibliotecário tenta removê-lo, **Then** o sistema recusa a remoção.

---

### Edge Cases

- **ISBN duplicado**: tentativa de cadastrar dois livros com o mesmo ISBN é recusada
  (ISBN é o identificador externo único da obra).
- **Livro sem autor ou sem categoria**: o cadastro exige pelo menos um autor e pelo
  menos uma categoria; cadastro sem essas associações é recusado.
- **Editora compulsória**: o cadastro de livro sem editora é recusado (relação 1:N
  obrigatória).
- **Exemplar sem livro**: criar exemplar requer um livro existente — não há exemplar
  órfão.
- **Transição de status inválida em exemplar**: marcar como `disponivel` um exemplar
  atualmente `emprestado` sem registrar devolução é recusado.
- **Busca com termos especiais**: termos com acentos, caracteres especiais ou maiúsculas
  são tratados de forma case-insensitive e acento-insensitive.
- **Página fora do intervalo**: listagem com página > total devolve lista vazia.
- **Concorrência no cadastro de ISBN**: dois bibliotecários submetendo o mesmo ISBN
  ao mesmo tempo — apenas um cadastro tem sucesso; o outro recebe a mesma mensagem de
  duplicidade.
- **Associação duplicada**: tentar associar o mesmo autor duas vezes ao mesmo livro é
  recusado ou ignorado de forma idempotente.
- **Editora ou autor com nome longo**: nomes são limitados a 255 caracteres; entradas
  maiores são recusadas com mensagem clara.

## Requirements *(mandatory)*

### Functional Requirements

**Cadastro de obra (livro)**

- **FR-001**: O sistema MUST permitir ao bibliotecário cadastrar um livro com os
  atributos: título, ISBN, ano de publicação, editora (obrigatória), ao menos um autor
  e ao menos uma categoria.
- **FR-002**: O sistema MUST garantir que o ISBN seja único em todo o catálogo;
  tentativa de cadastrar livro com ISBN já existente MUST ser recusada com mensagem
  identificando o conflito.
- **FR-003**: O sistema MUST aceitar a criação de editora, autor e categoria durante o
  fluxo de cadastro de livro, sem exigir um cadastro prévio em tela separada.
- **FR-004**: O sistema MUST aceitar múltiplos autores e múltiplas categorias por
  livro, registrando as associações de forma persistente.

**Cadastro de exemplares**

- **FR-005**: O sistema MUST permitir ao bibliotecário registrar um ou mais exemplares
  físicos para um livro existente; cada exemplar nasce com status `disponivel` e
  condição `intacto` por padrão.
- **FR-006**: O sistema MUST recusar criação de exemplar para um livro inexistente.
- **FR-007**: O sistema MUST permitir ao bibliotecário alterar o status de um exemplar
  entre `disponivel`, `emprestado`, `reservado` e `manutencao`, respeitando transições
  válidas (não é permitido marcar como `disponivel` um exemplar `emprestado` sem que
  uma devolução tenha sido registrada — devolução é tratada em outra feature).
- **FR-008**: O sistema MUST permitir ao bibliotecário alterar a condição física de um
  exemplar entre `intacto`, `rabiscado`, `rasgado`, `dobrado`.

**Consulta**

- **FR-009**: O sistema MUST permitir listar os livros do catálogo de forma paginada,
  com tamanho de página padrão de 20 e indicação do total de páginas/itens.
- **FR-010**: O sistema MUST permitir busca por título, ISBN, nome de autor ou nome de
  categoria, de forma case-insensitive e acento-insensitive.
- **FR-011**: O sistema MUST permitir consultar o detalhe de um livro específico,
  retornando seus atributos, editora, lista de autores, lista de categorias e a lista
  de seus exemplares com status individual e condição física.
- **FR-012**: O sistema MUST permitir consultar listagem paginada de autores, editoras
  e categorias, com busca por nome.

**Edição**

- **FR-013**: O sistema MUST permitir ao bibliotecário editar título, ISBN, ano,
  editora, autores associados e categorias associadas de um livro existente,
  preservando o histórico de empréstimos.
- **FR-014**: O sistema MUST permitir editar nome de autor, editora e categoria;
  livros associados continuam apontando para a mesma entidade.
- **FR-015**: Edições no ISBN MUST seguir a mesma regra de unicidade do cadastro.

**Remoção**

- **FR-016**: O sistema MUST recusar remoção de editora, autor ou categoria que ainda
  tenha livros referenciando-a; a mensagem de erro MUST indicar quantos livros
  bloqueiam a remoção.
- **FR-017**: O sistema MUST recusar remoção de livro que tenha exemplares cadastrados
  ou histórico de empréstimo.
- **FR-018**: O sistema MUST recusar remoção de exemplar cujo status atual seja
  `emprestado` ou `reservado`; remoção só é permitida quando o exemplar está
  `disponivel` ou `manutencao`.
- **FR-019**: Remoções autorizadas MUST eliminar permanentemente o registro; o sistema
  não oferece estado de "arquivado" ou "oculto" no v1.

**Segurança e auditoria**

- **FR-020**: O sistema MUST permitir as operações do catálogo apenas para usuários
  autenticados com cargo `bibliotecario`; demais cargos recebem negação de acesso.
- **FR-021**: O sistema MUST registrar em log de atividade toda criação, edição e
  remoção sobre livros, autores, editoras, categorias e exemplares, contendo
  identificador do usuário, ação, entidade afetada, identificador do registro e
  data/hora.

**Validação**

- **FR-022**: O sistema MUST validar que título, nome de autor, nome de editora e nome
  de categoria sejam não-vazios e tenham no máximo 255 caracteres.
- **FR-023**: O sistema MUST validar que o ano de publicação seja um inteiro entre
  1000 e o ano corrente + 1 (tolerância para edições programadas).
- **FR-024**: O sistema MUST validar que o ISBN seja não-vazio e tenha entre 10 e 13
  caracteres alfanuméricos; a validação de dígito verificador é opcional no v1.

### Key Entities *(include if feature involves data)*

- **Livro**: representa uma obra do catálogo (entidade abstrata, não um item físico).
  Atributos relevantes: título, ISBN (único), ano de publicação. Relaciona-se com uma
  editora, com um ou mais autores, com uma ou mais categorias, e com zero ou mais
  exemplares físicos.

- **Autor**: pessoa que escreveu uma ou mais obras. Atributo relevante: nome. Pode
  estar associado a múltiplos livros (relação N:M).

- **Editora**: organização responsável pela publicação de uma obra. Atributo relevante:
  nome. Cada livro tem exatamente uma editora (relação 1:N).

- **Categoria**: classificação temática de uma obra (Romance, Ciência, História, etc.).
  Atributo relevante: nome. Pode estar associada a múltiplos livros (relação N:M).

- **Exemplar**: unidade física de um livro presente no acervo da biblioteca. Atributos
  relevantes: status (`disponivel`, `emprestado`, `reservado`, `manutencao`), condição
  física (`intacto`, `rabiscado`, `rasgado`, `dobrado`). Cada exemplar pertence a
  exatamente um livro (relação 1:N).

- **Associação Livro-Autor**: vínculo N:M entre livros e autores.

- **Associação Livro-Categoria**: vínculo N:M entre livros e categorias.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O bibliotecário consegue cadastrar uma obra completa (livro + editora +
  ao menos um autor + ao menos uma categoria + ao menos um exemplar) em menos de 3
  minutos, contando a partir do início do fluxo até a confirmação de sucesso.
- **SC-002**: A busca por termo no catálogo retorna resultados em menos de 1 segundo
  para um catálogo de até 10.000 livros.
- **SC-003**: 100% das operações de mutação (criação, edição, remoção) sobre catálogo
  geram uma entrada correspondente no log de atividade, verificável por auditoria.
- **SC-004**: 100% das tentativas de remoção que violariam integridade referencial
  (editora com livros, exemplar emprestado) são rejeitadas com mensagem clara
  identificando o motivo do bloqueio.
- **SC-005**: A taxa de cadastros recusados por ISBN duplicado é coerente (zero
  duplicidades persistidas) mesmo sob duas tentativas concorrentes do mesmo ISBN.
- **SC-006**: O bibliotecário consegue identificar a quantidade de exemplares
  disponíveis de qualquer obra em menos de 5 segundos a partir da abertura da busca.

## Assumptions

- O sistema é operado exclusivamente por usuários com cargo `bibliotecario` no v1;
  usuários com cargo `leitor` existem no sistema (cadastro/login) mas não acessam
  operações do catálogo nesta feature, conforme escopo do MVP definido na constituição.
- ISBN é o identificador externo único de uma obra. O sistema aceita tanto ISBN-10
  quanto ISBN-13 e trata-os como strings (sem validação de dígito verificador no v1).
- Edições diferentes da mesma obra são tratadas como livros distintos com ISBNs
  distintos — o sistema não modela `edicao` no v1.
- Imagens (capas), sinopses, resenhas e outros metadados ricos estão fora do escopo
  da v1.
- Não há importação em massa de catálogo (planilha, ISBN lookup externo) no v1; todo
  cadastro é manual.
- A listagem padrão usa página de 20 itens; tamanho configurável é uma melhoria
  pós-MVP.
- Busca é case-insensitive e acento-insensitive como padrão; busca avançada (operadores
  AND/OR, busca exata por frase) é pós-MVP.
- Não há limite explícito de exemplares por livro além do prático (centenas de
  milhares são suportados pela camada de persistência).
- Histórico de mudanças de cadastro fica registrado em log de atividade, mas não há
  tela de "histórico do livro" no v1 — auditoria é via consulta direta ao log.
- A feature de autenticação/autorização (login, sessão, cargos) é dependência desta,
  mas será especificada e implementada em uma feature separada; esta spec presume sua
  existência.
