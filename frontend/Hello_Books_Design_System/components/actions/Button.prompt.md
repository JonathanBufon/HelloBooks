Primary action button — gradient roxo for primary actions, outline for secondary, red for destructive. Use action verbs as labels.

```jsx
<Button variant="primary" size="md">Registrar Empréstimo</Button>
<Button variant="secondary">Ver Histórico</Button>
<Button variant="danger">Remover Livro</Button>
<Button variant="ghost">Cancelar</Button>
```

Variants: `primary` (gradient), `secondary` (white + purple outline), `danger` (white + red text/border), `ghost`. Sizes: `sm` 36px, `md` 44px, `lg` 52px. Pass `icon` / `iconRight` for Lucide nodes, `full` to stretch, `disabled` to dim.
