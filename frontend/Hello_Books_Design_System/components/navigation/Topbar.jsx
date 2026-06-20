import React from "react";
import { SearchInput } from "../forms/SearchInput.jsx";
import { IconButton } from "../actions/IconButton.jsx";
import { Avatar } from "../data/Avatar.jsx";

/** Top bar: busca global, notificações, ajuda, avatar. */
export function Topbar({ searchPlaceholder, hasNotifications = true, user, onSearch, right, style = {} }) {
  return (
    <header style={{
      height: "var(--topbar-height)", flexShrink: 0,
      display: "flex", alignItems: "center", gap: "16px",
      padding: "0 var(--content-pad)",
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      ...style,
    }}>
      <div style={{ flex: 1, maxWidth: "460px" }}>
        <SearchInput placeholder={searchPlaceholder} onChange={onSearch} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {right}
        <div style={{ position: "relative" }}>
          <IconButton variant="ghost" aria-label="Notificações">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </IconButton>
          {hasNotifications && (
            <span style={{ position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-danger)", border: "2px solid var(--color-surface)" }} />
          )}
        </div>
        <IconButton variant="ghost" aria-label="Ajuda">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </IconButton>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "6px", paddingLeft: "12px", borderLeft: "1px solid var(--color-border)" }}>
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", color: "var(--color-text)" }}>{user.name}</div>
              <div style={{ fontSize: "11px", color: "var(--color-text-soft)" }}>{user.role}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
