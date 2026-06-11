import { useEffect, useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { atualizarLivro, detalheLivro } from '../../api/catalog/livros'
import type { LivroDetalhe } from '../../api/catalog/types'

type FormState = {
  titulo: string
  isbn: string
  anoPublicacao: string
  idEditora: string
  autores: string
  categorias: string
}

function toForm(livro: LivroDetalhe): FormState {
  return {
    titulo: livro.titulo,
    isbn: livro.isbn,
    anoPublicacao: String(livro.ano_publicacao),
    idEditora: String(livro.id_editora),
    autores: livro.autores?.map((autor) => String(autor.id_autor)).join(', ') ?? '',
    categorias: livro.categorias?.map((categoria) => String(categoria.id_categoria)).join(', ') ?? '',
  }
}

function splitIds(value: string): Array<{ id_autor: number }> {
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isFinite(id) && id > 0)
    .map((id_autor) => ({ id_autor }))
}

function splitCategoryIds(value: string): Array<{ id_categoria: number }> {
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isFinite(id) && id > 0)
    .map((id_categoria) => ({ id_categoria }))
}

export function EditarLivroPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const idLivro = Number(id)
    if (!Number.isFinite(idLivro)) {
      setError('Livro invalido.')
      return
    }

    let ignore = false
    setError(null)
    startTransition(() => {
      void detalheLivro(idLivro)
        .then((livro) => {
          if (!ignore) {
            setForm(toForm(livro))
          }
        })
        .catch((caught: { message?: string }) => {
          if (!ignore) {
            setError(caught.message ?? 'Nao foi possivel carregar o livro.')
          }
        })
    })

    return () => {
      ignore = true
    }
  }, [id])

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => (current ? { ...current, [field]: value } : current))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form) return

    const idLivro = Number(id)
    setError(null)
    startTransition(() => {
      void atualizarLivro(idLivro, {
        titulo: form.titulo,
        isbn: form.isbn,
        ano_publicacao: Number(form.anoPublicacao),
        id_editora: Number(form.idEditora),
        autores: splitIds(form.autores),
        categorias: splitCategoryIds(form.categorias),
      })
        .then(() => navigate(`/catalogo/${idLivro}`))
        .catch((caught: { message?: string }) => {
          setError(caught.message ?? 'Nao foi possivel atualizar o livro.')
        })
    })
  }

  return (
    <main className="catalog-page">
      <section className="catalog-card">
        <Link className="catalog-back" to={id ? `/catalogo/${id}` : '/catalogo'}>
          Voltar
        </Link>
        <p className="eyebrow">Catalogo</p>
        <h1>Editar livro</h1>
        <p className="lede">
          Atualize os metadados e informe os IDs de autores e categorias associados.
        </p>

        {error ? <p className="form-error">{error}</p> : null}
        {!form ? <p className="catalog-muted">Carregando...</p> : null}

        {form ? (
          <form className="catalog-form" onSubmit={handleSubmit}>
            <label>
              Titulo
              <input required value={form.titulo} onChange={(event) => updateField('titulo', event.target.value)} />
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
              ID da editora
              <input
                required
                type="number"
                min={1}
                value={form.idEditora}
                onChange={(event) => updateField('idEditora', event.target.value)}
              />
            </label>
            <label>
              IDs dos autores separados por virgula
              <input required value={form.autores} onChange={(event) => updateField('autores', event.target.value)} />
            </label>
            <label>
              IDs das categorias separados por virgula
              <input
                required
                value={form.categorias}
                onChange={(event) => updateField('categorias', event.target.value)}
              />
            </label>

            <button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
          </form>
        ) : null}
      </section>
    </main>
  )
}
