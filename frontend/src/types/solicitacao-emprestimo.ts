import type { Pagination } from './api';

export type StatusSolicitacaoEmprestimo = 'pendente' | 'aprovada' | 'recusada' | 'cancelada';

export interface SolicitacaoEmprestimo {
  id_solicitacao_emprestimo: number;
  status: StatusSolicitacaoEmprestimo;
  observacoes?: string | null;
  justificativa_recusa?: string | null;
  data_decisao?: string | null;
  created_at?: string;
  updated_at?: string;
  usuario?: {
    id_usuario: number;
    nome_completo: string;
    email?: string;
  } | null;
  livro?: {
    id_livro: number;
    titulo: string;
    isbn?: string;
  } | null;
  emprestimo?: {
    id_emprestimo: number;
    data_retirada?: string;
    data_devolucao_prevista?: string;
    status: string;
  } | null;
  bibliotecario_responsavel?: {
    id_usuario: number;
    nome_completo: string;
  } | null;
}

export interface SolicitacoesEmprestimoResponse {
  data: SolicitacaoEmprestimo[];
  pagination: Pagination;
}

export interface SolicitacaoEmprestimoCreate {
  id_livro: number;
  observacoes?: string;
}
