import apiClient from './client';
import type { SolicitacaoEmprestimo, SolicitacoesEmprestimoResponse } from '../types/solicitacao-emprestimo';

export interface SolicitacoesEmprestimoListParams {
  page?: number;
  per_page?: number;
  status?: string;
  id_usuario?: number;
  q?: string;
}

export async function list(params: SolicitacoesEmprestimoListParams = {}): Promise<SolicitacoesEmprestimoResponse> {
  const response = await apiClient.get<SolicitacoesEmprestimoResponse>('/solicitacoes-emprestimo', { params });
  return response.data;
}

export async function aprovar(id: number): Promise<SolicitacaoEmprestimo> {
  const response = await apiClient.put<SolicitacaoEmprestimo>(`/solicitacoes-emprestimo/${id}/aprovar`);
  return response.data;
}

export async function recusar(id: number, justificativa: string): Promise<SolicitacaoEmprestimo> {
  const response = await apiClient.put<SolicitacaoEmprestimo>(`/solicitacoes-emprestimo/${id}/recusar`, { justificativa });
  return response.data;
}
