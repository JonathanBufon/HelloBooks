# Hello Books — Design System

**Hello Books** é um sistema de gestão para **bibliotecas acadêmicas**: catálogo digital, membros, empréstimos, devoluções, multas, relatórios e administração do acervo. O público são bibliotecários, administradores e equipes de atendimento. A interface deve transmitir **organização, confiança, clareza e ritmo de trabalho** — um sistema operacional acadêmico real, não uma rede social ou landing page.

A linguagem visual é **clara, moderna e institucional**: fundo azul-claro, cards brancos, **roxo institucional** como cor de marca, ícones lineares, sidebar fixa, formulários objetivos e componentes reutilizáveis.

## Fontes deste design system

Este design system foi construído a partir da especificação `uploads/DESIGN(8).md` (guia de design completo do produto) e do repositório do produto:

- **GitHub:** https://github.com/JonathanBufon/HelloBooks (branch `master-noai`) — backend Laravel (catálogo, exemplares, usuários) e domínio. O diretório `frontend/` está vazio nesta branch, então **a especificação `DESIGN.md` é a fonte de verdade visual**, complementada pelo domínio modelado no backend (`backend/app/Domain/...`: Exemplar, StatusExemplar, CondicaoFisica, CargoUsuario; catálogo com Autor, Categoria, Editora, Livro).

Explore o repositório acima para aprofundar o entendimento do domínio (status de exemplar, transições, regras de catálogo) ao construir telas baseadas neste produto.

> ⚠️ **Substituição de fonte:** a fonte oficial é **Inter**, carregada via Google Fonts (`tokens/fonts.css`). Não há binários `.woff2` embarcados, então o compilador reporta "0 fonts". Para uso 100% offline, adicione os arquivos da Inter e troque por regras `@font-face`. Se você tem os binários oficiais, me envie que eu embarco.

---

## CONTENT FUNDAMENTALS

**Idioma:** português brasileiro (pt-BR) é o padrão. Termos de domínio são consistentes: *Livro, Membro, Empréstimo, Devolução, Exemplar, Acervo, Catálogo, Multa, Reserva, Relatório*. Evite misturar inglês (`loan`, `book`) no meio de telas em português.

**Tom:** administrativo, objetivo e claro. A interface fala com profissionais que executam tarefas — sem marketing, sem entusiasmo decorativo.

**Casing:** Títulos em *Title Case* curto ("Cadastrar Livro", "Perfil do Membro"). Labels curtas. Cabeçalhos de tabela em CAIXA-ALTA (12px, 700, tracking 0.04em).

**Botões usam verbo de ação** no infinitivo ou imperativo direto:
- ✅ `Cadastrar Livro`, `Registrar Empréstimo`, `Processar Devolução`, `Ver Histórico`, `Atualizar Informações`, `Importar Metadados`
- ❌ `Ok`, `Enviar`, `Confirmar` (quando o contexto não está claro)

**Mensagens são específicas e úteis:**
- Erro de campo: `ISBN inválido. Use o formato ISBN-13.` / `Selecione um membro ativo.` / `A data de vencimento não pode ser anterior à retirada.`
- Empty state: explica o próximo passo — `Nenhum livro cadastrado ainda. Comece adicionando o primeiro título ao catálogo.`
- Erro de carregamento: o que aconteceu + o que fazer — `Não foi possível carregar o catálogo. Verifique sua conexão ou tente novamente.`
- Sucesso: curto — `Empréstimo registrado.` / `Devolução processada.`

**Emoji:** não usar. A iconografia é feita com ícones lineares (Lucide).

**Subtítulos** explicam a função da tela, não decoram ("Consulta e manutenção do acervo", "Situação operacional da biblioteca").

---

## VISUAL FOUNDATIONS

**Cor.** Roxo institucional (`#5B00C9`) é a cor de marca, usada **apenas** para hierarquia, ação e estado ativo — nunca como preenchimento gratuito. Fundo da aplicação é azul-claro (`#F3F6FF`); superfícies (cards, modais, formulários) são brancas; inputs e blocos auxiliares usam azul muito suave (`#EEF3FF`). Texto principal quase-preto (`#111827`), com dois níveis de cinza para subtítulos e metadados. Cores semânticas seguem convenção: verde disponível/confirmado, âmbar atenção/pendente, vermelho atraso/erro, azul informação.

**Gradiente.** `linear-gradient(135deg, #5B00C9 → #7C3AED)` aparece **só em destaques**: coluna institucional do login, botão primário, card de multas pendentes, CTAs. Excesso de gradiente reduz a clareza — evite.

**Tipografia.** Inter, 400–800. Escala de 12px (metadados) a 36px (métricas grandes). Títulos de página 28/800, seção 22/700, card 18/600, corpo 16/400, campos 14/500. Tracking levemente negativo em títulos grandes; tracking positivo + uppercase em cabeçalhos de tabela.

**Espaçamento.** Base 4px (escala 4→48). Cards têm padding 24–32px, seções têm 32px de gap, campos de formulário 16–20px de gap. Sidebar 292px de largura; topbar 72px de altura.

**Backgrounds.** Lisos. Sem imagens de fundo, texturas, padrões ou gradientes decorativos. O contraste vem de superfície branca sobre azul-claro. Imagens reais aparecem apenas como capas de livro e fotos de membro.

**Cantos & bordas.** Cantos arredondados generosos: chips 8px, inputs/botões 12px, cards 20px, cards grandes/modais 24px, avatares/badges 999px. Borda padrão `1px solid #D8DDF0`; borda ativa roxa.

**Sombras.** Suaves e claras, com tom roxo nas elevações maiores — nunca escuras. `sm` para botões/chips, `md` para cards (`0 12px 30px rgba(91,0,201,.08)`), `lg` para modais/destaques.

**Cards.** Brancos, raio 20px, borda fina azulada, sombra `md`, padding ~28px. Cards de alerta usam cor semântica no ícone e no texto — **não** pintam o card inteiro, exceto destaques como multas pendentes (gradiente roxo).

**Animação.** Discreta e funcional: transições de 120–200ms em background/cor/borda. Sem bounce, sem loops decorativos. Hover de itens de navegação e linhas de tabela é uma mudança suave de fundo.

**Hover.** Botão primário clareia levemente (brightness 1.06); secundário/ghost ganham fundo roxo-50; itens da sidebar e linhas de tabela recebem fundo roxo claro (`#F5F3FF`/`#EDE9FE`). **Foco:** borda roxa + halo `0 0 0 3px rgba(91,0,201,.12)`. Foco visível é obrigatório para teclado.

**Transparência & blur.** Uso mínimo — apenas o overlay de modal (preto a 40% + leve blur) e superfícies translúcidas brancas sobre o painel roxo do login.

**Layout.** Sidebar fixa à esquerda + topbar com busca global + área principal rolável com grid. Tabelas com linhas altas (64px) e divisores discretos para densidade operacional confortável.

---

## ICONOGRAPHY

- **Biblioteca:** **Lucide Icons** — ícones lineares, stroke 2px consistente, cantos arredondados. Carregados via CDN (`https://unpkg.com/lucide`). Phosphor e Heroicons são alternativas aceitáveis com o mesmo peso de traço, mas padronize em Lucide.
- **Tamanhos:** 18px em menus, 20px em botões, 24px em cards, 32px em blocos de destaque.
- **Mapa por módulo:** Dashboard `layout-grid` · Catálogo `book-open` · Membros `users` · Circulação `arrow-left-right` · Relatórios `bar-chart-3` · Configurações `settings` · Empréstimo `clipboard-list` · Devolução `rotate-ccw` · Multa `alert-circle` · Livro `book` · Busca `search` · Reserva `bookmark`.
- **Sem emoji.** Ícones sem texto recebem `aria-label`.
- **Logo:** `assets/logo.svg` (marca sobre superfície) e `assets/logo-mono.svg` (monocromática para o painel roxo). A marca é um livro aberto estilizado dentro de um quadrado de cantos arredondados com o gradiente roxo.

---

## Índice / Manifesto

**Raiz**
- `styles.css` — ponto de entrada global (só `@import`). Consumidores linkam este arquivo.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radii.css`, `fonts.css`, `base.css`.
- `assets/` — `logo.svg`, `logo-mono.svg`.
- `guidelines/` — cards de especificação (Colors, Type, Spacing, Brand) exibidos na aba Design System.
- `SKILL.md` — wrapper para uso como Agent Skill.

**Componentes** (`components/<grupo>/`) — `window.HelloBooksDesignSystem_5c47c8`
- `actions/` — **Button**, **IconButton**
- `forms/` — **TextInput**, **Textarea**, **Select**, **Checkbox**, **Switch**, **SearchInput**
- `data/` — **Badge**, **StatusBadge**, **Tag**, **Avatar**, **MetricCard**, **DataTable**
- `layout/` — **Card** (+ CardHeader), **PageHeader**
- `navigation/` — **Sidebar**, **SidebarItem**, **Topbar**
- `feedback/` — **Modal**, **Toast**
- `library/` — **BookCover**, **BookCard**, **MemberProfileCard**, **FineSummaryCard**

**UI Kit** (`ui_kits/hellobooks/`)
- `index.html` — app interativo: Login → Dashboard, Catálogo, Perfil de Membro, Circulação (navegação pela sidebar).
- Telas: `LoginScreen`, `DashboardScreen`, `CatalogScreen`, `MemberProfileScreen`, `CirculationScreen` + `AppShell` e `icons.jsx`.

**Starting points:** Button, TextInput, MetricCard, DataTable, Sidebar, BookCard, e a tela completa do app.
