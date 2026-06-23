import type { Pagination } from './api';

export type MotivoMulta = 'atraso' | 'rabisco' | 'rasgo' | 'dobra';
export type StatusMulta = 'pendente' | 'paga' | 'perdoada';

export interface Multa {
  id_multa: number;
  motivo: MotivoMulta;
  valor: string;
  status: StatusMulta;
  data_baixa: string | null;
  notificado_em?: string | null;
  notificacao_lida_em?: string | null;
  created_at: string;
  updated_at: string;
  usuario: {
    id_usuario: number;
    nome_completo: string;
  } | null;
  livro: {
    id_livro: number;
    titulo: string;
  } | null;
  exemplar: {
    id_exemplar: number;
  } | null;
}

export interface MultaCreate {
  id_item_emprestimo: number;
  motivo: MotivoMulta;
  valor: number;
}

export interface MultaDetalhe extends Multa {
  justificativa_perdao: string | null;
  bibliotecario_baixa: {
    id_usuario: number;
    nome_completo: string;
  } | null;
  bibliotecario_notificacao: {
    id_usuario: number;
    nome_completo: string;
  } | null;
  item_emprestimo: {
    id_item_emprestimo: number;
    id_emprestimo: number;
    data_devolucao_item: string | null;
  };
}

export interface ItemEmprestimoMulta {
  id_item_emprestimo: number;
  id_emprestimo: number;
  data_devolucao_item: string | null;
  emprestimo: {
    id_emprestimo: number;
    data_retirada: string;
    data_devolucao_prevista: string;
    status: string;
  } | null;
  livro: {
    id_livro: number;
    titulo: string;
  } | null;
  exemplar: {
    id_exemplar: number;
  } | null;
}

export interface MultaResumo {
  quantidade_pendente: number;
  valor_total_pendente: string;
}

export interface MinhasMultasResponse {
  data: Multa[];
  pagination: Pagination;
  resumo: MultaResumo;
}
