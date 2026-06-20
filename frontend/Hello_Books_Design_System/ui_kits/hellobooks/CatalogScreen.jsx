/* CatalogScreen — filtros + grade de livros + tabela. */
const {
  PageHeader: CPageHeader, Button: CButton, BookCard: CBookCard, Card: CCard,
  SearchInput: CSearchInput, Select: CSelect, IconButton: CIconButton,
  DataTable: CDataTable, StatusBadge: CStatusBadge, BookCover: CBookCover, Modal: CModal,
  TextInput: CTextInput,
} = window.HelloBooksDesignSystem_5c47c8;

const BOOKS = [
  { title: "Dom Casmurro", author: "Machado de Assis", status: "Disponível", category: "Ficção", available: 3, copies: 5 },
  { title: "Sapiens", author: "Yuval Noah Harari", status: "Emprestado", category: "História", available: 0, copies: 4 },
  { title: "1984", author: "George Orwell", status: "Disponível", category: "Ficção", available: 2, copies: 6 },
  { title: "O Cortiço", author: "Aluísio Azevedo", status: "Reservado", category: "Ficção", available: 1, copies: 3 },
  { title: "Cosmos", author: "Carl Sagan", status: "Manutenção", category: "Ciência", available: 0, copies: 2 },
  { title: "A Revolução dos Bichos", author: "George Orwell", status: "Disponível", category: "Ficção", available: 4, copies: 4 },
];

function CatalogScreen() {
  const [view, setView] = React.useState("grid");
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <CPageHeader
        title="Catálogo"
        subtitle="Consulta e manutenção do acervo"
        breadcrumb={["Início", "Catálogo"]}
        actions={<>
          <CButton variant="secondary" size="md" icon={<Icon name="download" size={18} />}>Importar Metadados</CButton>
          <CButton icon={<Icon name="plus" size={18} />} onClick={() => setOpen(true)}>Cadastrar Livro</CButton>
        </>}
      />

      <CCard padding="18px" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "240px" }}><CSearchInput placeholder="Buscar por título, autor ou ISBN..." /></div>
          <div style={{ width: "180px" }}><CSelect options={["Todas categorias", "Ficção", "História", "Ciência"]} value="Todas categorias" placeholder="" /></div>
          <div style={{ width: "160px" }}><CSelect options={["Todos status", "Disponível", "Emprestado", "Reservado"]} value="Todos status" placeholder="" /></div>
          <div style={{ display: "flex", gap: "4px", background: "var(--color-surface-soft)", padding: "4px", borderRadius: "var(--radius-md)" }}>
            <CIconButton variant={view === "grid" ? "outline" : "ghost"} active={view === "grid"} aria-label="Grade" onClick={() => setView("grid")}><Icon name="layout-grid" size={18} /></CIconButton>
            <CIconButton variant={view === "table" ? "outline" : "ghost"} active={view === "table"} aria-label="Tabela" onClick={() => setView("table")}><Icon name="list" size={18} /></CIconButton>
          </div>
        </div>
      </CCard>

      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "18px" }}>
          {BOOKS.map((b) => <CBookCard key={b.title} book={b} actionLabel="Ver Detalhes" />)}
        </div>
      ) : (
        <CDataTable
          columns={[
            { key: "cover", label: "Capa", width: "64px", render: (_, r) => <CBookCover title={r.title} author={r.author} width={36} /> },
            { key: "title", label: "Título", render: (v, r) => <div><div style={{ fontWeight: 700 }}>{v}</div><div style={{ fontSize: "12px", color: "var(--color-text-soft)" }}>{r.author}</div></div> },
            { key: "category", label: "Categoria" },
            { key: "status", label: "Status", render: (v) => <CStatusBadge status={v} /> },
            { key: "available", label: "Exemplares", align: "center", render: (v, r) => `${v}/${r.copies}` },
            { key: "acoes", label: "Ações", align: "right", render: () => <CButton size="sm" variant="ghost">Ver</CButton> },
          ]}
          rows={BOOKS.map((b, i) => ({ id: i, ...b }))}
        />
      )}

      {open && (
        <CModal
          title="Cadastrar Livro"
          description="Preencha os dados bibliográficos do exemplar."
          width={560}
          onClose={() => setOpen(false)}
          footer={<>
            <CButton variant="secondary" onClick={() => setOpen(false)}>Cancelar</CButton>
            <CButton variant="primary" onClick={() => setOpen(false)}>Cadastrar Livro</CButton>
          </>}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ gridColumn: "1 / -1" }}><CTextInput label="Título da obra" placeholder="Ex.: Memórias Póstumas" required /></div>
            <CTextInput label="Autor principal" placeholder="Ex.: Machado de Assis" required />
            <CTextInput label="ISBN-13" placeholder="978-..." required />
            <CSelect label="Categoria" options={["Ficção", "História", "Ciência", "Referência"]} value="" />
            <CTextInput label="Nº de exemplares" type="number" placeholder="1" />
          </div>
        </CModal>
      )}
    </>
  );
}

window.CatalogScreen = CatalogScreen;
