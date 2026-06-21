import type { StatusSolicitacaoEmprestimo } from '../../types/solicitacao-emprestimo';

export const STATUS_SOLICITACAO_LABEL: Record<StatusSolicitacaoEmprestimo, string> = {
  pendente: 'Pendente',
  aprovada: 'Aprovada',
  recusada: 'Recusada',
  cancelada: 'Cancelada',
};

export const STATUS_SOLICITACAO_TONE: Record<StatusSolicitacaoEmprestimo, 'warning' | 'success' | 'danger' | 'neutral'> = {
  pendente: 'warning',
  aprovada: 'success',
  recusada: 'danger',
  cancelada: 'neutral',
};
