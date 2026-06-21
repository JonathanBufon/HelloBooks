<!--
SYNC IMPACT REPORT
==================
Version change: (template / não ratificada) → 1.0.0
Bump rationale: Ratificação inicial — primeira versão concreta substituindo o template.

Princípios definidos (novos):
  I.   Contrato REST Primeiro
  II.  Arquitetura em Camadas (Backend Laravel)
  III. Segurança, Sessões e Auditabilidade (NÃO-NEGOCIÁVEL)
  IV.  Integridade Transacional dos Dados
  V.   Disciplina de Escopo do MVP

Seções adicionadas:
  - Restrições Tecnológicas
  - Fluxo de Desenvolvimento
  - Governance (preenchida)

Seções removidas: nenhuma.

Templates verificados:
  ✅ .specify/templates/plan-template.md — Constitution Check é dinâmico ("Gates determined
     based on constitution file"); não acopla nomes de princípios — nenhuma alteração necessária.
  ✅ .specify/templates/spec-template.md — sem referências a princípios específicos.
  ✅ .specify/templates/tasks-template.md — sem referências a princípios específicos.
  ✅ .specify/templates/checklist-template.md — sem referências a princípios específicos.
  ✅ .specify/extensions/git/commands/*.md — sem dependência da constituição.

Follow-up TODOs: nenhum. Data de ratificação preenchida com a data de criação (hoje).
-->

# HelloBooks Constitution

Sistema web de biblioteca — gestão de catálogo, exemplares, empréstimos, reservas e multas.
Esta constituição define regras inegociáveis do projeto. Toda decisão de design, código ou
processo deve estar alinhada com os princípios abaixo.

## Core Principles

### I. Contrato REST Primeiro

Toda funcionalidade exposta pelo backend MUST ser entregue como endpoint HTTP REST, usando
exclusivamente os verbos `GET`, `POST` (INSERT), `PUT` e `DELETE`. Recursos são substantivos
no plural (`/livros`, `/exemplares`, `/emprestimos`); rotas aninhadas só são permitidas quando
a relação de posse é inequívoca (`/emprestimos/{id}/itens`).

Regras inegociáveis:
- Payloads de requisição e resposta MUST ser JSON; respostas de erro usam envelope consistente
  (`{ "error": { "code", "message", "details? } }`) com status HTTP semântico (4xx para erro do
  cliente, 5xx para erro do servidor).
- Cada endpoint MUST ser definido em um contrato (OpenAPI ou equivalente em `contracts/`) antes
  de ser implementado.
- Mudanças que quebrem o contrato exigem nova versão do endpoint ou amendment desta constituição.

**Rationale**: O frontend (React + Axios) e qualquer integração futura dependem de um contrato
previsível e versionável. O acordo do projeto cita os quatro verbos explicitamente — não há
margem para RPC sobre HTTP, GraphQL, ou variações ad-hoc.

### II. Arquitetura em Camadas (Backend Laravel)

O código Laravel MUST seguir a separação: **Controller → Service → Repository → Eloquent Model**.

- Controllers tratam APENAS de HTTP: validação (via `FormRequest`), montagem de resposta,
  códigos de status. Nenhuma regra de negócio em controller.
- Services concentram regras de negócio (ex.: criar empréstimo, aplicar multa, validar
  transição de status de exemplar). Services NÃO conhecem `Request`/`Response`.
- Repositories (ou Eloquent scopes encapsulados) MUST ser a única porta de acesso ao banco
  fora dos Models. Nenhum SQL bruto em controller ou service.
- Models definem relacionamentos, casts e accessors — não orquestram fluxo de negócio.

**Rationale**: O domínio (catálogo + operações + penalizações) é não-trivial. Isolar HTTP de
regras de negócio é o que permite testar comportamento sem subir rota e trocar persistência
sem reescrever o domínio.

### III. Segurança, Sessões e Auditabilidade (NÃO-NEGOCIÁVEL)

Este sistema lida com identidade de usuários, controle de acesso por cargo e penalidades
financeiras. Segurança é uma porta de entrada (gate), não um opcional.

Regras inegociáveis:
- Senhas armazenadas APENAS como hash (bcrypt ou argon2 — padrão do Laravel). Senhas em
  texto puro NUNCA são persistidas, logadas, retornadas em respostas, nem enviadas a serviços
  externos.
- Autenticação via JWT. Todo token emitido MUST ser persistido em `tokens_acesso` com data de
  criação, data de expiração e flag `revogado`. O sistema MUST suportar logout forçado por
  revogação do token (não basta expirar localmente).
- Autorização por cargo (`bibliotecario`, `leitor`) MUST ser aplicada em middleware/policy
  antes do controller — nunca dentro de service ou model.
- Toda ação de mutação sobre `livros`, `exemplares`, `emprestimos`, `itens_emprestimo`,
  `reservas`, `multas` ou `usuarios` MUST gravar uma linha em `logs_atividades` contendo
  `id_usuario`, `acao_realizada`, `entidade_afetada`, `id_registro_afetado` e `data_hora`.
  Ação de mutação sem log correspondente é um defeito, não um corte de escopo.

**Rationale**: O escopo cita auditabilidade e revogação de sessão como requisitos centrais.
Sem log de atividade, não é possível investigar perda de exemplar; sem revogação de token,
não é possível conter conta comprometida.

### IV. Integridade Transacional dos Dados

A correção do inventário físico é o coração do MVP. Não pode haver estado parcial entre
exemplar e empréstimo, ou entre reserva e empréstimo, ou entre item e multa.

Regras inegociáveis:
- Operações que mutam múltiplas linhas — criar empréstimo + atualizar `status` de exemplares;
  converter reserva em empréstimo; registrar devolução + aplicar multa — MUST executar dentro
  de uma única transação Postgres. Falha em qualquer passo causa rollback completo.
- Transições do `status` de `exemplares` (`disponivel`, `emprestado`, `reservado`,
  `manutencao`) MUST ser validadas explicitamente. Transição inválida (ex.: `emprestado`
  → `reservado` direto) lança erro de domínio e aborta a operação.
- Foreign keys MUST ser declaradas no schema com a ação apropriada (`RESTRICT` por padrão
  para entidades de catálogo; `CASCADE` apenas em tabelas associativas explicitamente
  modeladas como dependentes, ex.: `livros_autores`).
- Soft delete só é usado quando há requisito explícito de retenção. Caso contrário,
  `DELETE` físico — coerente com os verbos REST acordados.

**Rationale**: Um exemplar marcado como `emprestado` sem `Item_Emprestimo` correspondente
significa um livro perdido do ponto de vista do sistema. Atomicidade não é otimização — é a
única forma de manter o modelo de domínio fiel à realidade física.

### V. Disciplina de Escopo do MVP

O MVP entrega gestão e controle de estoque para o cargo `bibliotecario`. Nada mais.

Em escopo (v1):
- CRUD completo de catálogo: `livros`, `autores`, `editoras`, `categorias`, `exemplares`
  (incluindo associativas `livros_autores`, `livros_categorias`).
- Operações de empréstimo, reserva e devolução executadas pelo bibliotecário.
- Aplicação e gestão de multas (atraso e danos físicos: rabiscado, rasgado, dobrado).
- Logs de atividade e gestão de sessões (revogação de token).
- Autenticação para `bibliotecario` e `leitor` (cadastro existe; uso pelo leitor é mínimo).

Fora de escopo (v1) — requerem amendment da constituição para entrar:
- Interface de autoatendimento para `leitor` (catálogo público navegável, empréstimo
  self-service, histórico pessoal além do mínimo).
- Notificações por e-mail, SMS ou push.
- Integração com pagamento de multas.
- Relatórios analíticos, BI, exportações.
- Importação em massa de catálogo a partir de fontes externas (ISBN lookup etc.).

**Rationale**: O risco principal do projeto é escopo. Funcionalidade fora do MVP custa tempo
de entrega sem provar a hipótese central (o bibliotecário consegue operar o estoque). YAGNI
aplica-se especialmente a abstrações além do modelo de dados do YAML.

## Restrições Tecnológicas

Stack acordada — alterações exigem amendment:

- **Backend**: PHP 8.x + Laravel 12. PSR-12 para estilo. Migrations refletem o YAML
  `Sistema_Biblioteca` (nomes em snake_case e em português — `id_usuario`, `data_retirada`).
- **Banco relacional**: PostgreSQL. Datas com hora em `timestamptz` (UTC); datas sem hora em
  `date`. Enums modelados como `CHECK constraint` ou tipo enum nativo do Postgres — não como
  string livre.
- **Cache**: Redis. Usado para cache de leitura quente (catálogo) e, quando necessário, fila
  de jobs do Laravel.
- **Frontend**: React + TypeScript + Axios. Cliente HTTP centralizado em uma única instância
  Axios com interceptors para autenticação (anexar JWT) e normalização de erros.
- **Documentação de API**: contratos OpenAPI vivem em `specs/<feature>/contracts/`.

## Fluxo de Desenvolvimento

- Specs criadas via `/speckit-specify`; planos via `/speckit-plan`; tarefas via
  `/speckit-tasks`; implementação via `/speckit-implement`.
- Cada feature vive em uma branch própria gerada pelo hook `speckit-git-feature`. Merge em
  `main` só após tarefas concluídas e testes passando.
- Hooks `after_*` do Spec Kit (auto-commit) ficam habilitados. Bypass de hook precisa ser
  justificado na descrição do PR.
- Code review obrigatório antes de merge em `main`. O reviewer verifica conformidade com a
  constituição — em caso de conflito, ou o código muda, ou a constituição é emendada (jamais
  ignorada).
- Testes mínimos por feature: testes de feature/integração para todo endpoint REST novo;
  testes unitários para regras de negócio em Services; testes de migration quando o schema
  muda.

## Governance

- Esta constituição supersede práticas ad-hoc. Conflito entre código novo e constituição
  resolve-se por (a) ajuste do código ou (b) amendment formal — nunca por exceção silenciosa.
- Amendments seguem o fluxo: PR alterando este arquivo + bump de versão conforme regras
  abaixo + propagação para `.specify/templates/*` quando o template for afetado + atualização
  do Sync Impact Report no topo deste arquivo.
- Política de versionamento (SemVer da constituição):
  - **MAJOR**: remoção ou redefinição incompatível de princípio existente, ou mudança de
    governance que invalide PRs em aberto.
  - **MINOR**: novo princípio, nova seção, ou expansão material de orientação existente.
  - **PATCH**: clarificações, correções de redação, refinos não-semânticos.
- Toda Pull Request para `main` MUST declarar (na descrição ou via Constitution Check do
  plano) aderência aos princípios. Violações justificadas vão na seção "Complexity Tracking"
  do plano.

**Version**: 1.0.0 | **Ratified**: 2026-06-10 | **Last Amended**: 2026-06-10
