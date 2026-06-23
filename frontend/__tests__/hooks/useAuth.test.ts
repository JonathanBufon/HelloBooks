import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as authApi from '../../src/api/auth';
import { useAuthProvider } from '../../src/hooks/useAuth';

vi.mock('../../src/api/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  me: vi.fn(),
}));

const usuario = {
  id_usuario: 1,
  nome_completo: 'Admin',
  email: 'admin@hellobooks.com',
  cargo: 'bibliotecario' as const,
};

describe('useAuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.mocked(authApi.login).mockResolvedValue({ token: 'jwt', token_type: 'bearer', expires_in: 3600, usuario });
    vi.mocked(authApi.logout).mockResolvedValue(undefined);
    vi.mocked(authApi.me).mockResolvedValue(usuario);
  });

  it('stores login in localStorage when remembering session', async () => {
    const { result } = renderHook(() => useAuthProvider());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('admin@hellobooks.com', 'password', true);
    });

    expect(localStorage.getItem('token')).toBe('jwt');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('clears storage on logout', async () => {
    const { result } = renderHook(() => useAuthProvider());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('admin@hellobooks.com', 'password', false);
      await result.current.logout();
    });

    expect(sessionStorage.getItem('token')).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
