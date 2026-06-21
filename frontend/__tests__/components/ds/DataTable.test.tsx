import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from '../../../src/components/ds/data/DataTable';

describe('DataTable', () => {
  it('renders rows and handles row click', async () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={[{ key: 'nome', label: 'Nome' }]}
        rows={[{ id: 1, nome: 'Machado de Assis' }]}
        onRowClick={onRowClick}
      />,
    );

    await userEvent.click(screen.getByText('Machado de Assis'));

    expect(onRowClick).toHaveBeenCalledWith({ id: 1, nome: 'Machado de Assis' });
  });

  it('renders empty text', () => {
    render(<DataTable columns={[{ key: 'nome', label: 'Nome' }]} rows={[]} emptyText="Sem dados" />);

    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });
});
