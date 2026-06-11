import { apiClient } from '../client'
import type { Livro, LivroCreate, LivroDetalhe, LivroUpdate, Page } from './types'

export type LivroListFilters = {
  q?: string
  page?: number
}

export async function listarLivros(filters: LivroListFilters = {}): Promise<Page<Livro>> {
  const response = await apiClient.get<Page<Livro>>('/livros', { params: filters })

  return response.data
}

export async function detalheLivro(idLivro: number): Promise<LivroDetalhe> {
  const response = await apiClient.get<LivroDetalhe>(`/livros/${idLivro}`)

  return response.data
}

export const listar = listarLivros
export const detalhe = detalheLivro

export async function criarLivro(payload: LivroCreate): Promise<Livro> {
  const response = await apiClient.post<Livro>('/livros', payload)

  return response.data
}

export async function atualizarLivro(idLivro: number, payload: LivroUpdate): Promise<LivroDetalhe> {
  const response = await apiClient.put<LivroDetalhe>(`/livros/${idLivro}`, payload)

  return response.data
}

export const atualizar = atualizarLivro
