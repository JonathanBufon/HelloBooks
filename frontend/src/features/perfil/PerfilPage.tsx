import { useState } from 'react';
import * as authApi from '../../api/auth';
import { Button } from '../../components/ds/actions/Button';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Card, CardHeader } from '../../components/ds/layout/Card';
import { PageHeader } from '../../components/ds/layout/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/format';

export function PerfilPage() {
  const { usuario, updateUsuario } = useAuth();
  const { showSuccess, showError } = useToast();
  const [nome, setNome] = useState(usuario?.nome_completo ?? '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const salvar = async () => {
    if (!nome.trim()) {
      showError('Informe o nome.');
      return;
    }
    if (novaSenha && novaSenha !== confirmacao) {
      showError('A confirmacao da nova senha nao confere.');
      return;
    }

    setIsSubmitting(true);
    try {
      const atualizado = await authApi.updateProfile({
        nome_completo: nome.trim(),
        ...(novaSenha ? {
          senha_atual: senhaAtual,
          nova_senha: novaSenha,
          nova_senha_confirmation: confirmacao,
        } : {}),
      });
      updateUsuario?.(atualizado);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmacao('');
      showSuccess('Perfil atualizado.');
    } catch (error) {
      showError(getErrorMessage(error, 'Nao foi possivel atualizar o perfil.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Meu Perfil" subtitle="Atualize seu nome e senha de acesso" breadcrumb={['Inicio', 'Perfil']} />
      <Card style={{ maxWidth: 620 }}>
        <CardHeader title="Dados do usuario" subtitle={usuario?.email} />
        <div style={{ display: 'grid', gap: '16px' }}>
          <TextInput label="Nome" value={nome} required onChange={(event) => setNome(event.target.value)} />
          <TextInput label="Senha atual" type="password" value={senhaAtual} onChange={(event) => setSenhaAtual(event.target.value)} hint="Obrigatoria somente para trocar a senha" />
          <TextInput label="Nova senha" type="password" value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} />
          <TextInput label="Confirmar nova senha" type="password" value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={salvar} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Perfil'}</Button>
          </div>
        </div>
      </Card>
    </>
  );
}
