import { apiClient } from '../client'
import type { Categoria, Page } from './types'

export async function listarCategorias(termo = '', page = 1): Promise<Page<Categoria>> {
  const response = await apiClient.get<Page<Categoria>>('/categorias', {
    params: { q: termo, page },
  })

  return response.data
}

export const listar = listarCategorias

export async function atualizarCategoria(
  idCategoria: number,
  payload: Pick<Categoria, 'nome'>,
): Promise<Categoria> {
  const response = await apiClient.put<Categoria>(`/categorias/${idCategoria}`, payload)

  return response.data
}

export const atualizar = atualizarCategoria

export async function removerCategoria(idCategoria: number): Promise<void> {
  await apiClient.delete(`/categorias/${idCategoria}`)
}

export const remover = removerCategoria
