import { type ReactNode, type MouseEvent } from 'react';

export interface ModalProps {
  open?: boolean;
  title: ReactNode;
  /** Short description below the title. */
  description?: ReactNode;
  children?: ReactNode;
  /** Footer actions slot (buttons). */
  footer?: ReactNode;
  onClose?: () => void;
  width?: number;
  /** Red title for destructive confirmations. */
  danger?: boolean;
}

/** Centered modal dialog with title, body and footer actions. */
export function Modal({ open = true, title, description, children, footer, onClose, width = 520, danger = false }: ModalProps) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(17, 24, 39, 0.4)',
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}>
      <div
        onClick={(e: MouseEvent) => e.stopPropagation()}
        role="dialog" aria-modal="true"
        style={{
          width: '100%', maxWidth: width,
          maxHeight: 'calc(100vh - 48px)',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: description ? '8px' : '20px' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: danger ? 'var(--color-danger)' : 'var(--color-text)' }}>{title}</h2>
          {onClose && (
            <button onClick={onClose} aria-label="Fechar" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-soft)', padding: '2px', display: 'inline-flex' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
        {description && <p style={{ margin: '0 0 20px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{description}</p>}
        {children && <div style={{ minHeight: 0, overflowY: 'auto', marginBottom: footer ? '24px' : 0 }}>{children}</div>}
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  );
}
