Catalog book card — cover, title, author, status badge, category and availability, with a primary action.

```jsx
<BookCard
  book={{ title: "Dom Casmurro", author: "Machado de Assis", status: "Disponível", category: "Ficção", available: 3, copies: 5 }}
  actionLabel="Ver Detalhes"
  onAction={...}
/>
```

Grid these for the catálogo grid view. Use `coverSrc` for real cover images.
