import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import * as minhasMultasApi from '../../api/minhas-multas';
import { PaginationControls } from '../../components/common/PaginationControls';
import { Badge } from '../../components/ds/data/Badge';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Select } from '../../components/ds/forms/Select';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { Pagination } from '../../types/api';
import type { Multa, MultaResumo, MotivoMulta, StatusMulta } from '../../types/multa';
import { formatDate, formatDateTime, getErrorMessage } from '../../utils/format';

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

const emptyResumo: MultaResumo = {
  quantidade_pendente: 0,
  valor_total_pendente: '0.00',
};

export function MinhasMultasPage() {
  const { showError } = useToast();
  const [multas, setMultas] = useState<Multa[]>([]);
  const [resumo, setResumo] = useState<MultaResumo>(emptyResumo);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await minhasMultasApi.list({
        page,
        per_page: 20,
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      setMultas(response.data);
      setPagination(response.pagination);
      setResumo(response.resumo);
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel carregar suas multas.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, statusFilter]);

  const columns: DataColumn[] = [
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
      render: (value: string) => <Badge tone="neutral">R$ {parseFloat(value).toFixed(2)}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: StatusMulta) => <Badge tone={STATUS_TONE[value]} dot>{STATUS_LABEL[value]}</Badge>,
    },
    {
      key: 'created_at',
      label: 'Registro',
      render: (value?: string) => formatDate(value),
    },
    {
      key: 'data_baixa',
      label: 'Data Baixa',
      render: (value?: string | null) => formatDateTime(value),
    },
  ];

  return (
    <>
      <PageHeader
        title="Minhas Multas"
        subtitle="Consulte as multas notificadas pelo bibliotecario"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 360px) 1fr', gap: '16px', marginBottom: 'var(--section-gap)' }}>
        <Card style={{ borderColor: 'var(--color-warning)', background: 'var(--color-warning-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-warning)' }}>
            <AlertCircle size={24} />
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase' }}>
                Total pendente
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--color-text)' }}>
                R$ {parseFloat(resumo.valor_total_pendente).toFixed(2)}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {resumo.quantidade_pendente} multa(s) pendente(s)
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <strong>Pagamento presencial</strong>
          <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>
            Para quitar uma multa pendente, procure o bibliotecario no balcao. Esta tela e somente leitura.
          </p>
        </Card>
      </div>

      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ maxWidth: 220 }}>
          <Select
            label="Status"
            value={statusFilter}
            options={[
              { value: 'pendente', label: 'Pendente' },
              { value: 'paga', label: 'Paga' },
              ]}
            placeholder="Todos"
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
          />
        </div>
      </Card>

      {isLoading ? (
        <Card>Carregando multas...</Card>
      ) : (
        <DataTable
          columns={columns}
          rows={multas}
          rowKey="id_multa"
          emptyText="Voce ainda nao possui multas."
        />
      )}
      <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />
    </>
  );
}
