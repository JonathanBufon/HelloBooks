import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import * as solicitacoesApi from '../../api/solicitacoes-emprestimo';
import type { SolicitacoesEmprestimoListParams } from '../../api/solicitacoes-emprestimo';
import { Button } from '../../components/ds/actions/Button';
import { PaginationControls } from '../../components/common/PaginationControls';
import { Badge } from '../../components/ds/data/Badge';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Modal } from '../../components/ds/feedback/Modal';
import { SearchInput } from '../../components/ds/forms/SearchInput';
import { Select } from '../../components/ds/forms/Select';
import { Textarea } from '../../components/ds/forms/Textarea';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { Pagination } from '../../types/api';
import type { SolicitacaoEmprestimo, StatusSolicitacaoEmprestimo } from '../../types/solicitacao-emprestimo';
import { formatDate, getErrorMessage } from '../../utils/format';
import { STATUS_SOLICITACAO_LABEL, STATUS_SOLICITACAO_TONE } from './solicitacaoLabels';

export function SolicitacoesEmprestimoPage() {
  const { showSuccess, showError } = useToast();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoEmprestimo[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pendente');
  const [isLoading, setIsLoading] = useState(true);
  const [approving, setApproving] = useState<SolicitacaoEmprestimo | null>(null);
  const [refusing, setRefusing] = useState<SolicitacaoEmprestimo | null>(null);
  const [justificativa, setJustificativa] = useState('');

  const load = async () => {
    setIsLoading(true);
    try {
      const params: SolicitacoesEmprestimoListParams = { page, per_page: 20 };
      if (query) params.q = query;
      if (statusFilter) params.status = statusFilter;
      const response = await solicitacoesApi.list(params);
      setSolicitacoes(response.data);
      setPagination(response.pagination);
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel carregar solicitacoes.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, query, statusFilter]);

  const handleAprovar = async () => {
    if (!approving) return;
    try {
      await solicitacoesApi.aprovar(approving.id_solicitacao_emprestimo);
      showSuccess('Solicitacao aprovada e emprestimo criado.');
      setApproving(null);
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel aprovar a solicitacao.'));
    }
  };

  const handleRecusar = async () => {
    if (!refusing || !justificativa.trim()) return;
    try {
      await solicitacoesApi.recusar(refusing.id_solicitacao_emprestimo, justificativa.trim());
      showSuccess('Solicitacao recusada.');
      setRefusing(null);
      setJustificativa('');
      await load();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel recusar a solicitacao.'));
    }
  };

  const columns: DataColumn[] = [
    {
      key: 'usuario',
      label: 'Leitor',
      render: (_value, row: SolicitacaoEmprestimo) => row.usuario?.nome_completo ?? '-',
    },
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
      key: 'acoes',
      label: 'Acoes',
      align: 'right',
      render: (_value, row: SolicitacaoEmprestimo) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {row.status === 'pendente' && (
            <>
              <Button size="sm" variant="secondary" icon={<CheckCircle size={16} />} onClick={() => setApproving(row)}>
                Aprovar
              </Button>
              <Button size="sm" variant="danger" icon={<XCircle size={16} />} onClick={() => { setRefusing(row); setJustificativa(''); }}>
                Recusar
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
        title="Solicitacoes de Emprestimo"
        subtitle="Aprove ou recuse pedidos enviados pelos leitores"
      />

      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 260px' }}>
            <SearchInput
              value={query}
              placeholder="Buscar por leitor ou livro"
              onChange={(e) => { setPage(1); setQuery(e.target.value); }}
            />
          </div>
          <div style={{ flex: '0 0 200px' }}>
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
        </div>
      </Card>

      {isLoading ? (
        <Card>Carregando solicitacoes...</Card>
      ) : (
        <DataTable
          columns={columns}
          rows={solicitacoes}
          rowKey="id_solicitacao_emprestimo"
          emptyText="Nenhuma solicitacao encontrada."
        />
      )}
      <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />

      <Modal
        open={!!approving}
        title="Aprovar Solicitacao"
        description="Um emprestimo ativo sera criado com devolucao prevista em 14 dias."
        onClose={() => setApproving(null)}
        width={460}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setApproving(null)}>Cancelar</Button>
            <Button onClick={handleAprovar}>Aprovar</Button>
          </>
        )}
      >
        {approving && (
          <p style={{ margin: 0 }}>
            Confirma aprovar <strong>{approving.livro?.titulo ?? 'este livro'}</strong> para <strong>{approving.usuario?.nome_completo ?? 'este leitor'}</strong>?
          </p>
        )}
      </Modal>

      <Modal
        open={!!refusing}
        title="Recusar Solicitacao"
        description="Informe a justificativa que sera exibida ao leitor."
        onClose={() => { setRefusing(null); setJustificativa(''); }}
        width={520}
        footer={(
          <>
            <Button variant="ghost" onClick={() => { setRefusing(null); setJustificativa(''); }}>Cancelar</Button>
            <Button variant="danger" onClick={handleRecusar} disabled={!justificativa.trim()}>Recusar</Button>
          </>
        )}
      >
        <Textarea
          label="Justificativa"
          value={justificativa}
          required
          rows={5}
          maxLength={1000}
          placeholder="Ex.: Sem disponibilidade para retirada nesta semana"
          onChange={(e) => setJustificativa(e.target.value)}
        />
      </Modal>
    </>
  );
}
