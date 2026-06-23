import { useEffect, useState } from 'react';
import * as logsApi from '../../api/logs';
import { PaginationControls } from '../../components/common/PaginationControls';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { Select } from '../../components/ds/forms/Select';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { AcaoRealizada, LogEntry, Pagination } from '../../types/api';
import { formatDateTime, getErrorMessage, STATUS_LABELS } from '../../utils/format';

export function LogsPage() {
  const { showError } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [page, setPage] = useState(1);
  const [entidade, setEntidade] = useState('');
  const [acao, setAcao] = useState<AcaoRealizada | ''>('');
  const [usuario, setUsuario] = useState('');
  const [de, setDe] = useState('');
  const [ate, setAte] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    logsApi.list({
      page,
      per_page: 10,
      entidade: entidade || undefined,
      acao: acao || undefined,
      id_usuario: usuario ? Number(usuario) : undefined,
      de: de || undefined,
      ate: ate || undefined,
    })
      .then((response) => {
        setLogs(response.data);
        setPagination(response.pagination);
      })
      .catch((error) => showError(getErrorMessage(error, 'Nao foi possivel carregar logs.')))
      .finally(() => setIsLoading(false));
  }, [page, entidade, acao, usuario, de, ate, showError]);

  const columns: DataColumn[] = [
    { key: 'data_hora', label: 'Data/Hora', render: (value?: string) => formatDateTime(value) },
    { key: 'usuario', label: 'Usuario', render: (_value, row: LogEntry) => row.usuario?.nome_completo ?? '-' },
    { key: 'acao_realizada', label: 'Acao', render: (value: AcaoRealizada) => STATUS_LABELS[value] },
    { key: 'entidade_afetada', label: 'Entidade' },
    { key: 'id_registro_afetado', label: 'ID Registro' },
  ];

  return (
    <>
      <PageHeader title="Auditoria" subtitle="Logs de atividade do sistema" />

      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px' }}>
          <Select
            label="Entidade"
            value={entidade}
            placeholder="Todas"
            options={['livros', 'exemplares', 'autores', 'editoras', 'categorias', 'usuarios']}
            onChange={(event) => { setPage(1); setEntidade(event.target.value); }}
          />
          <Select
            label="Acao"
            value={acao}
            placeholder="Todas"
            options={[{ value: 'created', label: 'Criado' }, { value: 'updated', label: 'Atualizado' }, { value: 'deleted', label: 'Removido' }]}
            onChange={(event) => { setPage(1); setAcao(event.target.value as AcaoRealizada | ''); }}
          />
          <TextInput label="Usuario ID" value={usuario} placeholder="ID" onChange={(event) => { setPage(1); setUsuario(event.target.value); }} />
          <TextInput label="De" type="date" value={de} onChange={(event) => { setPage(1); setDe(event.target.value); }} />
          <TextInput label="Ate" type="date" value={ate} onChange={(event) => { setPage(1); setAte(event.target.value); }} />
        </div>
      </Card>

      {isLoading ? <Card>Carregando logs...</Card> : <DataTable columns={columns} rows={logs} rowKey="id_log" emptyText="Nenhum log encontrado." />}
      <PaginationControls pagination={pagination} page={page} onPageChange={setPage} />
    </>
  );
}
