import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as livrosApi from '../../api/catalog/livros';
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

  if (isLoading) return <Card>Carregando livro...</Card>;
  if (!livro) return <Card>Livro nao encontrado.</Card>;

  return (
    <>
      <PageHeader title="Editar Livro" subtitle={livro.titulo} breadcrumb={['Inicio', 'Catalogo', livro.titulo, 'Editar']} />
      <LivroForm initial={livro} submitLabel="Salvar Alteracoes" onSubmit={handleSubmit} />
    </>
  );
}
