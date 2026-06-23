import type { AxiosError } from 'axios';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const STATUS_LABELS = {
  disponivel: 'Disponivel',
  indisponivel: 'Indisponivel',
  emprestado: 'Emprestado',
  reservado: 'Reservado',
  manutencao: 'Manutencao',
  intacto: 'Intacto',
  rabiscado: 'Rabiscado',
  rasgado: 'Rasgado',
  dobrado: 'Dobrado',
  bibliotecario: 'Bibliotecario',
  leitor: 'Leitor',
  created: 'Criado',
  updated: 'Atualizado',
  deleted: 'Removido',
} as const;

interface ErrorResponse {
  error?: {
    message?: string;
    details?: Record<string, string[]>;
  };
}

export function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : dateFormatter.format(date);
}

export function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : dateTimeFormatter.format(date);
}

export function getErrorMessage(error: unknown, fallback = 'Nao foi possivel concluir a operacao.') {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data?.error?.message ?? fallback;
}

export function getFieldErrors(error: unknown) {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data?.error?.details ?? {};
}

export function joinNames(items?: Array<{ nome: string }>) {
  return items?.map((item) => item.nome).join(', ') || '-';
}
