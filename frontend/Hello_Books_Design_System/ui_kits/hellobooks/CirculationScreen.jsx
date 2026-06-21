/* CirculationScreen — ações rápidas, filtros e tabela de empréstimos. */
const {
  PageHeader: KPageHeader, Button: KButton, Card: KCard, DataTable: KDataTable,
  StatusBadge: KStatusBadge, BookCover: KBookCover, Avatar: KAvatar, Select: KSelect,
  SearchInput: KSearchInput, Toast: KToast,
} = window.HelloBooksDesignSystem_5c47c8;

const LOANS = [
  { id: 1, title: "Dom Casmurro", author: "Machado de Assis", member: "João Reis", retirada: "28 mai", venc: "12 jun", status: "Atrasado", fine: "R$ 12,00" },
  { id: 2, title: "Sapiens", author: "Yuval Noah Harari", member: "Ana Lima", retirada: "06 jun", venc: "20 jun", status: "Ativo", fine: "—" },
  { id: 3, title: "1984", author: "George Orwell", member: "Marina Costa", retirada: "01 jun", venc: "15 jun", status: "Devolvido", fine: "—" },
  { id: 4, title: "Cosmos", author: "Carl Sagan", member: "Pedro Sá", retirada: "10 jun", venc: "24 jun", status: "Renovado", fine: "—" },
  { id: 5, title: "O Cortiço", author: "Aluísio Azevedo", member: "Lucas Dias", retirada: "22 mai", venc: "05 jun", status: "Atrasado", fine: "R$ 18,00" },
];

function CirculationScreen() {
  const [toast, setToast] = React.useState(false);
  const quick = [
    ["clipboard-list", "Registrar Empréstimo", "primary"],
    ["rotate-ccw", "Processar Devolução", "secondary"],
    ["refresh-cw", "Renovar Empréstimo", "secondary"],
    ["bookmark", "Criar Reserva", "secondary"],
  ];
  return (
    <>
      <KPageHeader
        title="Circulação"
        subtitle="Fluxo operacional de empréstimos e devoluções"
        breadcrumb={["Início", "Circulação"]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "var(--section-gap)" }}>
        {quick.map(([icon, label, variant]) => (
          <KButton key={label} variant={variant} size="lg" icon={<Icon name={icon} size={18} />}
            onClick={() => variant === "primary" && setToast(true)} style={{ justifyContent: "flex-start" }}>
            {label}
          </KButton>
        ))}
      </div>

      <KCard padding="18px" style={{ marginBottom: "18px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "240px" }}><KSearchInput placeholder="Buscar por livro ou membro..." /></div>
          <div style={{ width: "180px" }}><KSelect options={["Todos status", "Ativo", "Atrasado", "Devolvido", "Renovado"]} value="Todos status" placeholder="" /></div>
          <div style={{ width: "160px" }}><KSelect options={["Este mês", "Últimos 7 dias", "Hoje"]} value="Este mês" placeholder="" /></div>
        </div>
      </KCard>

      <KDataTable
        columns={[
          { key: "title", label: "Livro", render: (v, r) => (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <KBookCover title={v} author={r.author} width={32} />
              <div><div style={{ fontWeight: 700 }}>{v}</div><div style={{ fontSize: "12px", color: "var(--color-text-soft)" }}>{r.author}</div></div>
            </div>
          ) },
          { key: "member", label: "Membro", render: (v) => (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <KAvatar name={v} size="sm" /><span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ) },
          { key: "retirada", label: "Retirada" },
          { key: "venc", label: "Vencimento" },
          { key: "status", label: "Status", render: (v) => <KStatusBadge status={v} /> },
          { key: "fine", label: "Multa", render: (v) => <span style={{ color: v === "—" ? "var(--color-text-soft)" : "var(--color-danger)", fontWeight: v === "—" ? 400 : 700 }}>{v}</span> },
          { key: "acoes", label: "Ações", align: "right", render: (_, r) => (
            <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
              <KButton size="sm" variant="ghost">Renovar</KButton>
              <KButton size="sm" variant="secondary">Devolver</KButton>
            </div>
          ) },
        ]}
        rows={LOANS}
      />

      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 2000 }}>
          <KToast tone="success" title="Empréstimo registrado." message="O exemplar foi marcado como emprestado." onClose={() => setToast(false)} />
        </div>
      )}
    </>
  );
}

window.CirculationScreen = CirculationScreen;
