import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as minhasNotificacoesApi from '../api/minhas-notificacoes';

export function useMultasPendentes() {
  const [quantidade, setQuantidade] = useState(0);
  const [valorTotal, setValorTotal] = useState('0.00');
  const location = useLocation();

  const fetch = useCallback(async () => {
    try {
      const resumo = await minhasNotificacoesApi.getResumo();
      setQuantidade(resumo.quantidade_pendente);
      setValorTotal(resumo.valor_total_pendente);
    } catch {
      // silently fail — badge just won't show
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch, location.pathname]);

  return { quantidade, valorTotal, refetch: fetch };
}
