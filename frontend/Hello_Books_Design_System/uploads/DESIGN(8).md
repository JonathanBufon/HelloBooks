# DESIGN.md — Hello Books

## 1. Visão do Design

O **Hello Books** é uma plataforma de gestão de biblioteca acadêmica. O produto deve transmitir organização, confiança, clareza e ritmo de trabalho para bibliotecários, administradores e equipes de atendimento.

O padrão visual do projeto deve seguir uma interface **clara**, com uso forte de **roxo institucional**, cartões brancos, fundo levemente azulado e componentes com cantos arredondados.

A experiência deve priorizar:

- leitura rápida de dados;
- navegação lateral estável;
- formulários claros;
- ações visíveis;
- tabelas com boa hierarquia;
- telas administrativas sem ruído visual.

O sistema deve parecer moderno, mas não deve parecer uma rede social, landing page ou dashboard genérico. A linguagem visual precisa lembrar um sistema acadêmico, operacional e confiável.

---

## 2. Identidade Visual

### 2.1 Nome do produto

**Hello Books**

Subtítulo institucional sugerido:

- Central Library
- Academic Management
- Library Management System

O nome deve aparecer com destaque no topo da sidebar ou no topo da tela de login.

### 2.2 Personalidade da interface

A interface deve comunicar:

- biblioteca;
- conhecimento;
- organização;
- controle de acervo;
- gestão acadêmica;
- operação interna.

A aparência deve evitar excesso de gradientes, animações chamativas e elementos decorativos sem função.

---

## 3. Paleta de Cores

### 3.1 Cores principais

| Token | Cor | Uso |
|---|---:|---|
| `--color-primary` | `#5B00C9` | Botões principais, links ativos, ícones ativos |
| `--color-primary-600` | `#6D1ED6` | Hover, botões em destaque, gradientes |
| `--color-primary-500` | `#7C3AED` | Componentes ativos, badges e gráficos |
| `--color-primary-300` | `#C4B5FD` | Bordas suaves, estados secundários |
| `--color-primary-100` | `#EDE9FE` | Background de item ativo, tags e chips |
| `--color-primary-50` | `#F5F3FF` | Áreas suaves e blocos informativos |

### 3.2 Cores neutras

| Token | Cor | Uso |
|---|---:|---|
| `--color-bg` | `#F3F6FF` | Fundo principal da aplicação |
| `--color-surface` | `#FFFFFF` | Cards, modais e formulários |
| `--color-surface-soft` | `#EEF3FF` | Inputs, blocos auxiliares e caixas de busca |
| `--color-border` | `#D8DDF0` | Bordas de cards, campos e tabelas |
| `--color-border-strong` | `#C7CEE5` | Divisores e bordas de maior contraste |
| `--color-text` | `#111827` | Títulos e textos principais |
| `--color-text-muted` | `#6B7280` | Subtítulos, labels e descrições |
| `--color-text-soft` | `#8A8FA3` | Metadados e textos auxiliares |

### 3.3 Cores semânticas

| Token | Cor | Uso |
|---|---:|---|
| `--color-success` | `#16A34A` | Disponível, regularizado, confirmado |
| `--color-success-bg` | `#DCFCE7` | Fundo de badge positivo |
| `--color-warning` | `#D97706` | Atenção, pendente, aviso |
| `--color-warning-bg` | `#FEF3C7` | Fundo de badge de alerta |
| `--color-danger` | `#DC2626` | Atraso, erro, remoção, multa crítica |
| `--color-danger-bg` | `#FEE2E2` | Fundo de badge de erro |
| `--color-info` | `#2563EB` | Informação, ajuda, estado neutro informativo |
| `--color-info-bg` | `#DBEAFE` | Fundo de badge informativo |

### 3.4 Gradiente principal

Usar gradiente apenas em áreas de destaque, como login, botão principal, card de multas ou CTA.

```css
background: linear-gradient(135deg, #5B00C9 0%, #7C3AED 100%);
```

Evitar aplicar gradiente em todos os componentes. O excesso reduz a clareza da interface.

---

## 4. Tipografia

### 4.1 Fonte

Fonte recomendada:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Alternativas aceitáveis:

- Inter;
- Manrope;
- IBM Plex Sans;
- system-ui.

### 4.2 Escala tipográfica

| Token | Tamanho | Peso | Uso |
|---|---:|---:|---|
| `--text-xs` | `12px` | 500 | Labels, badges e metadados |
| `--text-sm` | `14px` | 500 | Menus, botões, campos |
| `--text-base` | `16px` | 400 | Texto padrão |
| `--text-lg` | `18px` | 600 | Títulos de cards |
| `--text-xl` | `22px` | 700 | Títulos de seção |
| `--text-2xl` | `28px` | 800 | Títulos de página |
| `--text-3xl` | `36px` | 800 | Métricas grandes |

### 4.3 Regras de texto

- Títulos devem ser diretos.
- Labels devem ser curtas.
- Subtítulos devem explicar função, não decorar a tela.
- Campos devem ter placeholder útil.
- Botões devem usar verbo de ação.

Exemplos:

- `Cadastrar Livro`
- `Atualizar Informações`
- `Registrar Empréstimo`
- `Processar Devolução`
- `Ver Histórico`
- `Importar Metadados`

---

## 5. Layout Base

### 5.1 Shell da aplicação

A aplicação deve usar um layout com:

- sidebar fixa à esquerda;
- topo com busca global;
- área principal com cards e conteúdo;
- largura de sidebar entre `280px` e `300px`;
- espaçamento interno entre `24px` e `32px`.

Estrutura sugerida:

```text
┌─────────────────────────────────────────────┐
│ Sidebar │ Topbar                            │
│         ├───────────────────────────────────┤
│         │ Main Content                      │
│         │                                   │
└─────────┴───────────────────────────────────┘
```

### 5.2 Fundo

O fundo principal deve usar `#F3F6FF`.

Cards, formulários e tabelas devem usar `#FFFFFF`.

Campos de busca e inputs podem usar `#EEF3FF`.

---

## 6. Sidebar

### 6.1 Função

A sidebar é o principal componente de navegação. Ela deve manter o usuário orientado dentro do sistema.

### 6.2 Estrutura

A sidebar deve conter:

1. Logo;
2. Nome do produto;
3. Subtítulo da biblioteca;
4. Menu principal;
5. Ação rápida opcional;
6. Card do usuário logado.

### 6.3 Itens de navegação

Itens principais:

- Dashboard
- Catálogo
- Membros
- Circulação
- Relatórios
- Configurações
- Reservas
- Multas
- Inventário
- Auditoria
- Usuários

### 6.4 Estado ativo

O item ativo deve usar:

- fundo `#EDE9FE`;
- texto roxo `#5B00C9`;
- ícone roxo;
- peso `700`;
- borda esquerda roxa opcional.

Exemplo:

```css
.sidebar-item.active {
  background: #EDE9FE;
  color: #5B00C9;
  font-weight: 700;
}
```

### 6.5 Card de usuário

O card inferior da sidebar deve exibir:

- avatar;
- nome;
- cargo;
- status opcional.

Exemplos de cargo:

- Super Administrator
- Head Librarian
- Chief Librarian
- Library Assistant

O card pode ser claro ou roxo, dependendo da tela. Quando roxo, deve ser usado apenas como destaque final da sidebar.

---

## 7. Topbar

### 7.1 Componentes

A topbar deve conter:

- busca global;
- ícone de notificações;
- ícone de ajuda;
- avatar do usuário;
- nome curto da organização, quando necessário.

### 7.2 Busca global

Placeholder sugerido:

- `Buscar membros ou acervo...`
- `Search catalog, members, or ISBN...`
- `Buscar catálogo, membros ou ISBN...`

A busca deve aceitar:

- título do livro;
- autor;
- ISBN;
- nome do membro;
- ID do membro.

### 7.3 Notificações

Notificações devem usar ponto vermelho apenas quando houver item novo ou pendência crítica.

---

## 8. Dashboard

### 8.1 Objetivo

O dashboard deve mostrar a situação operacional da biblioteca.

### 8.2 Cards de métricas

Cards principais:

- Total de livros;
- Empréstimos ativos;
- Devoluções atrasadas;
- Novos membros;
- Multas pendentes;
- Exemplares disponíveis.

Cada card deve conter:

- ícone;
- label;
- número;
- variação opcional;
- cor semântica quando houver alerta.

### 8.3 Blocos do dashboard

Blocos recomendados:

- Tendência semanal de empréstimos;
- Atividade recente;
- Novas aquisições;
- Ações rápidas;
- Alertas operacionais.

### 8.4 Ações rápidas

Ações sugeridas:

- Registrar Empréstimo;
- Processar Devolução;
- Cadastrar Livro;
- Cadastrar Membro;
- Enviar E-mail de Atraso;
- Auditoria de Estoque.

---

## 9. Catálogo

### 9.1 Objetivo

O catálogo deve ser a área de consulta, cadastro e manutenção do acervo.

### 9.2 Campos principais de livro

Campos obrigatórios:

- Título;
- Autor principal;
- ISBN;
- Editora;
- Ano;
- Idioma;
- Categoria;
- Quantidade de exemplares;
- Status.

Campos opcionais:

- Subtítulo;
- Sinopse;
- Capa;
- Páginas;
- Localização física;
- Tags;
- Edição;
- Código interno;
- Origem da aquisição;
- Data de aquisição.

### 9.3 Status do livro

Status sugeridos:

| Status | Uso |
|---|---|
| Disponível | Há exemplares para empréstimo |
| Emprestado | Todos os exemplares estão em uso |
| Reservado | Existe fila de reserva |
| Manutenção | Exemplar indisponível |
| Perdido | Exemplar não localizado |
| Descartado | Exemplar removido do acervo |

### 9.4 Card de livro

O card de livro deve exibir:

- capa;
- título;
- autor;
- status;
- categoria;
- quantidade disponível;
- ação primária.

Exemplo de ação:

- `Ver Detalhes`
- `Editar`
- `Emprestar`

### 9.5 Tela de cadastro de livro

A tela deve ser dividida em blocos:

1. Capa;
2. Dados bibliográficos;
3. Inventário e política;
4. Classificação;
5. Localização;
6. Observações internas.

Campos do bloco bibliográfico:

- Título da obra;
- Autor;
- ISBN-13;
- Categoria;
- Ano;
- Idioma;
- Sinopse.

Campos do bloco de inventário:

- Número de exemplares;
- Localização;
- Disponível no catálogo público;
- Permite empréstimo;
- Prazo padrão;
- Valor de multa diária;
- Condição inicial.

### 9.6 Importação de metadados

A interface pode ter botão:

- `Importar Metadados`

Fluxo esperado:

1. usuário informa ISBN;
2. sistema consulta dados externos;
3. sistema preenche título, autor, editora, ano, capa e sinopse;
4. usuário revisa;
5. usuário salva.

---

## 10. Membros

### 10.1 Objetivo

A área de membros deve permitir cadastro, consulta, edição e análise do histórico do leitor.

### 10.2 Tipos de membro

Tipos sugeridos:

- Acadêmico;
- Professor;
- Funcionário;
- Visitante;
- Pesquisador;
- Externo.

### 10.3 Campos principais de membro

Campos obrigatórios:

- Nome completo;
- E-mail;
- Telefone;
- Tipo de membro;
- Status;
- Data de cadastro.

Campos opcionais:

- Foto;
- Endereço;
- Documento;
- Curso;
- Matrícula;
- Departamento;
- Observações internas.

### 10.4 Status de membro

| Status | Uso |
|---|---|
| Ativo | Pode realizar empréstimos |
| Suspenso | Bloqueado por regra administrativa |
| Inadimplente | Possui multa ou pendência |
| Inativo | Sem atividade recente |
| Bloqueado | Restrição manual |

### 10.5 Perfil de membro

A tela de perfil deve exibir:

- foto;
- nome;
- ID;
- tipo;
- membro desde;
- nível de leitura;
- multas pendentes;
- total de livros lidos;
- empréstimos ativos;
- informações pessoais;
- histórico de empréstimos.

### 10.6 Nível de leitura

Exemplos:

- Leitor Iniciante;
- Leitor Frequente;
- Leitor Ávido;
- Pesquisador Ativo.

Esse campo pode ser calculado pelo volume de empréstimos concluídos.

---

## 11. Circulação

### 11.1 Objetivo

A circulação deve cuidar do fluxo operacional de empréstimos e devoluções.

### 11.2 Operações principais

- Registrar empréstimo;
- Renovar empréstimo;
- Processar devolução;
- Registrar atraso;
- Aplicar multa;
- Remover multa;
- Marcar exemplar como perdido;
- Criar reserva.

### 11.3 Campos de empréstimo

Campos obrigatórios:

- Membro;
- Livro;
- Exemplar;
- Data de retirada;
- Data de vencimento;
- Operador responsável.

Campos opcionais:

- Observações;
- Política aplicada;
- Renovação permitida;
- Canal de atendimento.

### 11.4 Status de empréstimo

| Status | Uso |
|---|---|
| Ativo | Empréstimo em andamento |
| Atrasado | Vencimento expirado |
| Devolvido | Exemplar retornou |
| Renovado | Prazo estendido |
| Perdido | Exemplar não retornou |
| Cancelado | Registro anulado |

### 11.5 Tabela de empréstimos

Colunas recomendadas:

- Livro;
- Membro;
- Retirada;
- Vencimento;
- Status;
- Multa;
- Ações.

Ações por linha:

- Ver;
- Renovar;
- Devolver;
- Notificar.

---

## 12. Relatórios

### 12.1 Objetivo

A área de relatórios deve ajudar a equipe a entender acervo, circulação e pendências.

### 12.2 Relatórios sugeridos

- Livros mais emprestados;
- Membros mais ativos;
- Empréstimos por período;
- Devoluções atrasadas;
- Multas pendentes;
- Exemplares em manutenção;
- Crescimento do acervo;
- Uso por categoria;
- Itens perdidos;
- Aquisições recentes.

### 12.3 Componentes

Usar:

- cards de métricas;
- filtros por período;
- tabelas;
- gráficos simples;
- exportação.

Ações sugeridas:

- `Exportar CSV`
- `Exportar PDF`
- `Filtrar`
- `Limpar Filtros`

---

## 13. Configurações

### 13.1 Objetivo

A tela de configurações deve centralizar regras da biblioteca e preferências do sistema.

### 13.2 Seções sugeridas

- Dados da biblioteca;
- Usuários e permissões;
- Políticas de empréstimo;
- Multas;
- Categorias;
- Idiomas;
- Integrações;
- Aparência;
- Segurança;
- Auditoria.

### 13.3 Campos de política

- Prazo padrão de empréstimo;
- Limite de livros por membro;
- Valor de multa diária;
- Dias de tolerância;
- Permitir renovação;
- Quantidade máxima de renovações;
- Bloquear membro inadimplente;
- Enviar notificação automática.

---

## 14. Formulários

### 14.1 Padrão visual

Campos devem ter:

- altura mínima de `48px`;
- borda `#C7CEE5`;
- fundo `#EEF3FF` ou branco;
- raio entre `10px` e `12px`;
- label acima do campo;
- erro abaixo do campo;
- foco com borda roxa.

Exemplo:

```css
.input {
  height: 48px;
  border: 1px solid #C7CEE5;
  border-radius: 12px;
  background: #EEF3FF;
  padding: 0 16px;
}

.input:focus {
  border-color: #5B00C9;
  box-shadow: 0 0 0 3px rgba(91, 0, 201, 0.12);
}
```

### 14.2 Estados

| Estado | Regra |
|---|---|
| Default | Borda neutra e fundo claro |
| Hover | Borda um pouco mais escura |
| Focus | Borda roxa e halo suave |
| Error | Borda vermelha e mensagem curta |
| Disabled | Opacidade reduzida e cursor bloqueado |
| Read-only | Fundo cinza claro e texto preservado |

### 14.3 Mensagens de erro

Mensagens devem ser específicas.

Exemplos:

- `Informe o título do livro.`
- `ISBN inválido. Use o formato ISBN-13.`
- `Selecione um membro ativo.`
- `A data de vencimento não pode ser anterior à retirada.`

---

## 15. Botões

### 15.1 Variações

#### Primário

Uso: ações principais da tela.

```css
.button-primary {
  background: linear-gradient(135deg, #5B00C9, #7C3AED);
  color: #FFFFFF;
}
```

Exemplos:

- `Cadastrar Livro`
- `Atualizar Informações`
- `Registrar Empréstimo`
- `Salvar Alterações`

#### Secundário

Uso: ação alternativa.

```css
.button-secondary {
  background: #FFFFFF;
  color: #5B00C9;
  border: 1px solid #C4B5FD;
}
```

Exemplos:

- `Cancelar`
- `Descartar`
- `Ver Histórico`

#### Perigo

Uso: remoção, descarte e bloqueio.

```css
.button-danger {
  color: #DC2626;
  background: #FFFFFF;
  border: 1px solid #FECACA;
}
```

Exemplos:

- `Remover Livro`
- `Bloquear Membro`
- `Cancelar Empréstimo`

### 15.2 Altura

- Botão pequeno: `36px`;
- Botão médio: `44px`;
- Botão grande: `52px`.

### 15.3 Texto

Botões devem usar verbo no infinitivo ou ação direta.

Correto:

- `Editar Perfil`
- `Ver Histórico`
- `Processar Devolução`

Evitar:

- `Ok`
- `Enviar`
- `Confirmar`, quando o contexto não estiver claro.

---

## 16. Cards

### 16.1 Padrão

Cards devem ter:

- fundo branco;
- raio entre `18px` e `24px`;
- borda `1px solid #D8DDF0`;
- sombra suave;
- espaçamento interno entre `24px` e `32px`.

```css
.card {
  background: #FFFFFF;
  border: 1px solid #D8DDF0;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(91, 0, 201, 0.08);
}
```

### 16.2 Tipos de card

- Card de métrica;
- Card de perfil;
- Card de tabela;
- Card de formulário;
- Card de alerta;
- Card de atividade;
- Card de ação rápida.

### 16.3 Card de alerta

Usar cor semântica no ícone e no texto principal. Não pintar o card inteiro, exceto em cards de destaque como multas pendentes.

---

## 17. Tabelas

### 17.1 Padrão

Tabelas devem ser usadas para dados operacionais.

Cabeçalho:

- fundo `#EEF3FF`;
- texto uppercase;
- tamanho `12px`;
- peso `700`;
- cor `#7A7F91`.

Linhas:

- altura mínima de `64px`;
- divisores suaves;
- hover com fundo `#F5F3FF`.

### 17.2 Ações

Ações de tabela devem ficar à direita.

Exemplos:

- Ver;
- Editar;
- Renovar;
- Devolver;
- Notificar;
- Excluir.

### 17.3 Colunas recomendadas

Para livros:

- Capa;
- Título;
- Autor;
- Categoria;
- Status;
- Exemplares;
- Localização;
- Ações.

Para membros:

- Nome;
- Tipo;
- E-mail;
- Status;
- Empréstimos;
- Pendências;
- Ações.

Para empréstimos:

- Livro;
- Membro;
- Retirada;
- Vencimento;
- Status;
- Multa;
- Ações.

---

## 18. Badges, Tags e Chips

### 18.1 Badges

Badges devem ser usados para status.

Exemplos:

```text
Disponível
Ativo
Atrasado
Regularizado
Pendente
Manutenção
```

### 18.2 Tags

Tags devem ser usadas para categoria e classificação.

Exemplos:

```text
#Acadêmico
#Referência
#Ficção Histórica
#Mistério
#Tecnologia
```

### 18.3 Padrão visual

```css
.badge {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}
```

---

## 19. Ícones

### 19.1 Biblioteca de ícones

Sugestões:

- Lucide Icons;
- Phosphor Icons;
- Heroicons.

### 19.2 Estilo

Ícones devem ser lineares, com stroke consistente.

Tamanho padrão:

- `18px` em menus;
- `20px` em botões;
- `24px` em cards;
- `32px` em blocos de destaque.

### 19.3 Ícones por módulo

| Módulo | Ícone sugerido |
|---|---|
| Dashboard | Grid |
| Catálogo | Book Open |
| Membros | Users |
| Circulação | Arrows Left Right |
| Relatórios | Bar Chart |
| Configurações | Settings |
| Empréstimo | Clipboard |
| Devolução | Rotate |
| Multa | Alert Circle |
| Livro | Book |
| Busca | Search |

---

## 20. Modais

### 20.1 Uso

Modais devem ser usados para ações rápidas ou confirmações.

Exemplos:

- Novo livro;
- Novo membro;
- Confirmar remoção;
- Registrar devolução;
- Aplicar multa.

### 20.2 Estrutura

Modal deve conter:

- título;
- descrição curta;
- campos;
- ações no rodapé.

### 20.3 Regras

- Não usar modal para formulários muito longos.
- Formulários longos devem ter página própria.
- Confirmações destrutivas devem destacar o risco.

---

## 21. Tela de Login

### 21.1 Layout

A tela de login deve usar duas colunas em desktop:

1. Coluna institucional com fundo roxo, logo e proposta;
2. Coluna de formulário com campos de acesso.

Em mobile, usar apenas a coluna do formulário com logo no topo.

### 21.2 Campos

- E-mail;
- Senha;
- Lembrar de mim;
- Esqueci minha senha;
- Entrar no sistema.

### 21.3 Texto institucional

Texto sugerido:

```text
A plataforma inteligente para gestão de bibliotecas modernas e centros de conhecimento.
```

Cards de apoio:

- Catálogo Digital;
- Gestão de Membros;
- Controle de Empréstimos;
- Relatórios.

---

## 22. Responsividade

### 22.1 Desktop

A sidebar fica fixa. O conteúdo deve usar grid.

### 22.2 Tablet

A sidebar pode ficar compacta. Cards devem quebrar para duas colunas.

### 22.3 Mobile

A sidebar deve virar drawer ou menu inferior.

Regras:

- largura abaixo de `768px`: esconder sidebar;
- usar botão de menu no topo;
- cards em uma coluna;
- tabelas com scroll horizontal;
- formulários em uma coluna.

---

## 23. Espaçamento

### 23.1 Escala

| Token | Valor |
|---|---:|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |

### 23.2 Regras

- Cards principais: `24px` a `32px` de padding.
- Seções: `32px` de gap.
- Campos de formulário: `16px` a `20px` de gap.
- Sidebar: `24px` de padding horizontal.
- Topbar: `24px` de padding horizontal.

---

## 24. Bordas e Radius

### 24.1 Radius

| Token | Valor | Uso |
|---|---:|---|
| `--radius-sm` | `8px` | Badges e chips |
| `--radius-md` | `12px` | Inputs e botões |
| `--radius-lg` | `16px` | Blocos pequenos |
| `--radius-xl` | `20px` | Cards |
| `--radius-2xl` | `24px` | Cards grandes e modais |
| `--radius-full` | `999px` | Avatares e badges |

### 24.2 Borda

Borda padrão:

```css
border: 1px solid #D8DDF0;
```

Borda ativa:

```css
border-color: #5B00C9;
```

---

## 25. Sombras

### 25.1 Sombras recomendadas

```css
--shadow-sm: 0 4px 12px rgba(17, 24, 39, 0.06);
--shadow-md: 0 12px 30px rgba(91, 0, 201, 0.08);
--shadow-lg: 0 20px 50px rgba(91, 0, 201, 0.12);
```

### 25.2 Uso

- `shadow-sm`: botões e elementos pequenos;
- `shadow-md`: cards;
- `shadow-lg`: modais e cards em destaque.

Evitar sombras muito escuras.

---

## 26. Estados e Feedback

### 26.1 Loading

Usar skeleton em cards, tabelas e formulários.

### 26.2 Empty State

Telas sem dados devem explicar o próximo passo.

Exemplos:

```text
Nenhum livro cadastrado ainda.
Comece adicionando o primeiro título ao catálogo.
```

Botão:

```text
Cadastrar Livro
```

### 26.3 Erro

Erro deve informar:

- o que aconteceu;
- o que o usuário pode fazer;
- ação de tentativa, se aplicável.

Exemplo:

```text
Não foi possível carregar o catálogo.
Verifique sua conexão ou tente novamente.
```

### 26.4 Sucesso

Feedback de sucesso deve ser curto.

Exemplos:

- `Livro cadastrado com sucesso.`
- `Empréstimo registrado.`
- `Devolução processada.`

---

## 27. Acessibilidade

### 27.1 Contraste

Garantir contraste suficiente entre texto e fundo.

Evitar texto cinza muito claro em fundo claro.

### 27.2 Navegação por teclado

Todos os componentes interativos devem ter foco visível.

### 27.3 Labels

Todos os campos precisam ter label real, não apenas placeholder.

### 27.4 Ícones

Ícones sem texto devem ter `aria-label`.

### 27.5 Tamanho de clique

Botões e itens clicáveis devem ter área mínima de `40px`.

---

## 28. Linguagem de Interface

### 28.1 Tom

A linguagem deve ser administrativa, objetiva e clara.

### 28.2 Padrões

Usar:

- `Livro`
- `Membro`
- `Empréstimo`
- `Devolução`
- `Exemplar`
- `Acervo`
- `Catálogo`
- `Multa`
- `Reserva`
- `Relatório`

Evitar termos misturados sem motivo, como `loan`, `member`, `book`, quando a tela estiver em português.

### 28.3 Idioma

O projeto pode ter suporte futuro a inglês, mas o padrão inicial recomendado é **português brasileiro**.

Nomes sugeridos:

| Inglês | Português |
|---|---|
| Dashboard | Dashboard |
| Catalog | Catálogo |
| Members | Membros |
| Circulation | Circulação |
| Reports | Relatórios |
| Settings | Configurações |
| New Loan | Novo Empréstimo |
| Add New Book | Cadastrar Livro |

---

## 29. Componentes Base para Design System

O design system deve conter, no mínimo:

### 29.1 Layout

- AppShell
- Sidebar
- Topbar
- PageHeader
- Section
- Grid
- Container

### 29.2 Navegação

- SidebarItem
- Breadcrumb
- Tabs
- Pagination

### 29.3 Dados

- MetricCard
- DataTable
- StatusBadge
- Tag
- Avatar
- ActivityItem

### 29.4 Formulários

- TextInput
- Textarea
- Select
- Checkbox
- Switch
- DateInput
- FileUpload
- SearchInput
- FormSection

### 29.5 Ações

- Button
- IconButton
- DropdownMenu
- Modal
- ConfirmDialog
- Toast

### 29.6 Biblioteca

- BookCard
- BookCover
- BookStatusBadge
- MemberProfileCard
- LoanStatusBadge
- LoanTable
- FineSummaryCard

---

## 30. Padrão de Telas

### 30.1 Dashboard

```text
PageHeader
MetricCards
MainGrid
  WeeklyLoanTrends
  RecentActivity
  NewCatalogAdditions
  QuickActions
```

### 30.2 Catálogo

```text
PageHeader
Filters
BookTable ou BookGrid
Pagination
```

### 30.3 Cadastro de Livro

```text
Breadcrumb
PageHeader
TwoColumnLayout
  CoverUpload
  BibliographicDetails
  InventoryPolicy
  ClassificationTags
ActionFooter
```

### 30.4 Perfil de Membro

```text
SearchTopbar
MemberHeroCard
FineSummaryCard
MetricCards
PersonalInfoCard
ActiveLoansTable
LoanHistoryLink
```

### 30.5 Circulação

```text
PageHeader
QuickActions
LoanFilters
LoanTable
```

### 30.6 Relatórios

```text
PageHeader
DateFilters
MetricCards
Charts
ReportTables
ExportActions
```

### 30.7 Configurações

```text
PageHeader
SettingsTabs
SettingsSection
FormFields
SaveActions
```

---

## 31. Tokens CSS Recomendados

```css
:root {
  --color-primary: #5B00C9;
  --color-primary-600: #6D1ED6;
  --color-primary-500: #7C3AED;
  --color-primary-300: #C4B5FD;
  --color-primary-100: #EDE9FE;
  --color-primary-50: #F5F3FF;

  --color-bg: #F3F6FF;
  --color-surface: #FFFFFF;
  --color-surface-soft: #EEF3FF;

  --color-border: #D8DDF0;
  --color-border-strong: #C7CEE5;

  --color-text: #111827;
  --color-text-muted: #6B7280;
  --color-text-soft: #8A8FA3;

  --color-success: #16A34A;
  --color-success-bg: #DCFCE7;
  --color-warning: #D97706;
  --color-warning-bg: #FEF3C7;
  --color-danger: #DC2626;
  --color-danger-bg: #FEE2E2;
  --color-info: #2563EB;
  --color-info-bg: #DBEAFE;

  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 999px;

  --shadow-sm: 0 4px 12px rgba(17, 24, 39, 0.06);
  --shadow-md: 0 12px 30px rgba(91, 0, 201, 0.08);
  --shadow-lg: 0 20px 50px rgba(91, 0, 201, 0.12);

  --sidebar-width: 292px;
  --topbar-height: 72px;
}
```

---

## 32. Regras para o Claude Design

Ao criar o design system, seguir estas regras:

1. Manter o padrão visual claro, roxo e acadêmico.
2. Usar sidebar fixa como base da aplicação.
3. Usar cards brancos sobre fundo azul claro.
4. Usar roxo apenas para hierarquia, ação e estado ativo.
5. Evitar interfaces escuras nesta versão.
6. Evitar excesso de gradiente.
7. Usar componentes reutilizáveis.
8. Priorizar tabelas, formulários e cards operacionais.
9. Manter consistência entre catálogo, membros e circulação.
10. Criar estados de loading, vazio, erro e sucesso.
11. Manter botões com verbos claros.
12. Usar português brasileiro como idioma principal.
13. Garantir responsividade para desktop, tablet e mobile.
14. Garantir foco visível e labels acessíveis.
15. Documentar tokens, componentes e variações.

---

## 33. Checklist de Entrega do Design System

O design system deve entregar:

- [ ] Paleta de cores;
- [ ] Tokens CSS;
- [ ] Tipografia;
- [ ] Espaçamentos;
- [ ] Radius;
- [ ] Sombras;
- [ ] Botões;
- [ ] Inputs;
- [ ] Selects;
- [ ] Textareas;
- [ ] Checkboxes;
- [ ] Switches;
- [ ] Badges;
- [ ] Tags;
- [ ] Cards;
- [ ] Tabelas;
- [ ] Sidebar;
- [ ] Topbar;
- [ ] Modais;
- [ ] Toasts;
- [ ] Empty states;
- [ ] Loading states;
- [ ] Dashboard;
- [ ] Catálogo;
- [ ] Cadastro de livro;
- [ ] Perfil de membro;
- [ ] Circulação;
- [ ] Relatórios;
- [ ] Configurações;
- [ ] Tela de login;
- [ ] Responsividade.

---

## 34. Referência de Direção Visual

A direção visual deve seguir estas características:

- fundo claro azulado;
- sidebar vertical limpa;
- roxo como cor de marca;
- ícones lineares;
- cards grandes;
- formulários com bordas suaves;
- botões com gradiente roxo;
- tabelas com divisões discretas;
- badges arredondadas;
- avatar e perfil de usuário na sidebar;
- telas com aparência de sistema real de biblioteca.

O resultado deve parecer um produto pronto para uso administrativo, não apenas um mockup decorativo.
