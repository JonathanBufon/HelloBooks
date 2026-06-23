Toast for short feedback. Keep success messages brief (DESIGN.md §26.4).

```jsx
<Toast tone="success" title="Empréstimo registrado." />
<Toast tone="danger" title="Não foi possível carregar o catálogo." message="Verifique sua conexão ou tente novamente." onClose={...} />
```

Tones: `success`, `danger`, `warning`, `info`.
