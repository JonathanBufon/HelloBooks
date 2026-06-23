/* AppShell — sidebar + topbar + scrollable main, composing DS primitives. */
const { Sidebar, SidebarItem, Topbar } = window.HelloBooksDesignSystem_5c47c8;

const NAV = [
  ["Dashboard", "layout-grid"],
  ["Catálogo", "book-open"],
  ["Membros", "users"],
  ["Circulação", "arrow-left-right"],
  ["Relatórios", "bar-chart-3"],
  ["Multas", "alert-circle"],
  ["Configurações", "settings"],
];

const CURRENT_USER = { name: "Marina Costa", role: "Head Librarian" };

function AppShell({ active, onNavigate, children }) {
  return (
    <div style={{ display: "flex", height: "100%", background: "var(--color-bg)" }}>
      <Sidebar subtitle="Central Library" user={CURRENT_USER} style={{ height: "100%" }}>
        {NAV.map(([label, icon]) => (
          <SidebarItem
            key={label}
            icon={<Icon name={icon} size={18} />}
            label={label}
            active={active === label}
            badge={label === "Multas" ? 4 : undefined}
            onClick={() => onNavigate && onNavigate(label)}
          />
        ))}
      </Sidebar>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" }}>
        <Topbar searchPlaceholder="Buscar catálogo, membros ou ISBN..." user={CURRENT_USER} />
        <main style={{ flex: 1, overflowY: "auto", padding: "var(--content-pad)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

window.AppShell = AppShell;
window.CURRENT_USER = CURRENT_USER;
