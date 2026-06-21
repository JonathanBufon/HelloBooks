import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from '../../../src/components/ds/feedback/Modal';

describe('Modal', () => {
  it('renders dialog content and closes from close button', async () => {
    const onClose = vi.fn();
    render(<Modal title="Confirmar" onClose={onClose}>Conteudo</Modal>);

    expect(screen.getByRole('dialog')).toHaveTextContent('Confirmar');
    expect(screen.getByText('Conteudo')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
