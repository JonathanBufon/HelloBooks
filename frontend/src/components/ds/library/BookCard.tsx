import { type CSSProperties } from 'react';
import { BookCover } from './BookCover';
import { StatusBadge } from '../data/StatusBadge';
import { Button } from '../actions/Button';

export interface BookData {
  title: string;
  author?: string;
  status?: string;
  category?: string;
  available?: number;
  copies?: number;
  coverSrc?: string;
}

export interface BookCardProps {
  book: BookData;
  actionLabel?: string;
  onAction?: () => void;
  style?: CSSProperties;
}

/** Catalog book card — cover, title, author, status, category, availability, action. */
export function BookCard({ book = {} as BookData, onAction, actionLabel = 'Ver Detalhes', style = {} }: BookCardProps) {
  const { title, author, status = 'Disponivel', category, available, copies, coverSrc } = book;
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      padding: '18px',
      display: 'flex', flexDirection: 'column', gap: '14px',
      ...style,
    }}>
      <div style={{ display: 'flex', gap: '14px' }}>
        <BookCover title={title} author={author} src={coverSrc} width={66} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)', lineHeight: 1.25 }}>{title}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{author}</div>
          <div style={{ marginTop: '2px' }}><StatusBadge status={status} /></div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-soft)', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
        <span>{category}</span>
        {available != null && (
          <span style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-muted)' }}>
            {available}{copies != null ? `/${copies}` : ''} disponíveis
          </span>
        )}
      </div>
      <Button variant="secondary" size="sm" full onClick={onAction}>{actionLabel}</Button>
    </div>
  );
}
