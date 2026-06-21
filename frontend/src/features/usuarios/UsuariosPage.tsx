import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import * as usuariosApi from '../../api/usuarios';
import { Button } from '../../components/ds/actions/Button';
import { PaginationControls } from '../../components/common/PaginationControls';
import { Badge } from '../../components/ds/data/Badge';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Modal } from '../../components/ds/feedback/Modal';
import { SearchInput } from '../../components/ds/forms/SearchInput';
import { Select } from '../../components/ds/forms/Select';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Textarea } from '../../components/ds/forms/Textarea';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { Pagination } from '../../types/api';
import type { Cargo, Usuario } from '../../types/auth';
import { formatDate, getErrorMessage, STATUS_LABELS } from '../../utils/format';

interface UsuarioFormState {
  nome_completo: string;
  email: string;
  senha: string;
  cargo: Cargo;
  endereco: string;
}

const emptyForm: UsuarioFormState = {
  nome_completo: '',
  email: '',
  senha: '',
  cargo: 'bibliotecario',
  endereco: '',
};

export function UsuariosPage() {
  const { showSuccess, showError } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState<Usuario | null>(null);
  const [form, setForm] = useState<UsuarioFormState>(emptyForm);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await usuariosApi.list({ page, per_page: 10, q: query || undefined });
      setUsuarios(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel carregar usuarios.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, query]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (usuario: Usuario) => {
    setEditing(usuario);
    setForm({
      nome_completo: usuario.nome_completo,
      email: usuario.email,
      senha: '',
      cargo: usuario.cargo,
      endereco: usuario.endereco ?? '',
    });
    setModalOpen(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await usuariosApi.update(editing.id_usuario, {
          nome_completo: form.nome_completo,
          email: form.email,
          senha: form.senha || undefined,
          cargo: form.cargo,
          endereco: form.endereco || null,
        });
        showSuccess('Usuario atualizado.');
      } else {
        await usuariosApi.create({ ...form, endereco: form.endereco || null });
        showSuccess('Usuario cadastrado.');
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel salvar usuario.'));
    }
  };

  const destroy = async () => {
    if (!deleting) return;
    try {
      await usuariosApi.remove(deleting.id_usuario);
      showSuccess('Usuario removido.');
      setDeleting(null);
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel remover usuario.'));
    }
  };

  const columns: DataColumn[] = [
    { key: 'nome_completo', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'cargo', label: 'Cargo', render: (value: Cargo) => <Badge tone={value === 'bibliotecario' ? 'primary' : 'neutral'}>{STATUS_LABELS[value]}</Badge> },
    { key: 'created_at', label: 'Cadastro', render: (value?: string) => formatDate(value) },
    {
      key: 'acoes',
      label: 'Acoes',
      align: 'right',
      render: (_value, row: Usuario) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(row)}>Excluir</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle="Gerencie contas e cargos de acesso"
        actions={<Button icon={<Plus size={18} />} onClick={openCreate}>Cadastrar Usuario</Button>}
      />
      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <SearchInput value={query} placeholder="Buscar por nome ou email" onChange={(event) => { setPage(1); setQuery(event.target.value); }} />
      </Card>

      {isLoading ? <Card>Carregando usuarios...</Card> : <DataTable columns={columns} rows={usuarios} rowKey="id_usuario" />}
      <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />

      <Modal
        open={modalOpen}
        title={editing ? 'Editar Usuario' : 'Cadastrar Usuario'}
        onClose={() => setModalOpen(false)}
        width={680}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </>
        )}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <TextInput label="Nome completo" value={form.nome_completo} onChange={(event) => setForm({ ...form, nome_completo: event.target.value })} />
          <TextInput label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <TextInput label={editing ? 'Senha (opcional)' : 'Senha'} type="password" value={form.senha} onChange={(event) => setForm({ ...form, senha: event.target.value })} />
          <Select
            label="Cargo"
            value={form.cargo}
            options={[{ value: 'bibliotecario', label: 'Bibliotecario' }, { value: 'leitor', label: 'Leitor' }]}
            onChange={(event) => setForm({ ...form, cargo: event.target.value as Cargo })}
          />
        </div>
        <Textarea label="Endereco" value={form.endereco} rows={3} style={{ marginTop: '14px' }} onChange={(event) => setForm({ ...form, endereco: event.target.value })} />
      </Modal>

      <Modal
        open={!!deleting}
        title="Excluir Usuario"
        description="A API pode bloquear auto-exclusao ou usuarios em uso."
        danger
        onClose={() => setDeleting(null)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancelar</Button>
            <Button variant="danger" onClick={destroy}>Excluir</Button>
          </>
        )}
      >
        {deleting && <p>Confirma excluir {deleting.nome_completo}?</p>}
      </Modal>
    </>
  );
}
