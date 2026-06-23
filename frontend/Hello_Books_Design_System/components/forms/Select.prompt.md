Dropdown select with custom chevron, matching field styling.

```jsx
<Select label="Categoria" options={["Acadêmico","Referência","Ficção"]} />
<Select label="Idioma" options={[{value:"pt",label:"Português"},{value:"en",label:"Inglês"}]} />
```

Accepts string options or `{value,label}` objects. Same `error`/`hint`/`required` props as TextInput.
