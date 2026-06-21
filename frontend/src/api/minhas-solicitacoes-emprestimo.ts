import apiClient from './client';
import type { SolicitacaoEmprestimo, SolicitacaoEmprestimoCreate, SolicitacoesEmprestimoResponse } from '../types/solicitacao-emprestimo';

export interface MinhasSolicitacoesEmprestimoListParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export async function list(params: MinhasSolicitacoesEmprestimoListParams = {}): Promise<SolicitacoesEmprestimoResponse> {
  const response = await apiClient.get<SolicitacoesEmprestimoResponse>('/minhas-solicitacoes-emprestimo', { params });
  return response.data;
}

export async function create(payload: SolicitacaoEmprestimoCreate): Promise<SolicitacaoEmprestimo> {
  const response = await apiClient.post<SolicitacaoEmprestimo>('/minhas-solicitacoes-emprestimo', payload);
  return response.data;
}

export async function cancelar(id: number): Promise<SolicitacaoEmprestimo> {
  const response = await apiClient.put<SolicitacaoEmprestimo>(`/minhas-solicitacoes-emprestimo/${id}/cancelar`);
  return response.data;
}
