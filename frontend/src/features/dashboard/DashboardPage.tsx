import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Plus,
  RefreshCw,
  Search,
  Users,
  Wrench,
} from 'lucide-react';
import { getStats } from '../../api/dashboard';
import { Button } from '../../components/ds/actions/Button';
import { MetricCard } from '../../components/ds/data/MetricCard';
import { BookCover } from '../../components/ds/library/BookCover';
import { Card, CardHeader } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { DashboardStats, LogEntry } from '../../types/api';

const numberFormatter = new Intl.NumberFormat('pt-BR');
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const actionLabels: Record<LogEntry['acao_realizada'], string> = {
  created: 'Criado',
  updated: 'Atualizado',
  deleted: 'Removido',
};

function formatNumber(value?: number) {
  return numberFormatter.format(value ?? 0);
}

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return dateFormatter.format(date);
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div style={{
      border: '1px dashed var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      color: 'var(--color-text-muted)',
      fontSize: 'var(--text-sm)',
      textAlign: 'center',
      background: 'var(--color-surface-soft)',
    }}>
      {children}
    </div>
  );
}

function ActivityIcon({ action }: { action: LogEntry['acao_realizada'] }) {
  const tone = action === 'deleted'
    ? { bg: 'var(--color-danger-bg)', fg: 'var(--color-danger)' }
    : action === 'updated'
      ? { bg: 'var(--color-info-bg)', fg: 'var(--color-info)' }
      : { bg: 'var(--color-success-bg)', fg: 'var(--color-success)' };

  return (
    <span style={{
      width: 38,
      height: 38,
      flexShrink: 0,
      borderRadius: '10px',
      background: tone.bg,
      color: tone.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Activity size={18} />
    </span>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getStats();
      setStats(data);
    } catch {
      setError('Nao foi possivel carregar os dados do dashboard.');
      showError('Nao foi possivel carregar os dados do dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadStats();
  }, []);

  const metricValue = (value?: number) => isLoading ? '...' : formatNumber(value);
  const recentes = stats?.livros_recentes.slice(0, 5) ?? [];
  const atividades = stats?.atividade_recente.slice(0, 10) ?? [];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Situacao operacional da biblioteca"
        actions={(
          <Button icon={<Plus size={18} />} onClick={() => navigate('/catalogo/novo')}>
            Cadastrar Livro
          </Button>
        )}
      />

      {error && (
        <Card padding="18px" elevation="sm" style={{ marginBottom: 'var(--section-gap)', borderColor: 'var(--color-danger-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-danger)' }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>{error}</span>
            </div>
            <Button variant="secondary" size="sm" icon={<RefreshCw size={16} />} onClick={loadStats}>
              Tentar novamente
            </Button>
          </div>
        </Card>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '18px',
        marginBottom: 'var(--section-gap)',
      }}>
        <MetricCard
          icon={<BookOpen size={22} />}
          label="Total de Livros"
          value={metricValue(stats?.total_livros)}
        />
        <MetricCard
          icon={<CheckCircle size={22} />}
          label="Exemplares Disponiveis"
          value={metricValue(stats?.exemplares_por_status.disponivel)}
          tone="success"
        />
        <MetricCard
          icon={<Users size={22} />}
          label="Exemplares Emprestados"
          value={metricValue(stats?.exemplares_por_status.emprestado)}
          tone="info"
        />
        <MetricCard
          icon={<Wrench size={22} />}
          label="Exemplares em Manutencao"
          value={metricValue(stats?.exemplares_por_status.manutencao)}
          tone="warning"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '18px' }}>
        <Card style={{ minHeight: 310 }}>
          <CardHeader
            title="Novas Aquisicoes"
            subtitle="Ultimos livros cadastrados no acervo"
            action={(
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={16} />} onClick={() => navigate('/catalogo')}>
                Ver acervo
              </Button>
            )}
          />

          {isLoading ? (
            <EmptyState>Carregando aquisicoes...</EmptyState>
          ) : recentes.length === 0 ? (
            <EmptyState>Nenhum livro cadastrado ainda.</EmptyState>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '16px' }}>
              {recentes.map((livro) => {
                const autores = livro.autores.join(', ');
                return (
                  <button
                    key={livro.id_livro}
                    type="button"
                    onClick={() => navigate(`/catalogo/${livro.id_livro}`)}
                    style={{
                      border: 0,
                      background: 'transparent',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <BookCover title={livro.titulo} author={autores} width={72} />
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--weight-bold)',
                      color: 'var(--color-text)',
                      lineHeight: 1.25,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {livro.titulo}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-soft)' }}>
                      {autores || '-'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card style={{ minHeight: 310 }}>
          <CardHeader title="Acoes Rapidas" subtitle="Atalhos para operacoes frequentes" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Cadastrar Livro', icon: <Plus size={20} />, path: '/catalogo/novo' },
              { label: 'Buscar no Catalogo', icon: <Search size={20} />, path: '/catalogo' },
              { label: 'Gerenciar Autores', icon: <Users size={20} />, path: '/autores' },
              { label: 'Ver Auditoria', icon: <ClipboardList size={20} />, path: '/auditoria' },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate(action.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'flex-start',
                  padding: '16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-surface-soft)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: 'var(--color-primary-100)',
                  color: 'var(--color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {action.icon}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: '18px' }}>
        <CardHeader
          title="Atividade Recente"
          subtitle="Ultimas acoes registradas no sistema"
          action={(
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={16} />} onClick={() => navigate('/auditoria')}>
              Ver tudo
            </Button>
          )}
        />

        {isLoading ? (
          <EmptyState>Carregando atividade recente...</EmptyState>
        ) : atividades.length === 0 ? (
          <EmptyState>Nenhuma atividade registrada ainda.</EmptyState>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '24px' }}>
            {atividades.map((log, index) => (
              <div
                key={log.id_log}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 0',
                  borderTop: index > 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <ActivityIcon action={log.acao_realizada} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
                    {actionLabels[log.acao_realizada]} em {log.entidade_afetada}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {log.usuario?.nome_completo ?? 'Usuario nao informado'} · Registro {log.id_registro_afetado}
                  </div>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-soft)', whiteSpace: 'nowrap' }}>
                  {formatDate(log.data_hora)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
