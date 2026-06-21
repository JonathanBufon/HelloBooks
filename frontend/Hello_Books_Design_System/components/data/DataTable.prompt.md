Operational data table for livros, membros, empréstimos. Uppercase header on soft blue, 64px rows, purple hover, actions at right via `render`.

```jsx
<DataTable
  columns={[
    { key: "titulo", label: "Livro" },
    { key: "membro", label: "Membro" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "acoes", label: "Ações", align: "right", render: (_, r) => <Button size="sm" variant="ghost">Ver</Button> },
  ]}
  rows={loans}
/>
```

Pass `onRowClick` for navigable rows, `emptyText` for empty states.
