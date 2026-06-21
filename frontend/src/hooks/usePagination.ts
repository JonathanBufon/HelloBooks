import { useState, useCallback, useMemo } from 'react';
import type { Pagination } from '../types/api';

export function usePagination(pagination?: Pagination) {
  const [page, setPage] = useState(1);

  const totalPages = pagination?.last_page ?? 1;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const goToPage = useCallback((p: number) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNext) setPage((p) => p + 1);
  }, [hasNext]);

  const prevPage = useCallback(() => {
    if (hasPrev) setPage((p) => p - 1);
  }, [hasPrev]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return useMemo(() => ({
    page,
    totalPages,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    reset,
  }), [page, totalPages, hasNext, hasPrev, goToPage, nextPage, prevPage, reset]);
}
