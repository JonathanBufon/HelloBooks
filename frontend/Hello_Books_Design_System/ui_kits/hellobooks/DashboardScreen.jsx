/* DashboardScreen — métricas, tendência semanal, atividade, ações rápidas. */
const {
  PageHeader: DPageHeader, MetricCard: DMetricCard, Card: DCard, CardHeader: DCardHeader,
  Button: DButton, Avatar: DAvatar, StatusBadge: DStatusBadge,
} = window.HelloBooksDesignSystem_5c47c8;

function WeeklyTrends() {
  const data = [["Seg", 62], ["Ter", 78], ["Qua", 54], ["Qui", 88], ["Sex", 95], ["Sáb", 40], ["Dom", 28]];
  const max = 100;
  return (
    <DCard style={{ height: "100%" }}>
      <DCardHeader title="Tendência Semanal de Empréstimos" subtitle="Últimos 7 dias" />
      <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "180px", padding: "0 4px" }}>
        {data.map(([day, v]) => (
          <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", height: "100%", justifyContent: "flex-end" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-text-muted)" }}>{v}</div>
            <div style={{
              width: "100%", maxWidth: "38px", height: `${(v / max) * 100}%`,
              borderRadius: "8px 8px 4px 4px",
              background: v >= 88 ? "var(--gradient-primary)" : "var(--color-primary-100)",
            }} />
            <div style={{ fontSize: "12px", color: "var(--color-text-soft)", fontWeight: 600 }}>{day}</div>
          </div>
        ))}
      </div>
    </DCard>
  );
}

function QuickActions({ onNavigate }) {
  const actions = [
    ["clipboard-list", "Registrar Empréstimo"],
    ["rotate-ccw", "Processar Devolução"],
    ["book-plus", "Cadastrar Livro"],
    ["user-plus", "Cadastrar Membro"],
  ];
  return (
    <DCard style={{ height: "100%" }}>
      <DCardHeader title="Ações Rápidas" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {actions.map(([icon, label]) => (
          <button key={label} onClick={() => onNavigate && onNavigate("Circulação")} style={{
            display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start",
            padding: "16px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)",
            background: "var(--color-surface-soft)", cursor: "pointer", textAlign: "left",
            fontFamily: "var(--font-sans)",
          }}>
            <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--color-primary-100)", color: "var(--color-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={icon} size={20} />
            </span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text)" }}>{label}</span>
          </button>
        ))}
      </div>
    </DCard>
  );
}

function RecentActivity() {
  const items = [
    ["arrow-left-right", "Empréstimo registrado", "Sapiens · Ana Lima", "há 4 min", "primary"],
    ["rotate-ccw", "Devolução processada", "1984 · João Reis", "há 22 min", "success"],
    ["alert-circle", "Multa aplicada", "Dom Casmurro · Marina Costa", "há 1 h", "danger"],
    ["book-plus", "Livro cadastrado", "O Cortiço · 4 exemplares", "há 2 h", "info"],
  ];
  const tones = {
    primary: ["var(--color-primary-100)", "var(--color-primary)"],
    success: ["var(--color-success-bg)", "var(--color-success)"],
    danger: ["var(--color-danger-bg)", "var(--color-danger)"],
    info: ["var(--color-info-bg)", "var(--color-info)"],
  };
  return (
    <DCard style={{ height: "100%" }}>
      <DCardHeader title="Atividade Recente" action={<DButton variant="ghost" size="sm">Ver tudo</DButton>} />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {items.map(([icon, title, sub, time, tone], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderTop: i ? "1px solid var(--color-border)" : "none" }}>
            <span style={{ width: "38px", height: "38px", flexShrink: 0, borderRadius: "10px", background: tones[tone][0], color: tones[tone][1], display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={icon} size={18} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-text)" }}>{title}</div>
              <div style={{ fontSize: "13px", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
            </div>
            <span style={{ fontSize: "12px", color: "var(--color-text-soft)", whiteSpace: "nowrap" }}>{time}</span>
          </div>
        ))}
      </div>
    </DCard>
  );
}

function DashboardScreen({ onNavigate }) {
  return (
    <>
      <DPageHeader
        title="Dashboard"
        subtitle="Situação operacional da biblioteca"
        actions={<DButton icon={<Icon name="plus" size={18} />} onClick={() => onNavigate && onNavigate("Circulação")}>Registrar Empréstimo</DButton>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "var(--section-gap)" }}>
        <DMetricCard icon={<Icon name="book" size={22} />} label="Total de Livros" value="12.480" delta="+3%" />
        <DMetricCard icon={<Icon name="arrow-left-right" size={22} />} label="Empréstimos Ativos" value="842" tone="info" delta="+12" />
        <DMetricCard icon={<Icon name="alert-circle" size={22} />} label="Devoluções Atrasadas" value="38" tone="danger" delta="+5" deltaTone="danger" />
        <DMetricCard icon={<Icon name="user-plus" size={22} />} label="Novos Membros" value="64" tone="success" delta="+8%" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "18px", marginBottom: "18px" }}>
        <WeeklyTrends />
        <QuickActions onNavigate={onNavigate} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
        <RecentActivity />
        <NewAcquisitions />
      </div>
    </>
  );
}

function NewAcquisitions() {
  const { BookCover: NBookCover } = window.HelloBooksDesignSystem_5c47c8;
  const books = [
    ["O Cortiço", "Aluísio Azevedo"],
    ["A Hora da Estrela", "Clarice Lispector"],
    ["Vidas Secas", "Graciliano Ramos"],
    ["Grande Sertão", "Guimarães Rosa"],
  ];
  return (
    <DCard style={{ height: "100%" }}>
      <DCardHeader title="Novas Aquisições" action={<DButton variant="ghost" size="sm">Ver acervo</DButton>} />
      <div style={{ display: "flex", gap: "16px" }}>
        {books.map(([t, a]) => (
          <div key={t} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" }}>
            <NBookCover title={t} author={a} width={72} />
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.2 }}>{t}</div>
            <div style={{ fontSize: "11px", color: "var(--color-text-soft)" }}>{a}</div>
          </div>
        ))}
      </div>
    </DCard>
  );
}

window.DashboardScreen = DashboardScreen;
