import { type ReactNode, type CSSProperties } from 'react';

export interface MetricCardProps {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  /** Variation label e.g. "+12%". */
  delta?: string;
  deltaTone?: 'success' | 'warning' | 'danger';
  /** Icon chip color. */
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  style?: CSSProperties;
}

/**
 * Dashboard metric card — icon chip, big number, label, optional delta.
 */
export function MetricCard({ icon, label, value, delta, deltaTone = 'success', tone = 'primary', style = {} }: MetricCardProps) {
  const tones: Record<string, { bg: string; fg: string }> = {
    primary: { bg: 'var(--color-primary-100)', fg: 'var(--color-primary)' },
    success: { bg: 'var(--color-success-bg)', fg: 'var(--color-success)' },
    warning: { bg: 'var(--color-warning-bg)', fg: 'var(--color-warning)' },
    danger:  { bg: 'var(--color-danger-bg)', fg: 'var(--color-danger)' },
    info:    { bg: 'var(--color-info-bg)', fg: 'var(--color-info)' },
  };
  const t = tones[tone] ?? tones['primary']!;
  const deltaColor = deltaTone === 'danger' ? 'var(--color-danger)' : deltaTone === 'warning' ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      padding: '24px',
      display: 'flex', flexDirection: 'column', gap: '16px',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: t.bg, color: t.fg,
        }}>{icon}</span>
        {delta && (
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: deltaColor }}>{delta}</span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--color-text)', lineHeight: 1.1, letterSpacing: 'var(--tracking-tight)' }}>{value}</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 'var(--weight-medium)' }}>{label}</div>
      </div>
    </div>
  );
}
