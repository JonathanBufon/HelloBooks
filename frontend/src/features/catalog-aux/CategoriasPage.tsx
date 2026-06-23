import * as categoriasApi from '../../api/catalog/categorias';
import type { Categoria } from '../../types/api';
import { AuxCrudPage } from './AuxCrudPage';

export function CategoriasPage() {
  return <AuxCrudPage<Categoria> title="Categorias" singular="Categoria" idKey="id_categoria" api={categoriasApi} />;
}
