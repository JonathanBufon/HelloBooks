import { useState, type ReactNode, type CSSProperties } from 'react';

export interface DataColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  /** Custom cell renderer: (value, row) => node. */
  render?: (value: any, row: any) => ReactNode;
}

export interface DataTableProps {
  columns: DataColumn[];
  rows: any[];
  /** Field used as React key. @default "id" */
  rowKey?: string;
  onRowClick?: (row: any) => void;
  emptyText?: string;
  style?: CSSProperties;
}

/**
 * Operational data table — uppercase header on soft blue, 64px rows, purple hover.
 */
export function DataTable({ columns = [], rows = [], rowKey = 'id', onRowClick, emptyText = 'Nenhum registro encontrado.', style = {} }: DataTableProps) {
  const [hover, setHover] = useState(-1);
  return (
    <div style={{
      border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
      overflow: 'hidden', background: 'var(--color-surface)', ...style,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ background: 'var(--color-surface-soft)' }}>
            {columns.map((c) => (
              <th key={c.key} style={{
                textAlign: c.align || 'left',
                padding: '14px 20px',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-label)',
                color: '#7A7F91',
                width: c.width,
                whiteSpace: 'nowrap',
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-soft)' }}>{emptyText}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={row[rowKey] ?? i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{
                borderTop: '1px solid var(--color-border)',
                background: hover === i ? 'var(--color-primary-50)' : 'transparent',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background .12s ease',
              }}>
              {columns.map((c) => (
                <td key={c.key} style={{
                  textAlign: c.align || 'left',
                  padding: '16px 20px',
                  height: '64px',
                  color: 'var(--color-text)',
                  verticalAlign: 'middle',
                }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
