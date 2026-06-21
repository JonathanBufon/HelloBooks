import { type CSSProperties } from 'react';
import { Badge } from './Badge';

/** Maps a Hello Books status string (livro/membro/empréstimo) to the right tone. */
const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  // Livro
  'Disponível': 'success', 'Emprestado': 'warning', 'Reservado': 'primary',
  'Manutenção': 'info', 'Perdido': 'danger', 'Descartado': 'neutral',
  'Disponivel': 'success', 'Manutencao': 'info',
  // Membro
  'Ativo': 'success', 'Suspenso': 'warning', 'Inadimplente': 'danger',
  'Inativo': 'neutral', 'Bloqueado': 'danger',
  // Empréstimo
  'Atrasado': 'danger', 'Devolvido': 'success', 'Renovado': 'primary',
  'Cancelado': 'neutral', 'Regularizado': 'success', 'Pendente': 'warning',
};

export interface StatusBadgeProps {
  /** pt-BR status string for livro, membro or empréstimo. */
  status: string;
  dot?: boolean;
  style?: CSSProperties;
}

/** Status badge that auto-picks tone from a Hello Books domain status. */
export function StatusBadge({ status, dot = true, style = {} }: StatusBadgeProps) {
  const tone = STATUS_TONE[status] || 'neutral';
  return <Badge tone={tone} dot={dot} style={style}>{status}</Badge>;
}
