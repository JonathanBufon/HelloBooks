import { type ReactNode, type CSSProperties } from 'react';

export interface CardProps {
  children?: ReactNode;
  padding?: string | number;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}

export interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned action slot (button, link). */
  action?: ReactNode;
  style?: CSSProperties;
}

/** White surface card — base container for content blocks. */
export function Card({ children, padding = 'var(--card-pad)', elevation = 'md', style = {}, ...rest }: CardProps) {
  const shadows: Record<string, string> = { none: 'none', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)' };
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: shadows[elevation],
      padding,
      ...style,
    }} {...rest}>
      {children}
    </div>
  );
}

/** Card title row with optional subtitle and action slot. */
export function CardHeader({ title, subtitle, action, style = {} }: CardHeaderProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: '16px', marginBottom: '20px', ...style,
    }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>{title}</h3>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
