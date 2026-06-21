import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Plus, Trash2 } from 'lucide-react';
import * as livrosApi from '../../api/catalog/livros';
import * as exemplaresApi from '../../api/catalog/exemplares';
import * as minhasSolicitacoesApi from '../../api/minhas-solicitacoes-emprestimo';
import { Button } from '../../components/ds/actions/Button';
import { DataTable, type DataColumn } from '../../components/ds/data/DataTable';
import { MetricCard } from '../../components/ds/data/MetricCard';
import { StatusBadge } from '../../components/ds/data/StatusBadge';
import { Tag } from '../../components/ds/data/Tag';
import { Modal } from '../../components/ds/feedback/Modal';
import { Select } from '../../components/ds/forms/Select';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Card, CardHeader } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { BookCover } from '../../components/ds/library/BookCover';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import type { CondicaoFisica, Exemplar, ExemplarStatus, LivroDetalhe } from '../../types/api';
import { formatDate, getErrorMessage, joinNames, STATUS_LABELS } from '../../utils/format';

const statusOptions = [
  { value: 'disponivel', label: 'Disponivel' },
  { value: 'manutencao', label: 'Manutencao' },
];

const condicaoOptions = [
  { value: 'intacto', label: 'Intacto' },
  { value: 'rabiscado', label: 'Rabiscado' },
  { value: 'rasgado', label: 'Rasgado' },
  { value: 'dobrado', label: 'Dobrado' },
];

export function CatalogoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { showSuccess, showError } = useToast();
  const livroId = Number(id);
  const [livro, setLivro] = useState<LivroDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [editing, setEditing] = useState<Exemplar | null>(null);
  const [deleting, setDeleting] = useState<Exemplar | null>(null);
  const [requestingLoan, setRequestingLoan] = useState(false);
  const isBibliotecario = usuario?.cargo === 'bibliotecario';

  const loadLivro = async () => {
    if (!Number.isFinite(livroId)) return;
    setIsLoading(true);
    try {
      setLivro(await livrosApi.get(livroId));
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel carregar o livro.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLivro();
  }, [livroId]);

  const createExemplares = async () => {
    const quantidade = Number(quantity);
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 1000) {
      showError('Informe uma quantidade entre 1 e 1000.');
      return;
    }
    try {
      await exemplaresApi.create(livroId, { quantidade });
      showSuccess('Exemplares registrados.');
      setQuantityOpen(false);
      setQuantity('1');
      await loadLivro();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel registrar exemplares.'));
    }
  };

  const updateExemplar = async () => {
    if (!editing) return;
    try {
      await exemplaresApi.update(editing.id_exemplar, {
        status: editing.status === 'emprestado' || editing.status === 'reservado' ? undefined : editing.status,
        condicao_fisica: editing.condicao_fisica,
      });
      showSuccess('Exemplar atualizado.');
      setEditing(null);
      await loadLivro();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel atualizar o exemplar.'));
    }
  };

  const deleteExemplar = async () => {
    if (!deleting) return;
    try {
      await exemplaresApi.remove(deleting.id_exemplar);
      showSuccess('Exemplar removido.');
      setDeleting(null);
      await loadLivro();
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel remover o exemplar.'));
    }
  };

  const requestLoan = async () => {
    setRequestingLoan(true);
    try {
      await minhasSolicitacoesApi.create({ id_livro: livroId });
      showSuccess('Solicitacao de emprestimo enviada.');
      navigate('/minhas-solicitacoes');
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel solicitar o emprestimo.'));
    } finally {
      setRequestingLoan(false);
    }
  };

  const columns: DataColumn[] = [
    { key: 'id_exemplar', label: 'Codigo', render: (value) => `#${value}` },
    { key: 'status', label: 'Status', render: (value: ExemplarStatus) => <StatusBadge status={STATUS_LABELS[value]} /> },
    { key: 'condicao_fisica', label: 'Condicao', render: (value: CondicaoFisica) => <StatusBadge status={STATUS_LABELS[value]} /> },
    { key: 'created_at', label: 'Cadastro', render: (value?: string) => formatDate(value) },
    ...(isBibliotecario ? [{
      key: 'acoes',
      label: 'Acoes',
      align: 'right',
      render: (_value, row: Exemplar) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button size="sm" variant="secondary" onClick={() => setEditing(row)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(row)}>Remover</Button>
        </div>
      ),
    } satisfies DataColumn] : []),
  ];

  if (isLoading) return <Card>Carregando livro...</Card>;
  if (!livro) return <Card>Livro nao encontrado.</Card>;

  return (
    <>
      <PageHeader
        title={livro.titulo}
        subtitle={isBibliotecario ? 'Detalhes do titulo e controle de exemplares' : 'Detalhes do titulo e disponibilidade no acervo'}
        breadcrumb={['Inicio', 'Catalogo', livro.titulo]}
        actions={isBibliotecario ? (
          <>
            <Button variant="secondary" icon={<Edit size={18} />} onClick={() => navigate(`/catalogo/${livro.id_livro}/editar`)}>
              Editar Livro
            </Button>
            <Button icon={<Plus size={18} />} onClick={() => setQuantityOpen(true)}>
              Registrar Exemplares
            </Button>
          </>
        ) : (
          <Button
            icon={<BookOpenIcon />}
            disabled={requestingLoan || livro.contagem_exemplares.disponivel < 1}
            onClick={requestLoan}
          >
            {livro.contagem_exemplares.disponivel < 1 ? 'Indisponivel' : 'Solicitar Emprestimo'}
          </Button>
        )}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '18px', marginBottom: 'var(--section-gap)' }}>
        <Card style={{ display: 'flex', justifyContent: 'center' }}>
          <BookCover title={livro.titulo} author={joinNames(livro.autores)} width={150} />
        </Card>
        <Card>
          <CardHeader title="Metadados" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
            <Info label="ISBN" value={livro.isbn} />
            <Info label="Ano" value={String(livro.ano_publicacao)} />
            <Info label="Editora" value={livro.editora?.nome ?? '-'} />
            <Info label="Autores" value={joinNames(livro.autores)} />
          </div>
          <div style={{ marginTop: '18px' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-soft)', marginBottom: '8px' }}>Categorias</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(livro.categorias ?? []).map((categoria) => <Tag key={categoria.id_categoria}>{categoria.nome}</Tag>)}
              {(!livro.categorias || livro.categorias.length === 0) && <span>-</span>}
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '18px', marginBottom: 'var(--section-gap)' }}>
        <MetricCard label="Disponiveis" value={livro.contagem_exemplares.disponivel} tone="success" />
        <MetricCard label="Emprestados" value={livro.contagem_exemplares.emprestado} tone="info" />
        <MetricCard label="Reservados" value={livro.contagem_exemplares.reservado} tone="primary" />
        <MetricCard label="Manutencao" value={livro.contagem_exemplares.manutencao} tone="warning" />
      </div>

      <Card>
        <CardHeader title="Exemplares" subtitle="Controle fisico dos exemplares deste titulo" />
        <DataTable columns={columns} rows={livro.exemplares} rowKey="id_exemplar" emptyText="Nenhum exemplar registrado." />
      </Card>

      <Modal
        open={quantityOpen}
        title="Registrar Exemplares"
        description="Todos os exemplares nascem como disponiveis e intactos."
        onClose={() => setQuantityOpen(false)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setQuantityOpen(false)}>Cancelar</Button>
            <Button onClick={createExemplares}>Registrar</Button>
          </>
        )}
      >
        <TextInput label="Quantidade" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
      </Modal>

      <Modal
        open={!!editing}
        title="Editar Exemplar"
        onClose={() => setEditing(null)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={updateExemplar}>Salvar</Button>
          </>
        )}
      >
        {editing && (
          <div style={{ display: 'grid', gap: '14px' }}>
            <Select
              label="Status"
              value={editing.status}
              options={statusOptions}
              disabled={editing.status === 'emprestado' || editing.status === 'reservado'}
              onChange={(event) => setEditing({ ...editing, status: event.target.value as ExemplarStatus })}
            />
            <Select
              label="Condicao fisica"
              value={editing.condicao_fisica}
              options={condicaoOptions}
              onChange={(event) => setEditing({ ...editing, condicao_fisica: event.target.value as CondicaoFisica })}
            />
          </div>
        )}
      </Modal>

      <Modal
        open={!!deleting}
        title="Remover Exemplar"
        description="Esta acao nao pode ser desfeita."
        danger
        onClose={() => setDeleting(null)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancelar</Button>
            <Button variant="danger" icon={<Trash2 size={18} />} onClick={deleteExemplar}>Remover</Button>
          </>
        )}
      >
        {deleting && <p>Confirma remover o exemplar #{deleting.id_exemplar}?</p>}
      </Modal>
    </>
  );
}

function BookOpenIcon() {
  return <Plus size={18} />;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-soft)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>{value}</div>
    </div>
  );
}
