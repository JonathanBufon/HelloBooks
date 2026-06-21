import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMultasPendentes } from '../../hooks/useMultasPendentes';

export function NotificationBadge() {
  const { quantidade } = useMultasPendentes();
  const navigate = useNavigate();

  if (quantidade <= 0) return null;

  return (
    <button
      onClick={() => navigate('/minhas-multas')}
      title="Pagamento presencial com bibliotecario"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        border: 'none',
        background: 'transparent',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--color-text-soft)',
      }}
    >
      <Bell size={20} />
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
    </button>
  );
}
