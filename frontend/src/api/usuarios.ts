import apiClient from './client';
import type { PaginatedResponse } from '../types/api';
import type { Usuario, UsuarioCreate, UsuarioUpdate } from '../types/auth';

export interface UsuarioListParams {
  page?: number;
  per_page?: number;
  q?: string;
}

export async function list(params: UsuarioListParams = {}): Promise<PaginatedResponse<Usuario>> {
  const response = await apiClient.get<PaginatedResponse<Usuario>>('/usuarios', { params });
  return response.data;
}

export async function get(id: number): Promise<Usuario> {
  const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
  return response.data;
}

export async function create(payload: UsuarioCreate): Promise<Usuario> {
  const response = await apiClient.post<Usuario>('/usuarios', payload);
  return response.data;
}

export async function update(id: number, payload: UsuarioUpdate): Promise<Usuario> {
  const response = await apiClient.put<Usuario>(`/usuarios/${id}`, payload);
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`/usuarios/${id}`);
}
