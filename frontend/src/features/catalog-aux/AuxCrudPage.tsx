import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ds/actions/Button';
import { PaginationControls } from '../../components/common/PaginationControls';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Modal } from '../../components/ds/feedback/Modal';
import { SearchInput } from '../../components/ds/forms/SearchInput';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { PaginatedResponse, Pagination } from '../../types/api';
import { formatDate, getErrorMessage } from '../../utils/format';

interface AuxEntity {
  nome: string;
  created_at?: string;
}

interface AuxApi<T extends AuxEntity> {
  list: (params: { page?: number; per_page?: number; q?: string }) => Promise<PaginatedResponse<T>>;
  create: (payload: { nome: string }) => Promise<T>;
  update: (id: number, payload: { nome: string }) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

interface AuxCrudPageProps<T extends AuxEntity> {
  title: string;
  singular: string;
  idKey: keyof T;
  api: AuxApi<T>;
}

export function AuxCrudPage<T extends AuxEntity>({ title, singular, idKey, api }: AuxCrudPageProps<T>) {
  const { showSuccess, showError } = useToast();
  const [rows, setRows] = useState<T[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [name, setName] = useState('');

  const entityId = (entity: T) => Number(entity[idKey]);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await api.list({ page, per_page: 10, q: query || undefined });
      setRows(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showError(getErrorMessage(error, `Nao foi possivel carregar ${title.toLowerCase()}.`));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, query]);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setModalOpen(true);
  };

  const save = async () => {
    if (!name.trim()) return;
    try {
      if (editing) {
        await api.update(entityId(editing), { nome: name.trim() });
        showSuccess(`${singular} atualizado.`);
      } else {
        await api.create({ nome: name.trim() });
        showSuccess(`${singular} cadastrado.`);
      }
      setModalOpen(false);
      setEditing(null);
      setName('');
      await load();
    } catch (error) {
      showError(getErrorMessage(error, `Nao foi possivel salvar ${singular.toLowerCase()}.`));
    }
  };

  const destroy = async () => {
    if (!deleting) return;
    try {
      await api.remove(entityId(deleting));
      showSuccess(`${singular} removido.`);
      setDeleting(null);
      await load();
    } catch (error) {
      showError(getErrorMessage(error, `Nao foi possivel remover ${singular.toLowerCase()}.`));
    }
  };

  const columns: DataColumn[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'created_at', label: 'Cadastro', render: (value?: string) => formatDate(value) },
    {
      key: 'acoes',
      label: 'Acoes',
      align: 'right',
      render: (_value, row: T) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button size="sm" variant="secondary" onClick={() => { setEditing(row); setName(row.nome); setModalOpen(true); }}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(row)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={title}
        subtitle={`Gerencie ${title.toLowerCase()} do catalogo`}
        actions={<Button icon={<Plus size={18} />} onClick={openCreate}>Cadastrar {singular}</Button>}
      />

      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <SearchInput value={query} placeholder={`Buscar ${singular.toLowerCase()}`} onChange={(event) => { setPage(1); setQuery(event.target.value); }} />
      </Card>

      {isLoading ? <Card>Carregando...</Card> : <DataTable columns={columns} rows={rows} rowKey={String(idKey)} />}
      <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />

      <Modal
        open={modalOpen}
        title={editing ? `Editar ${singular}` : `Cadastrar ${singular}`}
        onClose={() => { setModalOpen(false); setEditing(null); setName(''); }}
        footer={(
          <>
            <Button variant="ghost" onClick={() => { setModalOpen(false); setEditing(null); setName(''); }}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </>
        )}
      >
        <TextInput label="Nome" value={name} onChange={(event) => setName(event.target.value)} />
      </Modal>

      <Modal
        open={!!deleting}
        title={`Excluir ${singular}`}
        description="Esta acao nao pode ser desfeita."
        danger
        onClose={() => setDeleting(null)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancelar</Button>
            <Button variant="danger" onClick={destroy}>Excluir</Button>
          </>
        )}
      >
        {deleting && <p>Confirma excluir {deleting.nome}?</p>}
      </Modal>
    </>
  );
}
