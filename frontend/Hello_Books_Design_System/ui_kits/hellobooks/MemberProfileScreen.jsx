/* MemberProfileScreen — hero do membro, multas, métricas, info, empréstimos ativos. */
const {
  PageHeader: MPageHeader, MemberProfileCard: MMemberCard, FineSummaryCard: MFineCard,
  MetricCard: MMetricCard, Card: MCard, CardHeader: MCardHeader, Button: MButton,
  DataTable: MDataTable, StatusBadge: MStatusBadge, BookCover: MBookCover,
} = window.HelloBooksDesignSystem_5c47c8;

const ACTIVE_LOANS = [
  { id: 1, title: "Sapiens", author: "Yuval Noah Harari", retirada: "06 jun", venc: "20 jun", status: "Ativo" },
  { id: 2, title: "Dom Casmurro", author: "Machado de Assis", retirada: "28 mai", venc: "12 jun", status: "Atrasado" },
  { id: 3, title: "Cosmos", author: "Carl Sagan", retirada: "10 jun", venc: "24 jun", status: "Ativo" },
];

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--color-border)" }}>
      <span style={{ fontSize: "13px", color: "var(--color-text-soft)" }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text)" }}>{value}</span>
    </div>
  );
}

function MemberProfileScreen() {
  return (
    <>
      <MPageHeader
        title="Perfil do Membro"
        breadcrumb={["Início", "Membros", "João Reis"]}
        actions={<>
          <MButton variant="secondary" size="md" icon={<Icon name="mail" size={18} />}>Enviar E-mail</MButton>
          <MButton variant="primary" size="md" icon={<Icon name="clipboard-list" size={18} />}>Registrar Empréstimo</MButton>
        </>}
      />

      <div style={{ marginBottom: "18px" }}>
        <MMemberCard
          member={{ name: "João Reis", id: "MB-2041", type: "Acadêmico", since: "Mar 2023", level: "Leitor Ávido", status: "Ativo" }}
          actions={<MButton variant="secondary" size="sm" icon={<Icon name="pencil" size={16} />}>Editar Perfil</MButton>}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "18px", marginBottom: "18px" }}>
        <MMetricCard icon={<Icon name="arrow-left-right" size={22} />} label="Empréstimos Ativos" value="3" tone="info" />
        <MMetricCard icon={<Icon name="book-check" size={22} />} label="Total de Livros Lidos" value="48" tone="success" />
        <MMetricCard icon={<Icon name="clock" size={22} />} label="Devoluções no Prazo" value="94%" />
        <div style={{ gridRow: "span 1" }}>
          <MFineCard amount="R$ 12,00" count={1} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "18px" }}>
        <MCard>
          <MCardHeader title="Informações Pessoais" />
          <InfoRow label="E-mail" value="joao.reis@uni.edu" />
          <InfoRow label="Telefone" value="(48) 99812-4471" />
          <InfoRow label="Curso" value="Letras" />
          <InfoRow label="Matrícula" value="2023104872" />
          <InfoRow label="Departamento" value="Humanas" />
        </MCard>

        <MCard>
          <MCardHeader title="Empréstimos Ativos" action={<MButton variant="ghost" size="sm">Ver histórico</MButton>} />
          <MDataTable
            columns={[
              { key: "title", label: "Livro", render: (v, r) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <MBookCover title={v} author={r.author} width={32} />
                  <div><div style={{ fontWeight: 700 }}>{v}</div><div style={{ fontSize: "12px", color: "var(--color-text-soft)" }}>{r.author}</div></div>
                </div>
              ) },
              { key: "venc", label: "Vencimento" },
              { key: "status", label: "Status", render: (v) => <MStatusBadge status={v} /> },
              { key: "acoes", label: "Ações", align: "right", render: () => <MButton size="sm" variant="ghost">Renovar</MButton> },
            ]}
            rows={ACTIVE_LOANS}
          />
        </MCard>
      </div>
    </>
  );
}

window.MemberProfileScreen = MemberProfileScreen;
