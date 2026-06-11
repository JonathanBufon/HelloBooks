import { useDeferredValue, useEffect, useState, useTransition } from 'react'
import { Link } from 'react-router-dom'
import { listarLivros } from '../../api/catalog/livros'
import type { Livro, Page } from '../../api/catalog/types'

const emptyPage: Page<Livro> = {
  data: [],
  pagination: { total: 0, per_page: 20, current_page: 1, last_page: 1 },
}

export function ListaCatalogoPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<Page<Livro>>(emptyPage)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let ignore = false
    setError(null)

    startTransition(() => {
      void listarLivros({ q: deferredQuery || undefined, page })
        .then((data) => {
          if (!ignore) {
            setResult(data)
          }
        })
        .catch((caught: { message?: string }) => {
          if (!ignore) {
            setError(caught.message ?? 'Nao foi possivel carregar o catalogo.')
          }
        })
    })

    return () => {
      ignore = true
    }
  }, [deferredQuery, page])

  function handleQuery(value: string) {
    setQuery(value)
    setPage(1)
  }

  return (
    <main className="catalog-page catalog-page--wide">
      <section className="catalog-card catalog-card--wide">
        <div className="catalog-header">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h1>Obras do acervo</h1>
            <p className="lede">Busque por titulo, ISBN, autor ou categoria.</p>
          </div>
          <div className="catalog-actions">
            <Link className="catalog-link-button" to="/catalogo/apoio">
              Apoio
            </Link>
            <Link className="catalog-link-button" to="/catalogo/novo">
              Novo livro
            </Link>
          </div>
        </div>

        <label className="search-field">
          Buscar
          <input
            value={query}
            placeholder="Ex.: Machado, Romance, 978..."
            onChange={(event) => handleQuery(event.target.value)}
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}
        {isPending ? <p className="catalog-muted">Carregando...</p> : null}

        <div className="catalog-table-wrap">
          <table className="catalog-table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>ISBN</th>
                <th>Editora</th>
                <th>Autores</th>
                <th>Categorias</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((livro) => (
                <tr key={livro.id_livro}>
                  <td>
                    <Link to={`/catalogo/${livro.id_livro}`}>{livro.titulo}</Link>
                  </td>
                  <td>{livro.isbn}</td>
                  <td>{livro.editora?.nome ?? '-'}</td>
                  <td>{livro.autores?.map((autor) => autor.nome).join(', ') ?? '-'}</td>
                  <td>{livro.categorias?.map((categoria) => categoria.nome).join(', ') ?? '-'}</td>
                </tr>
              ))}
              {result.data.length === 0 ? (
                <tr>
                  <td colSpan={5}>Nenhuma obra encontrada.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span>
            Pagina {result.pagination.current_page} de {result.pagination.last_page || 1} -{' '}
            {result.pagination.total} registros
          </span>
          <div>
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= result.pagination.last_page}
              onClick={() => setPage((current) => current + 1)}
            >
              Proxima
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
