import { apiClient } from '../client'
import type { Autor, Page } from './types'

export async function listarAutores(termo = '', page = 1): Promise<Page<Autor>> {
  const response = await apiClient.get<Page<Autor>>('/autores', {
    params: { q: termo, page },
  })

  return response.data
}

export const listar = listarAutores

export async function atualizarAutor(idAutor: number, payload: Pick<Autor, 'nome'>): Promise<Autor> {
  const response = await apiClient.put<Autor>(`/autores/${idAutor}`, payload)

  return response.data
}

export const atualizar = atualizarAutor

export async function removerAutor(idAutor: number): Promise<void> {
  await apiClient.delete(`/autores/${idAutor}`)
}

export const remover = removerAutor
