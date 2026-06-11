import { useEffect, useState, useTransition } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { atualizarExemplar, removerExemplar } from '../../api/catalog/exemplares'
import { detalheLivro, removerLivro } from '../../api/catalog/livros'
import type { Exemplar, LivroDetalhe } from '../../api/catalog/types'

const statusLabels: Record<string, string> = {
  disponivel: 'Disponivel',
  emprestado: 'Emprestado',
  reservado: 'Reservado',
  manutencao: 'Manutencao',
}

export function DetalheLivroPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [livro, setLivro] = useState<LivroDetalhe | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function carregarLivro() {
    const idLivro = Number(id)
    if (!Number.isFinite(idLivro)) {
      setError('Livro invalido.')
      return
    }

    setError(null)
    startTransition(() => {
      void detalheLivro(idLivro)
        .then((data) => setLivro(data))
        .catch((caught: { message?: string }) => {
          setError(caught.message ?? 'Nao foi possivel carregar o livro.')
        })
    })
  }

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
        .then((data) => {
          if (!ignore) {
            setLivro(data)
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

  function mudarStatus(exemplar: Exemplar) {
    const status = exemplar.status === 'manutencao' ? 'disponivel' : 'manutencao'
    const condicao_fisica = status === 'manutencao' ? exemplar.condicao_fisica : 'intacto'

    setError(null)
    startTransition(() => {
      void atualizarExemplar(exemplar.id_exemplar, { status, condicao_fisica })
        .then(() => carregarLivro())
        .catch((caught: { message?: string }) => {
          setError(caught.message ?? 'Nao foi possivel atualizar o exemplar.')
        })
    })
  }

  function mudarCondicao(exemplar: Exemplar, condicao_fisica: Exemplar['condicao_fisica']) {
    setError(null)
    startTransition(() => {
      void atualizarExemplar(exemplar.id_exemplar, { condicao_fisica })
        .then(() => carregarLivro())
        .catch((caught: { message?: string }) => {
          setError(caught.message ?? 'Nao foi possivel atualizar a condicao.')
        })
    })
  }

  function removerLivroAtual() {
    if (!livro) {
      return
    }

    setError(null)
    startTransition(() => {
      void removerLivro(livro.id_livro)
        .then(() => navigate('/catalogo'))
        .catch((caught: { message?: string }) => {
          setError(caught.message ?? 'Nao foi possivel remover o livro.')
        })
    })
  }

  function removerExemplarAtual(exemplar: Exemplar) {
    setError(null)
    startTransition(() => {
      void removerExemplar(exemplar.id_exemplar)
        .then(() => carregarLivro())
        .catch((caught: { message?: string }) => {
          setError(caught.message ?? 'Nao foi possivel remover o exemplar.')
        })
    })
  }

  return (
    <main className="catalog-page catalog-page--wide">
      <section className="catalog-card catalog-card--wide">
        <Link className="catalog-back" to="/catalogo">
          Voltar ao catalogo
        </Link>

        {error ? <p className="form-error">{error}</p> : null}
        {isPending ? <p className="catalog-muted">Carregando...</p> : null}

        {livro ? (
          <>
            <div className="catalog-header">
              <div>
                <p className="eyebrow">Livro #{livro.id_livro}</p>
                <h1>{livro.titulo}</h1>
              </div>
              <div className="catalog-actions">
                <Link className="catalog-link-button" to={`/catalogo/${livro.id_livro}/editar`}>
                  Editar livro
                </Link>
                <button type="button" onClick={removerLivroAtual} disabled={isPending}>
                  Remover livro
                </button>
              </div>
            </div>
            <dl className="detail-grid">
              <div>
                <dt>ISBN</dt>
                <dd>{livro.isbn}</dd>
              </div>
              <div>
                <dt>Ano</dt>
                <dd>{livro.ano_publicacao}</dd>
              </div>
              <div>
                <dt>Editora</dt>
                <dd>{livro.editora?.nome ?? '-'}</dd>
              </div>
              <div>
                <dt>Autores</dt>
                <dd>{livro.autores?.map((autor) => autor.nome).join(', ') ?? '-'}</dd>
              </div>
              <div>
                <dt>Categorias</dt>
                <dd>{livro.categorias?.map((categoria) => categoria.nome).join(', ') ?? '-'}</dd>
              </div>
            </dl>

            <div className="status-grid">
              {Object.entries(livro.contagem_exemplares).map(([status, total]) => (
                <article key={status}>
                  <span>{statusLabels[status] ?? status}</span>
                  <strong>{total}</strong>
                </article>
              ))}
            </div>

            <h2>Exemplares</h2>
            <div className="catalog-table-wrap">
              <table className="catalog-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Condicao</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {livro.exemplares.map((exemplar) => (
                    <tr key={exemplar.id_exemplar}>
                      <td>{exemplar.id_exemplar}</td>
                      <td>{statusLabels[exemplar.status]}</td>
                      <td>
                        <select
                          value={exemplar.condicao_fisica}
                          onChange={(event) =>
                            mudarCondicao(exemplar, event.target.value as Exemplar['condicao_fisica'])
                          }
                        >
                          <option value="intacto">intacto</option>
                          <option value="rabiscado">rabiscado</option>
                          <option value="rasgado">rasgado</option>
                          <option value="dobrado">dobrado</option>
                        </select>
                      </td>
                      <td>
                        {exemplar.status === 'disponivel' || exemplar.status === 'manutencao' ? (
                          <div className="catalog-actions catalog-actions--row">
                            <button type="button" onClick={() => mudarStatus(exemplar)}>
                              {exemplar.status === 'manutencao' ? 'Marcar disponivel' : 'Marcar manutencao'}
                            </button>
                            <button type="button" onClick={() => removerExemplarAtual(exemplar)}>
                              Remover
                            </button>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                  {livro.exemplares.length === 0 ? (
                    <tr>
                      <td colSpan={4}>Nenhum exemplar cadastrado.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>
    </main>
  )
}
