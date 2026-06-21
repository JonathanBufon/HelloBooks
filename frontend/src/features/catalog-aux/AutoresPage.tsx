import * as autoresApi from '../../api/catalog/autores';
import type { Autor } from '../../types/api';
import { AuxCrudPage } from './AuxCrudPage';

export function AutoresPage() {
  return <AuxCrudPage<Autor> title="Autores" singular="Autor" idKey="id_autor" api={autoresApi} />;
}
