Centered modal for quick actions and confirmations. Keep long forms on their own page (DESIGN.md §20.3).

```jsx
<Modal
  title="Remover Livro"
  description="Esta ação não pode ser desfeita."
  danger
  onClose={close}
  footer={<>
    <Button variant="secondary" onClick={close}>Cancelar</Button>
    <Button variant="danger">Remover Livro</Button>
  </>}
/>
```

Set `danger` to highlight destructive confirmations. `open={false}` renders nothing.
