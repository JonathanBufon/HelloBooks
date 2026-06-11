import { useEffect, useState, useTransition } from 'react'
import { Link } from 'react-router-dom'
import { listarAutores, removerAutor } from '../../api/catalog/autores'
import { listarCategorias, removerCategoria } from '../../api/catalog/categorias'
import { listarEditoras, removerEditora } from '../../api/catalog/editoras'
import type { Autor, Categoria, Editora } from '../../api/catalog/types'

type ApoioRow = {
  id: number
  nome: string
  onRemove: () => void
}

export function CatalogoApoioPage() {
  const [autores, setAutores] = useState<Autor[]>([])
  const [editoras, setEditoras] = useState<Editora[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function carregar() {
    setError(null)
    startTransition(() => {
      void Promise.all([listarAutores(), listarEditoras(), listarCategorias()])
        .then(([autoresPage, editorasPage, categoriasPage]) => {
          setAutores(autoresPage.data)
          setEditoras(editorasPage.data)
          setCategorias(categoriasPage.data)
        })
        .catch((caught: { message?: string }) => {
          setError(caught.message ?? 'Nao foi possivel carregar entidades de apoio.')
        })
    })
  }

  useEffect(() => {
    carregar()
  }, [])

  function remover(action: () => Promise<void>) {
    setError(null)
    startTransition(() => {
      void action()
        .then(() => carregar())
        .catch((caught: { message?: string }) => {
          setError(caught.message ?? 'Nao foi possivel remover o registro.')
        })
    })
  }

  function secao(titulo: string, rows: ApoioRow[]) {
    return (
      <section className="support-section">
        <h2>{titulo}</h2>
        <div className="catalog-table-wrap">
          <table className="catalog-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.nome}</td>
                  <td>
                    <button type="button" onClick={row.onRemove} disabled={isPending}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3}>Nenhum registro encontrado.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    )
  }

  return (
    <main className="catalog-page catalog-page--wide">
      <section className="catalog-card catalog-card--wide">
        <Link className="catalog-back" to="/catalogo">
          Voltar ao catalogo
        </Link>

        <div className="catalog-header">
          <div>
            <p className="eyebrow">Catalogo</p>
            <h1>Entidades de apoio</h1>
            <p className="lede">Remova autores, editoras e categorias que nao tenham livros associados.</p>
          </div>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
        {isPending ? <p className="catalog-muted">Carregando...</p> : null}

        {secao(
          'Autores',
          autores.map((autor) => ({
            id: autor.id_autor,
            nome: autor.nome,
            onRemove: () => remover(() => removerAutor(autor.id_autor)),
          })),
        )}
        {secao(
          'Editoras',
          editoras.map((editora) => ({
            id: editora.id_editora,
            nome: editora.nome,
            onRemove: () => remover(() => removerEditora(editora.id_editora)),
          })),
        )}
        {secao(
          'Categorias',
          categorias.map((categoria) => ({
            id: categoria.id_categoria,
            nome: categoria.nome,
            onRemove: () => remover(() => removerCategoria(categoria.id_categoria)),
          })),
        )}
      </section>
    </main>
  )
}
