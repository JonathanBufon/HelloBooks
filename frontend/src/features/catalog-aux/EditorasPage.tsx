import * as editorasApi from '../../api/catalog/editoras';
import type { Editora } from '../../types/api';
import { AuxCrudPage } from './AuxCrudPage';

export function EditorasPage() {
  return <AuxCrudPage<Editora> title="Editoras" singular="Editora" idKey="id_editora" api={editorasApi} />;
}
