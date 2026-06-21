import apiClient from '../client';
import type { Categoria, CategoriaCreate, PaginatedResponse } from '../../types/api';

export interface CategoriaListParams {
  page?: number;
  per_page?: number;
  q?: string;
}

export async function list(params: CategoriaListParams = {}): Promise<PaginatedResponse<Categoria>> {
  const response = await apiClient.get<PaginatedResponse<Categoria>>('/categorias', { params });
  return response.data;
}

export async function get(id: number): Promise<Categoria> {
  const response = await apiClient.get<Categoria>(`/categorias/${id}`);
  return response.data;
}

export async function create(payload: CategoriaCreate): Promise<Categoria> {
  const response = await apiClient.post<Categoria>('/categorias', payload);
  return response.data;
}

export async function update(id: number, payload: CategoriaCreate): Promise<Categoria> {
  const response = await apiClient.put<Categoria>(`/categorias/${id}`, payload);
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`/categorias/${id}`);
}
