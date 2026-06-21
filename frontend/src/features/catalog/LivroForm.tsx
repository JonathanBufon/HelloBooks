import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import * as autoresApi from '../../api/catalog/autores';
import * as categoriasApi from '../../api/catalog/categorias';
import * as editorasApi from '../../api/catalog/editoras';
import { Button } from '../../components/ds/actions/Button';
import { Checkbox } from '../../components/ds/forms/Checkbox';
import { Select } from '../../components/ds/forms/Select';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Modal } from '../../components/ds/feedback/Modal';
import { Card, CardHeader } from '../../components/ds/layout/Card';
import { useToast } from '../../hooks/useToast';
import type { Autor, Categoria, Editora, LivroDetalhe } from '../../types/api';
import { getErrorMessage, getFieldErrors } from '../../utils/format';

export interface LivroFormValue {
  titulo: string;
  isbn: string;
  ano_publicacao: number;
  id_editora: number;
  autores: Array<{ id_autor: number }>;
  categorias: Array<{ id_categoria: number }>;
}

interface LivroFormProps {
  initial?: LivroDetalhe;
  submitLabel: string;
  onSubmit: (value: LivroFormValue) => Promise<void>;
}

type EntityModal = 'autor' | 'categoria' | null;

export function LivroForm({ initial, submitLabel, onSubmit }: LivroFormProps) {
  const { showSuccess, showError } = useToast();
  const [titulo, setTitulo] = useState(initial?.titulo ?? '');
  const [isbn, setIsbn] = useState(initial?.isbn ?? '');
  const [ano, setAno] = useState(String(initial?.ano_publicacao ?? new Date().getFullYear()));
  const [editoraId, setEditoraId] = useState(initial?.id_editora ? String(initial.id_editora) : '');
  const [autores, setAutores] = useState<Autor[]>([]);
  const [editoras, setEditoras] = useState<Editora[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedAutores, setSelectedAutores] = useState<number[]>(initial?.autores?.map((autor) => autor.id_autor) ?? []);
  const [selectedCategorias, setSelectedCategorias] = useState<number[]>(initial?.categorias?.map((categoria) => categoria.id_categoria) ?? []);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [modal, setModal] = useState<EntityModal>(null);
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      autoresApi.list({ per_page: 100 }),
      editorasApi.list({ per_page: 100 }),
      categoriasApi.list({ per_page: 100 }),
    ])
      .then(([autoresResponse, editorasResponse, categoriasResponse]) => {
        setAutores(autoresResponse.data);
        setEditoras(editorasResponse.data);
        setCategorias(categoriasResponse.data);
      })
      .catch((error) => showError(getErrorMessage(error, 'Nao foi possivel carregar dados do formulario.')));
  }, [showError]);

  const toggleAutor = (idAutor: number) => {
    setSelectedAutores((current) => current.includes(idAutor) ? current.filter((id) => id !== idAutor) : [...current, idAutor]);
  };

  const toggleCategoria = (idCategoria: number) => {
    setSelectedCategorias((current) => current.includes(idCategoria) ? current.filter((id) => id !== idCategoria) : [...current, idCategoria]);
  };

  const createInlineEntity = async () => {
    if (!modal || !newName.trim()) return;
    try {
      if (modal === 'autor') {
        const autor = await autoresApi.create({ nome: newName.trim() });
        setAutores((current) => [...current, autor]);
        setSelectedAutores((current) => [...current, autor.id_autor]);
      } else {
        const categoria = await categoriasApi.create({ nome: newName.trim() });
        setCategorias((current) => [...current, categoria]);
        setSelectedCategorias((current) => [...current, categoria.id_categoria]);
      }
      showSuccess('Registro criado.');
      setModal(null);
      setNewName('');
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel criar o registro.'));
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    if (isbn.length < 10 || isbn.length > 13) {
      setErrors({ isbn: ['ISBN deve ter entre 10 e 13 caracteres.'] });
      return;
    }
    if (!editoraId || selectedAutores.length === 0 || selectedCategorias.length === 0) {
      showError('Preencha editora, autores e categorias.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        titulo,
        isbn,
        ano_publicacao: Number(ano),
        id_editora: Number(editoraId),
        autores: selectedAutores.map((id_autor) => ({ id_autor })),
        categorias: selectedCategorias.map((id_categoria) => ({ id_categoria })),
      });
    } catch (error) {
      setErrors(getFieldErrors(error));
      showError(getErrorMessage(error, 'Nao foi possivel salvar o livro.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Dados do Livro" subtitle="Preencha os metadados bibliograficos" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '16px', marginBottom: '16px' }}>
          <TextInput label="Titulo" value={titulo} required error={errors.titulo?.[0]} onChange={(event) => setTitulo(event.target.value)} />
          <TextInput label="Ano" type="number" value={ano} required error={errors.ano_publicacao?.[0]} onChange={(event) => setAno(event.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <TextInput label="ISBN" value={isbn} required error={errors.isbn?.[0]} onChange={(event) => setIsbn(event.target.value)} />
          <Select
            label="Editora"
            value={editoraId}
            required
            error={errors.id_editora?.[0]}
            options={editoras.map((editora) => ({ value: String(editora.id_editora), label: editora.nome }))}
            onChange={(event) => setEditoraId(event.target.value)}
          />
        </div>

        <EntitySelector
          title="Autores"
          items={autores.map((autor) => ({ id: autor.id_autor, nome: autor.nome }))}
          selected={selectedAutores}
          onToggle={toggleAutor}
          onCreate={() => setModal('autor')}
        />
        <EntitySelector
          title="Categorias"
          items={categorias.map((categoria) => ({ id: categoria.id_categoria, nome: categoria.nome }))}
          selected={selectedCategorias}
          onToggle={toggleCategoria}
          onCreate={() => setModal('categoria')}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button disabled={isSubmitting} onClick={handleSubmit}>{submitLabel}</Button>
        </div>
      </Card>

      <Modal
        open={!!modal}
        title={modal === 'autor' ? 'Criar Autor' : 'Criar Categoria'}
        onClose={() => setModal(null)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button>
            <Button onClick={createInlineEntity}>Criar</Button>
          </>
        )}
      >
        <TextInput label="Nome" value={newName} onChange={(event) => setNewName(event.target.value)} />
      </Modal>
    </>
  );
}

function EntitySelector({
  title,
  items,
  selected,
  onToggle,
  onCreate,
}: {
  title: string;
  items: Array<{ id: number; nome: string }>;
  selected: number[];
  onToggle: (id: number) => void;
  onCreate: () => void;
}) {
  return (
    <div style={{ marginTop: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>{title}</div>
        <Button size="sm" variant="secondary" icon={<Plus size={16} />} onClick={onCreate}>Criar novo</Button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '10px',
        padding: '14px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface-soft)',
      }}>
        {items.map((item) => (
          <Checkbox key={item.id} label={item.nome} checked={selected.includes(item.id)} onChange={() => onToggle(item.id)} />
        ))}
        {items.length === 0 && <span style={{ color: 'var(--color-text-soft)', fontSize: 'var(--text-sm)' }}>Nenhum registro encontrado.</span>}
      </div>
    </div>
  );
}
