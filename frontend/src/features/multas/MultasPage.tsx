import { useEffect, useState } from 'react';
import { Plus, DollarSign, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import * as multasApi from '../../api/multas';
import type { MultaListParams } from '../../api/multas';
import * as usuariosApi from '../../api/usuarios';
import { Button } from '../../components/ds/actions/Button';
import { PaginationControls } from '../../components/common/PaginationControls';
import { Badge } from '../../components/ds/data/Badge';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Modal } from '../../components/ds/feedback/Modal';
import { SearchInput } from '../../components/ds/forms/SearchInput';
import { Select } from '../../components/ds/forms/Select';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { Pagination } from '../../types/api';
import type { Usuario } from '../../types/auth';
import type { ItemEmprestimoMulta, Multa, MultaCreate, MotivoMulta, StatusMulta } from '../../types/multa';
import { formatDate, getErrorMessage } from '../../utils/format';

const MOTIVO_LABELS: Record<MotivoMulta, string> = {
  atraso: 'Atraso',
  rabisco: 'Rabisco',
  rasgo: 'Rasgo',
  dobra: 'Dobra',
};

const STATUS_TONE: Record<StatusMulta, 'warning' | 'success' | 'info'> = {
  pendente: 'warning',
  paga: 'success',
  perdoada: 'info',
};

const STATUS_LABEL: Record<StatusMulta, string> = {
  pendente: 'Pendente',
  paga: 'Paga',
  perdoada: 'Perdoada',
};

type CreateStep = 1 | 2 | 3;

const CREATE_STEPS: { step: CreateStep; title: string; description: string }[] = [
  { step: 1, title: 'Leitor', description: 'Escolha o usuario' },
  { step: 2, title: 'Emprestimo', description: 'Escolha o item' },
  { step: 3, title: 'Detalhes', description: 'Informe motivo e valor' },
];

interface CreateFormState {
  id_usuario: string;
  id_item_emprestimo: string;
  motivo: MotivoMulta | '';
  valor: string;
}

const emptyCreateForm: CreateFormState = {
  id_usuario: '',
  id_item_emprestimo: '',
  motivo: '',
  valor: '',
};

export function MultasPage() {
  const { showSuccess, showError } = useToast();
  const [multas, setMultas] = useState<Multa[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [motivoFilter, setMotivoFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState<CreateStep>(1);
  const [createForm, setCreateForm] = useState<CreateFormState>(emptyCreateForm);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [itensUsuario, setItensUsuario] = useState<ItemEmprestimoMulta[]>([]);
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false);
  const [isLoadingItens, setIsLoadingItens] = useState(false);
  const [batchPayOpen, setBatchPayOpen] = useState(false);
  const [batchPayUserId, setBatchPayUserId] = useState('');
  const [paying, setPaying] = useState<Multa | null>(null);
  const [notifying, setNotifying] = useState<Multa | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const params: MultaListParams = { page, per_page: 20 };
      if (query) params.q = query;
      if (statusFilter) params.status = statusFilter;
      if (motivoFilter) params.motivo = motivoFilter;
      const response = await multasApi.list(params);
      setMultas(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel carregar multas.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, query, statusFilter, motivoFilter]);

  useEffect(() => {
    if (!createOpen) return;
    setIsLoadingUsuarios(true);
    usuariosApi.list({ per_page: 100 })
      .then((response) => setUsuarios(response.data.filter((usuario) => usuario.cargo === 'leitor')))
      .catch((error) => showError(getErrorMessage(error, 'Nao foi possivel carregar usuarios.')))
      .finally(() => setIsLoadingUsuarios(false));
  }, [createOpen, showError]);

  useEffect(() => {
    if (!createForm.id_usuario) {
      setItensUsuario([]);
      return;
    }

    setIsLoadingItens(true);
    multasApi.listItensEmprestimoUsuario(parseInt(createForm.id_usuario, 10))
      .then(setItensUsuario)
      .catch((error) => showError(getErrorMessage(error, 'Nao foi possivel carregar emprestimos do usuario.')))
      .finally(() => setIsLoadingItens(false));
  }, [createForm.id_usuario, showError]);

  const handleCreate = async () => {
    if (!createForm.id_item_emprestimo || !createForm.motivo || !createForm.valor) return;
    try {
      const payload: MultaCreate = {
        id_item_emprestimo: parseInt(createForm.id_item_emprestimo, 10),
        motivo: createForm.motivo as MotivoMulta,
        valor: parseFloat(createForm.valor),
      };
      await multasApi.create(payload);
      showSuccess('Multa registrada. Use Notificar para avisar o leitor.');
      setCreateOpen(false);
      setCreateForm(emptyCreateForm);
      setItensUsuario([]);
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel registrar multa.'));
    }
  };

  const openCreateModal = () => {
    setCreateForm(emptyCreateForm);
    setItensUsuario([]);
    setCreateStep(1);
    setCreateOpen(true);
  };

  const closeCreateModal = () => {
    setCreateOpen(false);
  };

  const canAdvanceCreate = createStep === 1
    ? !!createForm.id_usuario
    : createStep === 2
      ? !!createForm.id_item_emprestimo
      : !!createForm.motivo && !!createForm.valor;

  const selectedUsuario = usuarios.find((usuario) => String(usuario.id_usuario) === createForm.id_usuario);
  const selectedItem = itensUsuario.find((item) => String(item.id_item_emprestimo) === createForm.id_item_emprestimo);

  const handlePagar = async () => {
    if (!paying) return;
    try {
      await multasApi.pagar(paying.id_multa);
      showSuccess('Multa marcada como paga.');
      setPaying(null);
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel dar baixa na multa.'));
    }
  };

  const handleBatchPay = async () => {
    if (!batchPayUserId) return;
    try {
      const pagas = await multasApi.pagarTodas(parseInt(batchPayUserId, 10));
      showSuccess(`${pagas.length} multa(s) paga(s).`);
      setBatchPayOpen(false);
      setBatchPayUserId('');
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel pagar multas em lote.'));
    }
  };

  const handleNotificar = async () => {
    if (!notifying) return;
    try {
      await multasApi.notificar(notifying.id_multa);
      showSuccess('Leitor notificado na aplicacao.');
      setNotifying(null);
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel notificar a multa.'));
    }
  };

  const columns: DataColumn[] = [
    { key: 'usuario', label: 'Usuario', render: (_value, row: Multa) => row.usuario?.nome_completo ?? '-' },
    { key: 'livro', label: 'Livro', render: (_value, row: Multa) => row.livro?.titulo ?? '-' },
    { key: 'motivo', label: 'Motivo', render: (value: MotivoMulta) => MOTIVO_LABELS[value] ?? value },
    { key: 'valor', label: 'Valor', render: (value: string) => <Badge tone="neutral">R$ {parseFloat(value).toFixed(2)}</Badge> },
    { key: 'status', label: 'Status', render: (value: StatusMulta) => <Badge tone={STATUS_TONE[value]} dot>{STATUS_LABEL[value]}</Badge> },
    { key: 'notificado_em', label: 'Notificacao', render: (value?: string | null) => value ? formatDate(value) : '-' },
    { key: 'created_at', label: 'Data', render: (value?: string) => formatDate(value) },
    {
      key: 'acoes',
      label: 'Acoes',
      align: 'right',
      render: (_value, row: Multa) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {row.status === 'pendente' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => setPaying(row)}>Dar Baixa</Button>
              <Button size="sm" variant="ghost" icon={<Bell size={16} />} disabled={!!row.notificado_em} onClick={() => setNotifying(row)}>
                {row.notificado_em ? 'Notificada' : 'Notificar'}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const userColumns: DataColumn[] = [
    { key: 'nome_completo', label: 'Usuario' },
    { key: 'email', label: 'Email' },
    {
      key: 'acao',
      label: 'Acao',
      align: 'right',
      render: (_value, row: Usuario) => (
        <Button
          size="sm"
          variant={createForm.id_usuario === String(row.id_usuario) ? 'primary' : 'secondary'}
          onClick={() => setCreateForm({ ...createForm, id_usuario: String(row.id_usuario), id_item_emprestimo: '' })}
        >
          {createForm.id_usuario === String(row.id_usuario) ? 'Selecionado' : 'Selecionar'}
        </Button>
      ),
    },
  ];

  const itemColumns: DataColumn[] = [
    { key: 'id_item_emprestimo', label: 'Item', render: (value) => `#${value}` },
    { key: 'livro', label: 'Livro', render: (_value, row: ItemEmprestimoMulta) => row.livro?.titulo ?? '-' },
    { key: 'emprestimo', label: 'Emprestimo', render: (_value, row: ItemEmprestimoMulta) => row.emprestimo ? `#${row.emprestimo.id_emprestimo} (${row.emprestimo.status})` : '-' },
    {
      key: 'acao',
      label: 'Acao',
      align: 'right',
      render: (_value, row: ItemEmprestimoMulta) => (
        <Button
          size="sm"
          variant={createForm.id_item_emprestimo === String(row.id_item_emprestimo) ? 'primary' : 'secondary'}
          onClick={() => setCreateForm({ ...createForm, id_item_emprestimo: String(row.id_item_emprestimo) })}
        >
          {createForm.id_item_emprestimo === String(row.id_item_emprestimo) ? 'Selecionado' : 'Selecionar'}
        </Button>
      ),
    },
  ];

  const renderCreateStep = () => {
    if (createStep === 1) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>Escolha o leitor</h3>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Selecione quem recebera a multa. Depois avance para escolher o emprestimo.
            </p>
          </div>
          {isLoadingUsuarios ? <Card>Carregando usuarios...</Card> : <DataTable columns={userColumns} rows={usuarios} rowKey="id_usuario" emptyText="Nenhum leitor encontrado." style={{ maxHeight: '320px', overflowY: 'auto' }} />}
        </div>
      );
    }

    if (createStep === 2) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>Escolha o emprestimo</h3>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              {selectedUsuario ? `Leitor selecionado: ${selectedUsuario.nome_completo}` : 'Selecione um leitor antes de continuar.'}
            </p>
          </div>
          {isLoadingItens ? <Card>Carregando emprestimos...</Card> : <DataTable columns={itemColumns} rows={itensUsuario} rowKey="id_item_emprestimo" emptyText="Este leitor nao possui emprestimos." style={{ maxHeight: '320px', overflowY: 'auto' }} />}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h3 style={{ margin: '0 0 6px', fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>Revise e informe os detalhes</h3>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Confirme os dados selecionados e preencha o motivo e o valor da multa.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '14px', background: 'var(--color-surface-soft)' }}>
            <span style={{ display: 'block', color: 'var(--color-text-soft)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)', marginBottom: '6px' }}>Leitor</span>
            <strong>{selectedUsuario?.nome_completo ?? '-'}</strong>
          </div>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '14px', background: 'var(--color-surface-soft)' }}>
            <span style={{ display: 'block', color: 'var(--color-text-soft)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)', marginBottom: '6px' }}>Item</span>
            <strong>{selectedItem ? `#${selectedItem.id_item_emprestimo} - ${selectedItem.livro?.titulo ?? 'Livro'}` : '-'}</strong>
          </div>
        </div>
        <Select
          label="Motivo"
          value={createForm.motivo}
          required
          options={[{ value: 'atraso', label: 'Atraso' }, { value: 'rabisco', label: 'Rabisco' }, { value: 'rasgo', label: 'Rasgo' }, { value: 'dobra', label: 'Dobra' }]}
          onChange={(e) => setCreateForm({ ...createForm, motivo: e.target.value as MotivoMulta | '' })}
        />
        <TextInput label="Valor (R$)" type="number" value={createForm.valor} placeholder="0.00" required onChange={(e) => setCreateForm({ ...createForm, valor: e.target.value })} />
      </div>
    );
  };

  const createFooter = (
    <>
      <Button variant="ghost" onClick={closeCreateModal}>Cancelar</Button>
      {createStep > 1 && (
        <Button variant="secondary" icon={<ChevronLeft size={16} />} onClick={() => setCreateStep((createStep - 1) as CreateStep)}>
          Voltar
        </Button>
      )}
      {createStep < 3 ? (
        <Button iconRight={<ChevronRight size={16} />} onClick={() => setCreateStep((createStep + 1) as CreateStep)} disabled={!canAdvanceCreate}>
          Continuar
        </Button>
      ) : (
        <Button onClick={handleCreate} disabled={!canAdvanceCreate}>Registrar</Button>
      )}
    </>
  );

  return (
    <>
      <PageHeader
        title="Multas"
        subtitle="Registre, consulte e de baixa em multas"
        actions={(
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" icon={<DollarSign size={18} />} onClick={() => setBatchPayOpen(true)}>Pagar Todas</Button>
            <Button icon={<Plus size={18} />} onClick={openCreateModal}>Registrar Multa</Button>
          </div>
        )}
      />

      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 240px' }}>
            <SearchInput value={query} placeholder="Buscar por usuario ou livro" onChange={(e) => { setPage(1); setQuery(e.target.value); }} />
          </div>
          <div style={{ flex: '0 0 180px' }}>
            <Select
              label="Status"
              value={statusFilter}
              options={[{ value: 'pendente', label: 'Pendente' }, { value: 'paga', label: 'Paga' }]}
              placeholder="Todos"
              onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
            />
          </div>
          <div style={{ flex: '0 0 180px' }}>
            <Select
              label="Motivo"
              value={motivoFilter}
              options={[{ value: 'atraso', label: 'Atraso' }, { value: 'rabisco', label: 'Rabisco' }, { value: 'rasgo', label: 'Rasgo' }, { value: 'dobra', label: 'Dobra' }]}
              placeholder="Todos"
              onChange={(e) => { setPage(1); setMotivoFilter(e.target.value); }}
            />
          </div>
        </div>
      </Card>

      {isLoading ? <Card>Carregando multas...</Card> : <DataTable columns={columns} rows={multas} rowKey="id_multa" />}
      <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />

      <Modal open={createOpen} title="Registrar Multa" description={`Etapa ${createStep} de 3`} onClose={closeCreateModal} width={860} footer={createFooter}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            {CREATE_STEPS.map((item) => {
              const isActive = item.step === createStep;
              const isDone = item.step < createStep;

              return (
                <div
                  key={item.step}
                  style={{
                    border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '12px',
                    background: isActive ? 'var(--color-primary-50)' : 'var(--color-surface-soft)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isDone || isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: isDone || isActive ? 'var(--color-text-on-primary)' : 'var(--color-text-muted)',
                      fontWeight: 'var(--weight-bold)',
                    }}>
                      {item.step}
                    </span>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-text)' }}>{item.title}</strong>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>{item.description}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {renderCreateStep()}
        </div>
      </Modal>

      <Modal open={batchPayOpen} title="Pagar Todas as Multas" description="Pague todas as multas pendentes de um usuario." onClose={() => setBatchPayOpen(false)} width={420} footer={(
        <>
          <Button variant="ghost" onClick={() => setBatchPayOpen(false)}>Cancelar</Button>
          <Button onClick={handleBatchPay}>Pagar Todas</Button>
        </>
      )}>
        <TextInput label="ID do Usuario" type="number" value={batchPayUserId} required onChange={(e) => setBatchPayUserId(e.target.value)} />
      </Modal>

      <Modal open={!!paying} title="Dar Baixa em Multa" onClose={() => setPaying(null)} width={420} footer={(
        <>
          <Button variant="ghost" onClick={() => setPaying(null)}>Cancelar</Button>
          <Button onClick={handlePagar}>Confirmar Pagamento</Button>
        </>
      )}>
        {paying && <p>Confirma dar baixa na multa de <strong>R$ {parseFloat(paying.valor).toFixed(2)}</strong> ({MOTIVO_LABELS[paying.motivo]}) de <strong>{paying.usuario?.nome_completo ?? 'usuario'}</strong>?</p>}
      </Modal>

      <Modal open={!!notifying} title="Notificar Leitor" description="A notificacao sera exibida somente dentro da aplicacao, no perfil do leitor." onClose={() => setNotifying(null)} width={460} footer={(
        <>
          <Button variant="ghost" onClick={() => setNotifying(null)}>Cancelar</Button>
          <Button icon={<Bell size={18} />} onClick={handleNotificar}>Notificar</Button>
        </>
      )}>
        {notifying && <p>Confirma notificar <strong>{notifying.usuario?.nome_completo ?? 'usuario'}</strong> sobre a multa de <strong>R$ {parseFloat(notifying.valor).toFixed(2)}</strong> ({MOTIVO_LABELS[notifying.motivo]})?</p>}
      </Modal>
    </>
  );
}
