import React from "react";

/** A navigation row inside the sidebar. Estado ativo: fundo roxo claro, texto roxo, peso 700. */
export function SidebarItem({ icon, label, active = false, badge, onClick, style = {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "12px", width: "100%",
        padding: "11px 14px",
        border: "none", textAlign: "left", cursor: "pointer",
        borderRadius: "var(--radius-md)",
        background: active ? "var(--color-primary-100)" : hover ? "var(--color-primary-50)" : "transparent",
        color: active ? "var(--color-primary)" : "var(--color-text-muted)",
        fontSize: "var(--text-sm)",
        fontWeight: active ? "var(--weight-bold)" : "var(--weight-medium)",
        fontFamily: "var(--font-sans)",
        transition: "background .12s ease, color .12s ease",
        ...style,
      }}>
      <span style={{ display: "inline-flex", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && (
        <span style={{
          minWidth: "20px", height: "20px", padding: "0 6px",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: "var(--weight-bold)",
          borderRadius: "999px",
          background: active ? "var(--color-primary)" : "var(--color-danger)",
          color: "#fff",
        }}>{badge}</span>
      )}
    </button>
  );
}
