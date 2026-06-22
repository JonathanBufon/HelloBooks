import apiClient from '../client';
import type { Livro, LivroCreate, LivroDetalhe, LivroUpdate, PaginatedResponse } from '../../types/api';

export interface LivroListParams {
  page?: number;
  per_page?: number;
  q?: string;
}

export async function list(params: LivroListParams = {}): Promise<PaginatedResponse<Livro>> {
  const response = await apiClient.get<PaginatedResponse<Livro>>('/livros', { params });
  return response.data;
}

export async function get(id: number): Promise<LivroDetalhe> {
  const response = await apiClient.get<LivroDetalhe>(`/livros/${id}`);
  return response.data;
}

export async function create(payload: LivroCreate): Promise<Livro> {
  const response = await apiClient.post<Livro>('/livros', payload);
  return response.data;
}

export async function update(id: number, payload: LivroUpdate): Promise<Livro> {
  const response = await apiClient.put<Livro>(`/livros/${id}`, payload);
  return response.data;
}

export async function updateDisponibilidade(id: number, status: Livro['status_disponibilidade']): Promise<LivroDetalhe> {
  const response = await apiClient.put<LivroDetalhe>(`/livros/${id}/disponibilidade`, {
    status_disponibilidade: status,
  });
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`/livros/${id}`);
}
