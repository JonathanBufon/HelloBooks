import React from "react";
import { Avatar } from "../data/Avatar.jsx";

/**
 * Fixed left navigation shell. Logo + nome + subtítulo no topo,
 * navegação no meio, card de usuário no rodapé.
 * children = SidebarItem nodes.
 */
export function Sidebar({ subtitle = "Academic Management", children, user, style = {} }) {
  return (
    <aside style={{
      width: "var(--sidebar-width)", flexShrink: 0, height: "100%",
      background: "var(--color-surface)",
      borderRight: "1px solid var(--color-border)",
      display: "flex", flexDirection: "column",
      padding: "24px 18px",
      ...style,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 8px 22px" }}>
        <span style={{
          width: "42px", height: "42px", borderRadius: "12px",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "var(--gradient-primary)", color: "#fff", flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </span>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-extrabold)", color: "var(--color-text)" }}>Hello Books</div>
          <div style={{ fontSize: "12px", color: "var(--color-text-soft)", fontWeight: "var(--weight-medium)" }}>{subtitle}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, overflowY: "auto" }}>
        {children}
      </nav>

      {/* User card */}
      {user && (
        <div style={{
          marginTop: "16px", padding: "12px",
          display: "flex", alignItems: "center", gap: "12px",
          background: "var(--color-primary-50)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
        }}>
          <Avatar name={user.name} src={user.avatar} size="md" />
          <div style={{ lineHeight: 1.3, overflow: "hidden" }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", color: "var(--color-text)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: "var(--color-text-soft)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{user.role}</div>
          </div>
        </div>
      )}
    </aside>
  );
}
