import { Button } from '../ds/actions/Button';
import type { Pagination } from '../../types/api';

interface PaginationControlsProps {
  pagination?: Pagination;
  page: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ pagination, page, onPageChange }: PaginationControlsProps) {
  const totalPages = pagination?.last_page ?? 1;
  const total = pagination?.total ?? 0;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      marginTop: '16px',
      color: 'var(--color-text-muted)',
      fontSize: 'var(--text-sm)',
    }}>
      <span>{total} registro(s) · Pagina {page} de {totalPages}</span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Proxima
        </Button>
      </div>
    </div>
  );
}
