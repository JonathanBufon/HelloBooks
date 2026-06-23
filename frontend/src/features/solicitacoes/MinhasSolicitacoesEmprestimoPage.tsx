import { useEffect, useState } from 'react';
import { BookMarked } from 'lucide-react';
import * as minhasSolicitacoesApi from '../../api/minhas-solicitacoes-emprestimo';
import { Button } from '../../components/ds/actions/Button';
import { PaginationControls } from '../../components/common/PaginationControls';
import { Badge } from '../../components/ds/data/Badge';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Select } from '../../components/ds/forms/Select';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { Pagination } from '../../types/api';
import type { SolicitacaoEmprestimo, StatusSolicitacaoEmprestimo } from '../../types/solicitacao-emprestimo';
import { formatDate, getErrorMessage } from '../../utils/format';
import { STATUS_SOLICITACAO_LABEL, STATUS_SOLICITACAO_TONE } from './solicitacaoLabels';

export function MinhasSolicitacoesEmprestimoPage() {
  const { showSuccess, showError } = useToast();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoEmprestimo[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await minhasSolicitacoesApi.list({
        page,
        per_page: 20,
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      setSolicitacoes(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel carregar suas solicitacoes.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, statusFilter]);

  const cancelar = async (solicitacao: SolicitacaoEmprestimo) => {
    try {
      await minhasSolicitacoesApi.cancelar(solicitacao.id_solicitacao_emprestimo);
      showSuccess('Solicitacao cancelada.');
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel cancelar a solicitacao.'));
    }
  };

  const pendentes = solicitacoes.filter((solicitacao) => solicitacao.status === 'pendente').length;
  const columns: DataColumn[] = [
    {
      key: 'livro',
      label: 'Livro',
      render: (_value, row: SolicitacaoEmprestimo) => row.livro?.titulo ?? '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: StatusSolicitacaoEmprestimo) => (
        <Badge tone={STATUS_SOLICITACAO_TONE[value]} dot>{STATUS_SOLICITACAO_LABEL[value]}</Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Solicitada em',
      render: (value?: string) => formatDate(value),
    },
    {
      key: 'data_decisao',
      label: 'Decisao',
      render: (value?: string | null) => formatDate(value),
    },
    {
      key: 'emprestimo',
      label: 'Emprestimo',
      render: (_value, row: SolicitacaoEmprestimo) => row.emprestimo ? `#${row.emprestimo.id_emprestimo}` : '-',
    },
    {
      key: 'acoes',
      label: 'Acoes',
      align: 'right',
      render: (_value, row: SolicitacaoEmprestimo) => row.status === 'pendente' ? (
        <Button size="sm" variant="ghost" onClick={() => void cancelar(row)}>Cancelar</Button>
      ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Minhas Solicitacoes"
        subtitle="Acompanhe pedidos de emprestimo enviados ao bibliotecario"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 360px) 1fr', gap: '16px', marginBottom: 'var(--section-gap)' }}>
        <Card style={{ borderColor: 'var(--color-primary-300)', background: 'var(--color-primary-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-primary)' }}>
            <BookMarked size={24} />
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase' }}>
                Pendentes
              </div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--color-text)' }}>
                {pendentes}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                aguardando atendimento
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <strong>Como funciona</strong>
          <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>
            Solicite um livro pelo catalogo. Se aprovado, o bibliotecario cria o emprestimo e separa um exemplar disponivel.
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
              { value: 'aprovada', label: 'Aprovada' },
              { value: 'recusada', label: 'Recusada' },
              { value: 'cancelada', label: 'Cancelada' },
            ]}
            placeholder="Todos"
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
          />
        </div>
      </Card>

      {isLoading ? (
        <Card>Carregando solicitacoes...</Card>
      ) : (
        <DataTable
          columns={columns}
          rows={solicitacoes}
          rowKey="id_solicitacao_emprestimo"
          emptyText="Voce ainda nao possui solicitacoes."
        />
      )}
      <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />
    </>
  );
}
