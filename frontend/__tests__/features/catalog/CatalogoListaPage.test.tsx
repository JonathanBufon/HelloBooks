import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as livrosApi from '../../../src/api/catalog/livros';
import * as categoriasApi from '../../../src/api/catalog/categorias';
import { AuthContext } from '../../../src/hooks/useAuth';
import { ToastContext } from '../../../src/hooks/useToast';
import { CatalogoListaPage } from '../../../src/features/catalog/CatalogoListaPage';

vi.mock('../../../src/api/catalog/livros', () => ({ list: vi.fn() }));
vi.mock('../../../src/api/catalog/categorias', () => ({ list: vi.fn() }));

const toastValue = {
  toasts: [],
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
  showWarning: vi.fn(),
  dismiss: vi.fn(),
};

const authValue = {
  usuario: {
    id_usuario: 1,
    nome_completo: 'Bibliotecario Teste',
    email: 'biblio@hello.local',
    cargo: 'bibliotecario' as const,
  },
  token: 'token',
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

function renderPage() {
  return render(
    <AuthContext.Provider value={authValue}>
      <ToastContext.Provider value={toastValue}>
        <MemoryRouter>
          <CatalogoListaPage />
        </MemoryRouter>
      </ToastContext.Provider>
    </AuthContext.Provider>,
  );
}

describe('CatalogoListaPage', () => {
  beforeEach(() => {
    vi.mocked(livrosApi.list).mockResolvedValue({
      data: [{
        id_livro: 1,
        titulo: 'Dom Casmurro',
        isbn: '1234567890',
        ano_publicacao: 1899,
        id_editora: 1,
        autores: [{ id_autor: 1, nome: 'Machado de Assis' }],
        categorias: [{ id_categoria: 1, nome: 'Romance' }],
      }],
      pagination: { total: 1, per_page: 12, current_page: 1, last_page: 1 },
    });
    vi.mocked(categoriasApi.list).mockResolvedValue({
      data: [{ id_categoria: 1, nome: 'Romance' }],
      pagination: { total: 1, per_page: 100, current_page: 1, last_page: 1 },
    });
  });

  it('renders catalog cards and toggles table mode', async () => {
    renderPage();

    expect(await screen.findAllByText('Dom Casmurro')).toHaveLength(2);

    await userEvent.click(screen.getByRole('button', { name: 'Tabela' }));

    expect(screen.getByText('ISBN')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('sends search query to API', async () => {
    renderPage();

    await userEvent.type(await screen.findByPlaceholderText('Buscar por titulo, autor ou ISBN'), 'abc');

    await waitFor(() => expect(livrosApi.list).toHaveBeenLastCalledWith({ page: 1, per_page: 12, q: 'abc' }));
  });
});
