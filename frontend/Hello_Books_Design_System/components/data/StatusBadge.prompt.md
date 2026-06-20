Status badge that auto-maps a Hello Books domain status string to the correct color.

```jsx
<StatusBadge status="Disponível" />   {/* verde */}
<StatusBadge status="Atrasado" />     {/* vermelho */}
<StatusBadge status="Reservado" />    {/* roxo */}
<StatusBadge status="Manutenção" />   {/* azul */}
```

Knows livro, membro and empréstimo statuses (see DESIGN.md §9.3, §10.4, §11.4). Unknown strings fall back to neutral.
