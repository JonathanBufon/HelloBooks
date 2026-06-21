/* LoginScreen — two columns: institutional purple panel + access form. */
const { Button: HBButton, TextInput: HBTextInput, Checkbox: HBCheckbox } = window.HelloBooksDesignSystem_5c47c8;

function LoginScreen({ onLogin }) {
  const features = [
    ["book-open", "Catálogo Digital"],
    ["users", "Gestão de Membros"],
    ["arrow-left-right", "Controle de Empréstimos"],
    ["bar-chart-3", "Relatórios"],
  ];
  return (
    <div style={{ display: "flex", height: "100%", background: "var(--color-bg)" }}>
      {/* Institutional column */}
      <div style={{
        flex: "1 1 0", background: "var(--gradient-primary)", color: "#fff",
        padding: "56px 52px", display: "flex", flexDirection: "column", justifyContent: "space-between",
        minWidth: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img src="../../assets/logo-mono.svg" width="46" height="46" alt="Hello Books" />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontSize: "20px", fontWeight: 800 }}>Hello Books</div>
            <div style={{ fontSize: "13px", opacity: 0.8 }}>Central Library</div>
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: "34px", fontWeight: 800, lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.01em", maxWidth: "440px" }}>
            A plataforma inteligente para gestão de bibliotecas modernas e centros de conhecimento.
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "440px", marginTop: "28px" }}>
            {features.map(([icon, label]) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "rgba(255,255,255,.12)", borderRadius: "var(--radius-lg)", padding: "14px 16px",
              }}>
                <Icon name={icon} size={20} />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: "12px", opacity: 0.7 }}>© 2026 Hello Books · Academic Management</div>
      </div>

      {/* Form column */}
      <div style={{ flex: "1 1 0", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", minWidth: 0 }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 800, color: "var(--color-text)", margin: "0 0 6px" }}>Acessar o sistema</h2>
          <p style={{ fontSize: "15px", color: "var(--color-text-muted)", margin: "0 0 28px" }}>Entre com suas credenciais institucionais.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <HBTextInput label="E-mail" type="email" placeholder="marina@biblioteca.edu" icon={<Icon name="mail" size={18} />} defaultValue="marina@biblioteca.edu" />
            <HBTextInput label="Senha" type="password" placeholder="••••••••" icon={<Icon name="lock" size={18} />} defaultValue="senha123" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <HBCheckbox label="Lembrar de mim" checked />
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: "13px", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Esqueci minha senha</a>
            </div>
            <HBButton variant="primary" size="lg" full onClick={onLogin}>Entrar no Sistema</HBButton>
          </div>
        </div>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
