import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Grid3X3, List, Plus } from 'lucide-react';
import * as livrosApi from '../../api/catalog/livros';
import * as categoriasApi from '../../api/catalog/categorias';
import { Button } from '../../components/ds/actions/Button';
import { IconButton } from '../../components/ds/actions/IconButton';
import { PaginationControls } from '../../components/common/PaginationControls';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Select } from '../../components/ds/forms/Select';
import { SearchInput } from '../../components/ds/forms/SearchInput';
import { BookCover } from '../../components/ds/library/BookCover';
import { BookCard } from '../../components/ds/library/BookCard';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import type { Categoria, Livro, PaginatedResponse } from '../../types/api';
import { getErrorMessage, joinNames } from '../../utils/format';

type ViewMode = 'grid' | 'table';

const columns: DataColumn[] = [
  {
    key: 'capa',
    label: 'Capa',
    width: 88,
    render: (_value, row: Livro) => <BookCover title={row.titulo} author={joinNames(row.autores)} width={44} />,
  },
  {
    key: 'titulo',
    label: 'Titulo / Autor',
    render: (_value, row: Livro) => (
      <div>
        <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>{row.titulo}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{joinNames(row.autores)}</div>
      </div>
    ),
  },
  { key: 'isbn', label: 'ISBN' },
  {
    key: 'categoria',
    label: 'Categoria',
    render: (_value, row: Livro) => row.categorias?.[0]?.nome ?? '-',
  },
  {
    key: 'editora',
    label: 'Editora',
    render: (_value, row: Livro) => row.editora?.nome ?? '-',
  },
];

export function CatalogoListaPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showError } = useToast();
  const [response, setResponse] = useState<PaginatedResponse<Livro> | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [categoriaId, setCategoriaId] = useState('');
  const [status, setStatus] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1));

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearchParams(query ? { q: query } : {});
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [query, setSearchParams]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    livrosApi.list({ page, per_page: 12, q: query || undefined })
      .then((data) => {
        if (active) setResponse(data);
      })
      .catch((error) => showError(getErrorMessage(error, 'Nao foi possivel carregar o catalogo.')))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, query, showError]);

  useEffect(() => {
    categoriasApi.list({ per_page: 100 })
      .then((data) => setCategorias(data.data))
      .catch((error) => showError(getErrorMessage(error, 'Nao foi possivel carregar categorias.')));
  }, [showError]);

  const livros = (response?.data ?? []).filter((livro) => {
    if (!categoriaId) return true;
    return livro.categorias?.some((categoria) => String(categoria.id_categoria) === categoriaId) ?? false;
  });
  const isBibliotecario = usuario?.cargo === 'bibliotecario';

  return (
    <>
      <PageHeader
        title="Catalogo"
        subtitle="Busque e navegue pelo acervo da biblioteca"
        actions={isBibliotecario ? <Button icon={<Plus size={18} />} onClick={() => navigate('/catalogo/novo')}>Cadastrar Livro</Button> : undefined}
      />

      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 220px auto', gap: '12px', alignItems: 'end' }}>
          <SearchInput
            value={query}
            placeholder="Buscar por titulo, autor ou ISBN"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select
            label="Categoria"
            value={categoriaId}
            placeholder="Todas"
            options={categorias.map((categoria) => ({ value: String(categoria.id_categoria), label: categoria.nome }))}
            onChange={(event) => setCategoriaId(event.target.value)}
          />
          <Select
            label="Status"
            value={status}
            placeholder="Todos"
            options={['Disponivel', 'Emprestado', 'Reservado', 'Manutencao']}
            onChange={(event) => setStatus(event.target.value)}
          />
          <div style={{ display: 'flex', gap: '8px', height: 48, alignItems: 'center' }}>
            <IconButton aria-label="Grade" active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
              <Grid3X3 size={18} />
            </IconButton>
            <IconButton aria-label="Tabela" active={viewMode === 'table'} onClick={() => setViewMode('table')}>
              <List size={18} />
            </IconButton>
          </div>
        </div>
        {status && (
          <p style={{ margin: '12px 0 0', color: 'var(--color-text-soft)', fontSize: 'var(--text-xs)' }}>
            O contrato atual de listagem nao retorna status agregado por livro; o filtro sera aplicado quando esse dado existir na API.
          </p>
        )}
      </Card>

      {isLoading ? (
        <Card>Carregando catalogo...</Card>
      ) : livros.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '42px', color: 'var(--color-text-muted)' }}>
            Nenhum livro cadastrado ainda. Comece adicionando o primeiro titulo ao catalogo.
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
          {livros.map((livro) => (
            <BookCard
              key={livro.id_livro}
              book={{
                title: livro.titulo,
                author: joinNames(livro.autores),
                category: livro.categorias?.[0]?.nome ?? '-',
                status: 'Disponivel',
              }}
              onAction={() => navigate(`/catalogo/${livro.id_livro}`)}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={livros}
          rowKey="id_livro"
          onRowClick={(livro) => navigate(`/catalogo/${livro.id_livro}`)}
          emptyText="Nenhum livro encontrado."
        />
      )}

      <PaginationControls pagination={response?.pagination} page={page} onPageChange={setPage} />
    </>
  );
}
