import { useNavigate } from 'react-router-dom';
import * as livrosApi from '../../api/catalog/livros';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useToast } from '../../hooks/useToast';
import { LivroForm, type LivroFormValue } from './LivroForm';

export function CadastrarLivroPage() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const handleSubmit = async (value: LivroFormValue) => {
    const livro = await livrosApi.create(value);
    showSuccess('Livro cadastrado.');
    navigate(`/catalogo/${livro.id_livro}`);
  };

  return (
    <>
      <PageHeader title="Cadastrar Livro" subtitle="Adicionar novo titulo ao acervo" breadcrumb={['Inicio', 'Catalogo', 'Novo']} />
      <LivroForm submitLabel="Cadastrar Livro" onSubmit={handleSubmit} />
    </>
  );
}
