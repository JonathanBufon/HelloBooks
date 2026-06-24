import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { TextInput } from '../../components/ds/forms/TextInput';
import { Checkbox } from '../../components/ds/forms/Checkbox';
import { Button } from '../../components/ds/actions/Button';
import { BookOpen, Users, ArrowLeftRight, BarChart3, Mail, Lock } from 'lucide-react';

const FEATURES = [
  { icon: BookOpen, label: 'Catálogo Digital' },
  { icon: Users, label: 'Gestão de Membros' },
  { icon: ArrowLeftRight, label: 'Controle de Empréstimos' },
  { icon: BarChart3, label: 'Relatórios' },
] as const;

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const emailValue = email.trim();

    if (!emailValue || !senha.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(emailValue, senha, lembrar);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Credenciais inválidas. Verifique seu e-mail e senha.';
      // API returns errors in the REST envelope: { error: { message } }.
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const resp = (err as { response?: { data?: { error?: { message?: string } } } }).response;
        setError(resp?.data?.error?.message ?? msg);
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg-primary)' }}>
      {/* Institutional purple panel */}
      <div style={{
        flex: '1 1 0',
        background: 'var(--gradient-primary)',
        color: '#fff',
        padding: '56px 52px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minWidth: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 46, height: 46, borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={26} />
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>Hello Books</div>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Central Library</div>
          </div>
        </div>

        <div>
          <h1 style={{
            fontSize: '34px', fontWeight: 800, lineHeight: 1.2,
            margin: '0 0 16px', letterSpacing: '-0.01em', maxWidth: '440px',
          }}>
            A plataforma inteligente para gestão de bibliotecas modernas e centros de conhecimento.
          </h1>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '12px', maxWidth: '440px', marginTop: '28px',
          }}>
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,255,255,.12)', borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
              }}>
                <Icon size={20} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '12px', opacity: 0.7 }}>
          © 2026 Hello Books · Academic Management
        </div>
      </div>

      {/* Form column */}
      <div style={{
        flex: '1 1 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px', minWidth: 0,
      }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{
            fontSize: '26px', fontWeight: 800, color: 'var(--color-text)',
            margin: '0 0 6px',
          }}>
            Acessar o sistema
          </h2>
          <p style={{
            fontSize: '15px', color: 'var(--color-text-muted)',
            margin: '0 0 28px',
          }}>
            Entre com suas credenciais institucionais.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <TextInput
              label="E-mail"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
              error={error && !email.trim() ? 'Campo obrigatório' : undefined}
            />
            <TextInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              icon={<Lock size={18} />}
              required
              error={error && !senha.trim() ? 'Campo obrigatório' : undefined}
            />

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <Checkbox
                label="Lembrar de mim"
                checked={lembrar}
                onChange={() => setLembrar(!lembrar)}
              />
            </div>

            {error && email.trim() && senha.trim() && (
              <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-danger)',
                fontWeight: 500,
                padding: '10px 14px',
                background: 'var(--color-danger-bg)',
                borderRadius: 'var(--radius-md)',
              }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              full
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar no Sistema'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
