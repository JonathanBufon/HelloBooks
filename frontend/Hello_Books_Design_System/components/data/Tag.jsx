import React from "react";

/** Category/classification tag. Estilo chip roxo claro com #. */
export function Tag({ children, hash = true, onRemove, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 10px",
      fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
      color: "var(--color-primary)", background: "var(--color-primary-100)",
      borderRadius: "var(--radius-sm)", whiteSpace: "nowrap", ...style,
    }}>
      {hash && <span style={{ opacity: 0.6 }}>#</span>}
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Remover tag" style={{
          border: "none", background: "transparent", color: "var(--color-primary)",
          cursor: "pointer", padding: 0, display: "inline-flex", opacity: 0.7,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </span>
  );
}
