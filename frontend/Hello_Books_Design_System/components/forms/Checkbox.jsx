import React from "react";

/** Checkbox with label. Roxo quando marcado. */
export function Checkbox({ label, checked = false, onChange, disabled = false, id, style = {} }) {
  const inputId = id || (label ? `cb-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <label htmlFor={inputId} style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      fontSize: "var(--text-sm)", color: "var(--color-text)", ...style,
    }}>
      <span style={{
        width: "20px", height: "20px", flexShrink: 0,
        borderRadius: "6px",
        border: checked ? "none" : "1px solid var(--color-border-strong)",
        background: checked ? "var(--color-primary)" : "var(--color-surface)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "background .15s ease, border-color .15s ease",
      }}>
        {checked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <input id={inputId} type="checkbox" checked={checked} disabled={disabled}
        onChange={onChange} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      {label}
    </label>
  );
}
