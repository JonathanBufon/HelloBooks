import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Bell, Receipt, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as minhasNotificacoesApi from '../../api/minhas-notificacoes';
import { Button } from '../ds/actions/Button';
import { Badge } from '../ds/data/Badge';
import { useMultasPendentes } from '../../hooks/useMultasPendentes';
import { useToast } from '../../hooks/useToast';
import type { MotivoMulta, Multa } from '../../types/multa';
import { formatDateTime, getErrorMessage } from '../../utils/format';

const MOTIVO_LABELS: Record<MotivoMulta, string> = {
  atraso: 'Atraso',
  rabisco: 'Rabisco',
  rasgo: 'Rasgo',
  dobra: 'Dobra',
};

export function NotificationBadge() {
  const { quantidade, refetch } = useMultasPendentes();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [open, setOpen] = useState(false);
  const [multas, setMultas] = useState<Multa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const openedWithItemsRef = useRef(false);

  const closeAndMarkRead = async () => {
    setOpen(false);
    if (!openedWithItemsRef.current) return;

    openedWithItemsRef.current = false;
    try {
      await minhasNotificacoesApi.marcarLidas();
      setMultas([]);
      await refetch();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel marcar notificacoes como lidas.'));
    }
  };

  useEffect(() => {
    if (!open) return;

    setIsLoading(true);
    minhasNotificacoesApi.list()
      .then((data) => {
        setMultas(data);
        openedWithItemsRef.current = data.length > 0;
      })
      .catch((error) => showError(getErrorMessage(error, 'Nao foi possivel carregar notificacoes.')))
      .finally(() => setIsLoading(false));
  }, [open, showError]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      void closeAndMarkRead();
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        onClick={() => {
          if (open) void closeAndMarkRead();
          else setOpen(true);
        }}
        title="Notificacoes"
        aria-expanded={open}
        aria-label={open ? 'Fechar notificacoes' : 'Abrir notificacoes'}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          border: 'none',
          background: open ? 'var(--color-primary-50)' : 'transparent',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          color: open ? 'var(--color-primary)' : 'var(--color-text-soft)',
        }}
      >
        <Bell size={20} />
        {quantidade > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              minWidth: '18px',
              height: '18px',
              padding: '0 5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              lineHeight: 1,
              color: '#fff',
              background: 'var(--color-danger)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {quantidade > 99 ? '99+' : quantidade}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Notificacoes"
          style={{
            position: 'fixed',
            top: 74,
            right: 24,
            zIndex: 1000,
            width: 'min(420px, calc(100vw - 32px))',
            maxHeight: 'calc(100vh - 96px)',
            overflow: 'auto',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-lg)',
            padding: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
                Notificacoes
              </h2>
              <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                Avisos recebidos dentro da aplicacao.
              </p>
            </div>
            <button
              onClick={() => { void closeAndMarkRead(); }}
              aria-label="Fechar notificacoes"
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-soft)', padding: 2, display: 'inline-flex' }}
            >
              <X size={20} />
            </button>
          </div>

          {isLoading ? (
            <div style={{ padding: '28px', color: 'var(--color-text-muted)', textAlign: 'center' }}>Carregando notificacoes...</div>
          ) : multas.length === 0 ? (
            <div style={{ padding: '28px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              <Bell size={30} style={{ marginBottom: 10 }} />
              <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>Nenhuma notificacao pendente</div>
              <p style={{ margin: '8px 0 0' }}>Novos avisos aparecerao aqui.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {multas.map((multa) => (
                <div key={multa.id_multa} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ color: 'var(--color-warning)', paddingTop: 2 }}><AlertCircle size={20} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                        <strong>Multa pendente</strong>
                        <Badge tone="warning" dot>Notificacao</Badge>
                      </div>
                      <p style={{ margin: '8px 0 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                        Multa de <strong>R$ {parseFloat(multa.valor).toFixed(2)}</strong> por{' '}
                        <strong>{MOTIVO_LABELS[multa.motivo]}</strong>
                        {multa.livro?.titulo ? <> em <strong>{multa.livro.titulo}</strong></> : null}.
                      </p>
                      <div style={{ marginTop: '8px', fontSize: 'var(--text-xs)', color: 'var(--color-text-soft)' }}>
                        Recebida em {formatDateTime(multa.notificado_em ?? multa.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
            <Button variant="ghost" onClick={() => { void closeAndMarkRead(); }}>Fechar</Button>
            <Button variant="secondary" icon={<Receipt size={16} />} onClick={() => { void closeAndMarkRead(); navigate('/minhas-multas'); }}>
              Ver Multas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
