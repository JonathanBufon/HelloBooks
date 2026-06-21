import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as multasApi from '../../../src/api/multas';
import { ToastContext } from '../../../src/hooks/useToast';
import { MultasPage } from '../../../src/features/multas/MultasPage';

vi.mock('../../../src/api/multas', () => ({
  list: vi.fn(),
  create: vi.fn(),
  pagar: vi.fn(),
  pagarTodas: vi.fn(),
  perdoar: vi.fn(),
}));

const toastValue = {
  toasts: [],
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showInfo: vi.fn(),
  showWarning: vi.fn(),
  dismiss: vi.fn(),
};

const sampleMulta = {
  id_multa: 1,
  motivo: 'atraso' as const,
  valor: '25.50',
  status: 'pendente' as const,
  data_baixa: null,
  created_at: '2026-06-20T10:00:00.000Z',
  updated_at: '2026-06-20T10:00:00.000Z',
  usuario: { id_usuario: 10, nome_completo: 'Ana Leitora' },
  livro: { id_livro: 1, titulo: 'Dom Casmurro' },
  exemplar: { id_exemplar: 1 },
};

function renderPage() {
  return render(
    <ToastContext.Provider value={toastValue}>
      <MemoryRouter>
        <MultasPage />
      </MemoryRouter>
    </ToastContext.Provider>,
  );
}

describe('MultasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(multasApi.list).mockResolvedValue({
      data: [sampleMulta],
      pagination: { total: 1, per_page: 20, current_page: 1, last_page: 1 },
    });
  });

  it('renders page header and data table with multas', async () => {
    renderPage();

    expect(await screen.findByText('Multas')).toBeInTheDocument();
    expect(await screen.findByText('Ana Leitora')).toBeInTheDocument();
    expect(await screen.findByText('Dom Casmurro')).toBeInTheDocument();
    expect(screen.getAllByText('Atraso').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pendente').length).toBeGreaterThan(0);
  });

  it('sends search query to API', async () => {
    renderPage();

    await screen.findByText('Ana Leitora');
    await userEvent.type(screen.getByPlaceholderText('Buscar por usuario ou livro'), 'ana');

    await waitFor(() =>
      expect(multasApi.list).toHaveBeenLastCalledWith(
        expect.objectContaining({ q: 'ana', page: 1, per_page: 20 }),
      ),
    );
  });

  it('opens and submits register modal', async () => {
    vi.mocked(multasApi.create).mockResolvedValue(sampleMulta);
    renderPage();

    await screen.findByText('Ana Leitora');
    await userEvent.click(screen.getByRole('button', { name: /Registrar Multa/i }));

    expect(await screen.findByText('ID Item Emprestimo')).toBeInTheDocument();
  });

  it('opens pay confirm modal on Dar Baixa click', async () => {
    renderPage();

    const darBaixaBtn = await screen.findByRole('button', { name: 'Dar Baixa' });
    await userEvent.click(darBaixaBtn);

    expect(await screen.findByText('Confirmar Pagamento')).toBeInTheDocument();
  });

  it('calls pagar API and refreshes list', async () => {
    vi.mocked(multasApi.pagar).mockResolvedValue({ ...sampleMulta, status: 'paga' as const });
    renderPage();

    const darBaixaBtn = await screen.findByRole('button', { name: 'Dar Baixa' });
    await userEvent.click(darBaixaBtn);
    await userEvent.click(await screen.findByRole('button', { name: 'Confirmar Pagamento' }));

    await waitFor(() => expect(multasApi.pagar).toHaveBeenCalledWith(1));
    expect(toastValue.showSuccess).toHaveBeenCalledWith('Multa marcada como paga.');
  });

  it('opens perdoar modal and requires justificativa', async () => {
    renderPage();

    const perdoarBtn = await screen.findByRole('button', { name: /Perdoar/i });
    await userEvent.click(perdoarBtn);

    const confirmarBtn = await screen.findByRole('button', { name: 'Confirmar Perdao' });
    expect(confirmarBtn).toBeDisabled();
  });

  it('calls perdoar API with justificativa', async () => {
    vi.mocked(multasApi.perdoar).mockResolvedValue({ ...sampleMulta, status: 'perdoada' as const });
    renderPage();

    const perdoarBtn = await screen.findByRole('button', { name: /Perdoar/i });
    await userEvent.click(perdoarBtn);

    await userEvent.type(screen.getByLabelText('Justificativa *'), 'Primeiro incidente');
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar Perdao' }));

    await waitFor(() =>
      expect(multasApi.perdoar).toHaveBeenCalledWith(1, 'Primeiro incidente'),
    );
    expect(toastValue.showSuccess).toHaveBeenCalledWith('Multa perdoada.');
  });

  it('applies status filter', async () => {
    renderPage();
    await screen.findByText('Ana Leitora');

    await userEvent.selectOptions(screen.getByLabelText('Status'), 'pendente');

    await waitFor(() =>
      expect(multasApi.list).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'pendente' }),
      ),
    );
  });

  it('applies motivo filter', async () => {
    renderPage();
    await screen.findByText('Ana Leitora');

    await userEvent.selectOptions(screen.getByLabelText('Motivo'), 'atraso');

    await waitFor(() =>
      expect(multasApi.list).toHaveBeenLastCalledWith(
        expect.objectContaining({ motivo: 'atraso' }),
      ),
    );
  });
});
