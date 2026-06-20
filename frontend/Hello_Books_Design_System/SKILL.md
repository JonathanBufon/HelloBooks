---
name: hellobooks-design
description: Use this skill to generate well-branded interfaces and assets for Hello Books — a sistema de gestão para bibliotecas acadêmicas (catálogo, membros, empréstimos, devoluções, multas, relatórios) — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Brand:** roxo institucional (`#5B00C9`) sobre fundo azul-claro (`#F3F6FF`), cards brancos, ícones lineares (Lucide), sidebar fixa. Idioma padrão: português brasileiro.
- **Tokens:** `styles.css` → `tokens/*.css` (cores, tipografia, espaçamento, raios, fontes). Link `styles.css` para herdar todas as custom properties.
- **Components:** `components/<grupo>/*.jsx` — exportados em `window.HelloBooksDesignSystem_5c47c8` pelo bundle compilado `_ds_bundle.js`. Veja cada `*.prompt.md` para uso.
- **UI kit:** `ui_kits/hellobooks/` — recriação interativa do sistema (Login, Dashboard, Catálogo, Perfil, Circulação).
- **Voz:** administrativa, objetiva; botões com verbo de ação; sem emoji; mensagens específicas.
