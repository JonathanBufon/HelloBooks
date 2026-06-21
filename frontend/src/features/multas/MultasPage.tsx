import { useEffect, useState } from 'react';
import { Plus, DollarSign, ShieldCheck } from 'lucide-react';
import * as multasApi from '../../api/multas';
import type { MultaListParams } from '../../api/multas';
import { Button } from '../../components/ds/actions/Button';
import { PaginationControls } from '../../components/common/PaginationControls';
import { Badge } from '../../components/ds/data/Badge';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Modal } from '../../components/ds/feedback/Modal';
import { SearchInput } from '../../components/ds/forms/SearchInput';
import { Select } from '../../components/ds/forms/Select';
import { Textarea } from '../../components/ds/forms/Textarea';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { Pagination } from '../../types/api';
import type { Multa, MultaCreate, MotivoMulta, StatusMulta } from '../../types/multa';
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

interface CreateFormState {
  id_item_emprestimo: string;
  motivo: MotivoMulta | '';
  valor: string;
}

const emptyCreateForm: CreateFormState = {
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

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(emptyCreateForm);

  // Batch pay modal
  const [batchPayOpen, setBatchPayOpen] = useState(false);
  const [batchPayUserId, setBatchPayUserId] = useState('');

  // Pay confirm
  const [paying, setPaying] = useState<Multa | null>(null);

  // Forgive modal
  const [forgiving, setForgiving] = useState<Multa | null>(null);
  const [justificativa, setJustificativa] = useState('');

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

  const handleCreate = async () => {
    if (!createForm.id_item_emprestimo || !createForm.motivo || !createForm.valor) return;
    try {
      const payload: MultaCreate = {
        id_item_emprestimo: parseInt(createForm.id_item_emprestimo, 10),
        motivo: createForm.motivo as MotivoMulta,
        valor: parseFloat(createForm.valor),
      };
      await multasApi.create(payload);
      showSuccess('Multa registrada.');
      setCreateOpen(false);
      setCreateForm(emptyCreateForm);
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel registrar multa.'));
    }
  };

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

  const handlePerdoar = async () => {
    if (!forgiving || !justificativa.trim()) return;
    try {
      await multasApi.perdoar(forgiving.id_multa, justificativa.trim());
      showSuccess('Multa perdoada.');
      setForgiving(null);
      setJustificativa('');
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel perdoar a multa.'));
    }
  };

  const columns: DataColumn[] = [
    {
      key: 'usuario',
      label: 'Usuario',
      render: (_value, row: Multa) => row.usuario?.nome_completo ?? '-',
    },
    {
      key: 'livro',
      label: 'Livro',
      render: (_value, row: Multa) => row.livro?.titulo ?? '-',
    },
    {
      key: 'motivo',
      label: 'Motivo',
      render: (value: MotivoMulta) => MOTIVO_LABELS[value] ?? value,
    },
    {
      key: 'valor',
      label: 'Valor',
      render: (value: string) => (
        <Badge tone="neutral">R$ {parseFloat(value).toFixed(2)}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: StatusMulta) => (
        <Badge tone={STATUS_TONE[value]} dot>{STATUS_LABEL[value]}</Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Data',
      render: (value?: string) => formatDate(value),
    },
    {
      key: 'acoes',
      label: 'Acoes',
      align: 'right',
      render: (_value, row: Multa) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {row.status === 'pendente' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => setPaying(row)}>
                Dar Baixa
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={<ShieldCheck size={16} />}
                onClick={() => { setForgiving(row); setJustificativa(''); }}
              >
                Perdoar
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Multas"
        subtitle="Registre, consulte e de baixa em multas"
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" icon={<DollarSign size={18} />} onClick={() => setBatchPayOpen(true)}>
              Pagar Todas
            </Button>
            <Button icon={<Plus size={18} />} onClick={() => { setCreateForm(emptyCreateForm); setCreateOpen(true); }}>
              Registrar Multa
            </Button>
          </div>
        }
      />

      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 240px' }}>
            <SearchInput
              value={query}
              placeholder="Buscar por usuario ou livro"
              onChange={(e) => { setPage(1); setQuery(e.target.value); }}
            />
          </div>
          <div style={{ flex: '0 0 180px' }}>
            <Select
              label="Status"
              value={statusFilter}
              options={[
                { value: 'pendente', label: 'Pendente' },
                { value: 'paga', label: 'Paga' },
                { value: 'perdoada', label: 'Perdoada' },
              ]}
              placeholder="Todos"
              onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
            />
          </div>
          <div style={{ flex: '0 0 180px' }}>
            <Select
              label="Motivo"
              value={motivoFilter}
              options={[
                { value: 'atraso', label: 'Atraso' },
                { value: 'rabisco', label: 'Rabisco' },
                { value: 'rasgo', label: 'Rasgo' },
                { value: 'dobra', label: 'Dobra' },
              ]}
              placeholder="Todos"
              onChange={(e) => { setPage(1); setMotivoFilter(e.target.value); }}
            />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card>Carregando multas...</Card>
      ) : (
        <DataTable columns={columns} rows={multas} rowKey="id_multa" />
      )}
      <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />

      {/* Register modal */}
      <Modal
        open={createOpen}
        title="Registrar Multa"
        onClose={() => setCreateOpen(false)}
        width={480}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate}>Registrar</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <TextInput
            label="ID Item Emprestimo"
            type="number"
            value={createForm.id_item_emprestimo}
            required
            onChange={(e) => setCreateForm({ ...createForm, id_item_emprestimo: e.target.value })}
          />
          <Select
            label="Motivo"
            value={createForm.motivo}
            required
            options={[
              { value: 'atraso', label: 'Atraso' },
              { value: 'rabisco', label: 'Rabisco' },
              { value: 'rasgo', label: 'Rasgo' },
              { value: 'dobra', label: 'Dobra' },
            ]}
            onChange={(e) => setCreateForm({ ...createForm, motivo: e.target.value as MotivoMulta | '' })}
          />
          <TextInput
            label="Valor (R$)"
            type="number"
            value={createForm.valor}
            placeholder="0.00"
            required
            onChange={(e) => setCreateForm({ ...createForm, valor: e.target.value })}
          />
        </div>
      </Modal>

      {/* Batch pay modal */}
      <Modal
        open={batchPayOpen}
        title="Pagar Todas as Multas"
        description="Pague todas as multas pendentes de um usuario."
        onClose={() => setBatchPayOpen(false)}
        width={420}
        footer={
          <>
            <Button variant="ghost" onClick={() => setBatchPayOpen(false)}>Cancelar</Button>
            <Button onClick={handleBatchPay}>Pagar Todas</Button>
          </>
        }
      >
        <TextInput
          label="ID do Usuario"
          type="number"
          value={batchPayUserId}
          required
          onChange={(e) => setBatchPayUserId(e.target.value)}
        />
      </Modal>

      {/* Pay confirm modal */}
      <Modal
        open={!!paying}
        title="Dar Baixa em Multa"
        onClose={() => setPaying(null)}
        width={420}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPaying(null)}>Cancelar</Button>
            <Button onClick={handlePagar}>Confirmar Pagamento</Button>
          </>
        }
      >
        {paying && (
          <p>
            Confirma dar baixa na multa de <strong>R$ {parseFloat(paying.valor).toFixed(2)}</strong>
            {' '}({MOTIVO_LABELS[paying.motivo]}) de <strong>{paying.usuario?.nome_completo ?? 'usuario'}</strong>?
          </p>
        )}
      </Modal>

      {/* Forgive modal */}
      <Modal
        open={!!forgiving}
        title="Perdoar Multa"
        description="Informe a justificativa administrativa obrigatoria."
        onClose={() => { setForgiving(null); setJustificativa(''); }}
        width={520}
        footer={
          <>
            <Button variant="ghost" onClick={() => { setForgiving(null); setJustificativa(''); }}>Cancelar</Button>
            <Button onClick={handlePerdoar} disabled={!justificativa.trim()}>Confirmar Perdao</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {forgiving && (
            <p style={{ margin: 0 }}>
              Confirma perdoar a multa de <strong>R$ {parseFloat(forgiving.valor).toFixed(2)}</strong>
              {' '}({MOTIVO_LABELS[forgiving.motivo]}) de <strong>{forgiving.usuario?.nome_completo ?? 'usuario'}</strong>?
            </p>
          )}
          <Textarea
            label="Justificativa"
            value={justificativa}
            required
            rows={5}
            maxLength={1000}
            placeholder="Ex.: Isencao por primeiro incidente do leitor"
            onChange={(e) => setJustificativa(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
