import { type ReactNode, type CSSProperties } from 'react';

const TONES = {
  success: { fg: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  danger:  { fg: 'var(--color-danger)', bg: 'var(--color-danger-bg)' },
  warning: { fg: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  info:    { fg: 'var(--color-info)', bg: 'var(--color-info-bg)' },
};

const ICONS: Record<string, ReactNode> = {
  success: <path d="M20 6 9 17l-5-5" />,
  danger: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
  warning: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
};

export interface ToastProps {
  tone?: 'success' | 'danger' | 'warning' | 'info';
  title?: ReactNode;
  message?: ReactNode;
  onClose?: () => void;
  style?: CSSProperties;
}

/** Toast notification — short feedback message with semantic icon. */
export function Toast({ tone = 'success', title, message, onClose, style = {} }: ToastProps) {
  const t = TONES[tone] || TONES.success;
  return (
    <div role="status" style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      minWidth: '300px', maxWidth: '420px',
      padding: '14px 16px',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      ...style,
    }}>
      <span style={{
        width: '32px', height: '32px', flexShrink: 0, borderRadius: 'var(--radius-md)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: t.bg, color: t.fg,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{ICONS[tone]}</svg>
      </span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>{title}</div>}
        {message && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: title ? '2px' : 0 }}>{message}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Fechar" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-soft)', padding: '2px', display: 'inline-flex' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </div>
  );
}
