import apiClient from './client';
import type { Multa, MultaResumo } from '../types/multa';

export async function getResumo(): Promise<MultaResumo> {
  const response = await apiClient.get<MultaResumo>('/minhas-notificacoes/resumo');
  return response.data;
}

export async function list(): Promise<Multa[]> {
  const response = await apiClient.get<Multa[]>('/minhas-notificacoes');
  return response.data;
}

export async function marcarLidas(): Promise<void> {
  await apiClient.put('/minhas-notificacoes/ler');
}
