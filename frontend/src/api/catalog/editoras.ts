import { apiClient } from '../client'
import type { Editora, Page } from './types'

export async function listarEditoras(termo = '', page = 1): Promise<Page<Editora>> {
  const response = await apiClient.get<Page<Editora>>('/editoras', {
    params: { q: termo, page },
  })

  return response.data
}

export const listar = listarEditoras

export async function atualizarEditora(
  idEditora: number,
  payload: Pick<Editora, 'nome'>,
): Promise<Editora> {
  const response = await apiClient.put<Editora>(`/editoras/${idEditora}`, payload)

  return response.data
}

export const atualizar = atualizarEditora

export async function removerEditora(idEditora: number): Promise<void> {
  await apiClient.delete(`/editoras/${idEditora}`)
}

export const remover = removerEditora
