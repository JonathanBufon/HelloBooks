Labeled text field. Label above, error/hint below the field, 48px tall, purple focus halo. Always pass a real `label` (a11y §27.3).

```jsx
<TextInput label="Título da obra" placeholder="Ex.: Dom Casmurro" required />
<TextInput label="ISBN-13" error="ISBN inválido. Use o formato ISBN-13." />
<TextInput label="E-mail" icon={<Mail size={18} />} />
```

Props: `value`, `placeholder`, `type`, `hint`, `error`, `icon`, `disabled`, `readOnly`, `required`.
