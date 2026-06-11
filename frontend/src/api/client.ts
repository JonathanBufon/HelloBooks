import axios, { AxiosError } from 'axios'

export type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}

type ErrorEnvelope = {
  error?: Partial<ApiError>
  message?: string
  errors?: Record<string, unknown>
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8015/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorEnvelope>) => {
    const payload = error.response?.data
    const normalized: ApiError = {
      code: payload?.error?.code ?? 'ERRO_HTTP',
      message:
        payload?.error?.message ??
        payload?.message ??
        error.message ??
        'Erro inesperado ao chamar a API.',
      details: payload?.error?.details ?? payload?.errors,
    }

    return Promise.reject(normalized)
  },
)
