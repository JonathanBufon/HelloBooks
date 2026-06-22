import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import * as livrosApi from '../../api/catalog/livros';
import { Button } from '../../components/ds/actions/Button';
import { Modal } from '../../components/ds/feedback/Modal';
import { Card } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import type { LivroDetalhe } from '../../types/api';
import { getErrorMessage } from '../../utils/format';
import { LivroForm, type LivroFormValue } from './LivroForm';

export function EditarLivroPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const livroId = Number(id);
  const [livro, setLivro] = useState<LivroDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    livrosApi.get(livroId)
      .then(setLivro)
      .catch((error) => showError(getErrorMessage(error, 'Nao foi possivel carregar o livro.')))
      .finally(() => setIsLoading(false));
  }, [livroId, showError]);

  const handleSubmit = async (value: LivroFormValue) => {
    await livrosApi.update(livroId, value);
    showSuccess('Livro atualizado.');
    navigate(`/catalogo/${livroId}`);
  };

  const toggleDisponibilidade = async () => {
    if (!livro) return;
    const currentStatus = livro.status_disponibilidade ?? ((livro.contagem_exemplares?.disponivel ?? 0) > 0 ? 'disponivel' : 'indisponivel');
    const nextStatus = currentStatus === 'disponivel' ? 'indisponivel' : 'disponivel';
    try {
      const atualizado = await livrosApi.updateDisponibilidade(livroId, nextStatus);
      setLivro(atualizado);
      showSuccess(nextStatus === 'disponivel' ? 'Livro marcado como disponivel.' : 'Livro marcado como indisponivel.');
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel alterar a disponibilidade.'));
    }
  };

  const handleDelete = async () => {
    try {
      await livrosApi.remove(livroId);
      showSuccess('Livro removido.');
      navigate('/catalogo');
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel remover o livro.'));
    }
  };

  if (isLoading) return <Card>Carregando livro...</Card>;
  if (!livro) return <Card>Livro nao encontrado.</Card>;
  const statusDisponibilidade = livro.status_disponibilidade ?? ((livro.contagem_exemplares?.disponivel ?? 0) > 0 ? 'disponivel' : 'indisponivel');

  return (
    <>
      <PageHeader title="Editar Livro" subtitle={livro.titulo} breadcrumb={['Inicio', 'Catalogo', livro.titulo, 'Editar']} />
      <Card style={{ marginBottom: 'var(--section-gap)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <strong>Disponibilidade do livro</strong>
            <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>
              O livro fica indisponivel quando nao ha exemplares disponiveis ou quando todos estao emprestados.
            </p>
          </div>
          <Button variant="secondary" onClick={toggleDisponibilidade}>
            {statusDisponibilidade === 'disponivel' ? 'Marcar como Indisponivel' : 'Marcar como Disponivel'}
          </Button>
        </div>
      </Card>
      <LivroForm initial={livro} submitLabel="Salvar Alteracoes" onSubmit={handleSubmit} />
      {livro.pode_excluir && (
        <Card style={{ marginTop: 'var(--section-gap)', borderColor: 'var(--color-danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <strong>Remover livro</strong>
              <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)' }}>
                Disponivel somente para livros sem emprestimos ou movimentacoes registradas.
              </p>
            </div>
            <Button variant="danger" icon={<Trash2 size={18} />} onClick={() => setDeleteOpen(true)}>Excluir Livro</Button>
          </div>
        </Card>
      )}
      <Modal
        open={deleteOpen}
        title="Excluir Livro"
        description="Esta acao remove o livro e seus exemplares sem movimentacao. Nao pode ser desfeita."
        danger
        onClose={() => setDeleteOpen(false)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="danger" icon={<Trash2 size={18} />} onClick={handleDelete}>Excluir</Button>
          </>
        )}
      >
        <p>Confirma excluir <strong>{livro.titulo}</strong>?</p>
      </Modal>
    </>
  );
}
