import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../../src/hooks/useAuth';
import { LoginPage } from '../../../src/features/auth/LoginPage';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    navigate.mockReset();
    vi.mocked(useAuth).mockReturnValue({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn(),
    });
  });

  it('renders and submits credentials', async () => {
    const auth = vi.mocked(useAuth).getMockImplementation()?.();
    render(<LoginPage />, { wrapper: MemoryRouter });

    await userEvent.type(screen.getByLabelText('E-mail *'), 'admin@hellobooks.com');
    await userEvent.type(screen.getByLabelText('Senha *'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar no Sistema' }));

    await waitFor(() => expect(auth?.login).toHaveBeenCalledWith('admin@hellobooks.com', 'password', false));
    expect(navigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('shows required field error', async () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    await userEvent.click(screen.getByRole('button', { name: 'Entrar no Sistema' }));

    expect(screen.getAllByText('Campo obrigatório')).toHaveLength(2);
  });
});
