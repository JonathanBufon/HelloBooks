import apiClient from './client';
import type { LoginRequest, LoginResponse, Usuario } from '../types/auth';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function refresh(): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/refresh');
  return response.data;
}

export async function me(): Promise<Usuario> {
  const response = await apiClient.get<Usuario>('/auth/me');
  return response.data;
}
