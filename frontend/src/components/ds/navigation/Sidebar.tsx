import { type ReactNode, type CSSProperties } from 'react';

export interface SidebarProps {
  logo?: ReactNode;
  logoHref?: string;
  children?: ReactNode;
  footer?: ReactNode;
  style?: CSSProperties;
}

export function Sidebar({ logo, logoHref, children, footer, style = {} }: SidebarProps) {
  const brand = (
    <>
      <span style={{
        width: '42px', height: '42px', borderRadius: '12px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--gradient-primary)', color: '#fff', flexShrink: 0,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      </span>
      <div style={{ lineHeight: 1.2 }}>
        {logo ?? (
          <>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-extrabold)', color: 'var(--color-text)' }}>Hello Books</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-soft)', fontWeight: 'var(--weight-medium)' }}>Academic Management</div>
          </>
        )}
      </div>
    </>
  );

  return (
    <aside style={{
      width: 260, flexShrink: 0, height: '100%',
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex', flexDirection: 'column',
      padding: '24px 18px',
      ...style,
    }}>
      {/* Brand */}
      {logoHref ? (
        <a href={logoHref} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 22px', textDecoration: 'none' }}>
          {brand}
        </a>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 22px' }}>
          {brand}
        </div>
      )}

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        {children}
      </nav>

      {/* Footer */}
      {footer && (
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
          {footer}
        </div>
      )}
    </aside>
  );
}
