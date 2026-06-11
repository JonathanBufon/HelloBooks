import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { registrarLote } from '../../api/catalog/exemplares'
import { criarLivro } from '../../api/catalog/livros'
import type { Livro } from '../../api/catalog/types'

type FormState = {
  titulo: string
  isbn: string
  anoPublicacao: string
  editora: string
  autores: string
  categorias: string
  quantidade: string
}

const initialState: FormState = {
  titulo: '',
  isbn: '',
  anoPublicacao: String(new Date().getFullYear()),
  editora: '',
  autores: '',
  categorias: '',
  quantidade: '1',
}

function splitList(value: string): Array<{ nome: string }> {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((nome) => ({ nome }))
}

export function CadastrarLivroPage() {
  const [form, setForm] = useState<FormState>(initialState)
  const [created, setCreated] = useState<Livro | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setCreated(null)

    startTransition(() => {
      void submitForm()
    })
  }

  async function submitForm() {
    try {
      const livro = await criarLivro({
        titulo: form.titulo,
        isbn: form.isbn,
        ano_publicacao: Number(form.anoPublicacao),
        editora: { nome: form.editora },
        autores: splitList(form.autores),
        categorias: splitList(form.categorias),
      })

      const quantidade = Number(form.quantidade)
      if (quantidade > 0) {
        await registrarLote(livro.id_livro, quantidade)
      }

      setCreated(livro)
      setForm(initialState)
    } catch (caught) {
      const apiError = caught as { message?: string }
      setError(apiError.message ?? 'Nao foi possivel cadastrar o livro.')
    }
  }

  return (
    <main className="catalog-page">
      <section className="catalog-card">
        <p className="eyebrow">Catalogo</p>
        <h1>Cadastrar livro</h1>
        <p className="lede">
          Informe obra, editora, autores, categorias e a quantidade inicial de exemplares.
        </p>

        <form className="catalog-form" onSubmit={handleSubmit}>
          <label>
            Titulo
            <input
              required
              value={form.titulo}
              onChange={(event) => updateField('titulo', event.target.value)}
            />
          </label>
          <label>
            ISBN
            <input
              required
              minLength={10}
              maxLength={13}
              value={form.isbn}
              onChange={(event) => updateField('isbn', event.target.value)}
            />
          </label>
          <label>
            Ano de publicacao
            <input
              required
              type="number"
              min={1000}
              value={form.anoPublicacao}
              onChange={(event) => updateField('anoPublicacao', event.target.value)}
            />
          </label>
          <label>
            Editora
            <input
              required
              value={form.editora}
              onChange={(event) => updateField('editora', event.target.value)}
            />
          </label>
          <label>
            Autores separados por virgula
            <input
              required
              value={form.autores}
              onChange={(event) => updateField('autores', event.target.value)}
            />
          </label>
          <label>
            Categorias separadas por virgula
            <input
              required
              value={form.categorias}
              onChange={(event) => updateField('categorias', event.target.value)}
            />
          </label>
          <label>
            Exemplares iniciais
            <input
              required
              type="number"
              min={1}
              max={1000}
              value={form.quantidade}
              onChange={(event) => updateField('quantidade', event.target.value)}
            />
          </label>

          <button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Cadastrar livro'}
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}
        {created ? <p className="form-success">Livro #{created.id_livro} cadastrado.</p> : null}
      </section>
    </main>
  )
}
