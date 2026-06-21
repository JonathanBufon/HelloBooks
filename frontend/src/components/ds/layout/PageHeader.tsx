import { Fragment, type ReactNode, type CSSProperties } from 'react';

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Breadcrumb trail, last item is current page. */
  breadcrumb?: string[];
  /** Right-aligned action slot. */
  actions?: ReactNode;
  style?: CSSProperties;
}

/** Page title row with optional breadcrumb and actions. */
export function PageHeader({ title, subtitle, breadcrumb, actions, style = {} }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 'var(--section-gap)', ...style }}>
      {breadcrumb && (
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
          fontSize: 'var(--text-sm)', color: 'var(--color-text-soft)',
        }}>
          {breadcrumb.map((b, i) => (
            <Fragment key={i}>
              {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
              <span style={{ color: i === breadcrumb.length - 1 ? 'var(--color-text-muted)' : 'var(--color-text-soft)' }}>{b}</span>
            </Fragment>
          ))}
        </nav>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-extrabold)',
            color: 'var(--color-text)', letterSpacing: 'var(--tracking-tight)',
          }}>{title}</h1>
          {subtitle && <p style={{ margin: '6px 0 0', fontSize: 'var(--text-base)', color: 'var(--color-text-muted)' }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>{actions}</div>}
      </div>
    </div>
  );
}
