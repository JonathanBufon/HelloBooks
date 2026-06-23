import React from "react";

/** Toggle switch. Roxo quando ligado. */
export function Switch({ label, checked = false, onChange, disabled = false, id, style = {} }) {
  const inputId = id || (label ? `sw-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <label htmlFor={inputId} style={{
      display: "inline-flex", alignItems: "center", gap: "12px",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      fontSize: "var(--text-sm)", color: "var(--color-text)", ...style,
    }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: "44px", height: "26px", flexShrink: 0, position: "relative",
          borderRadius: "999px",
          background: checked ? "var(--color-primary)" : "var(--color-border-strong)",
          transition: "background .2s ease",
        }}>
        <span style={{
          position: "absolute", top: "3px", left: checked ? "21px" : "3px",
          width: "20px", height: "20px", borderRadius: "50%", background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)", transition: "left .2s ease",
        }} />
      </span>
      <input id={inputId} type="checkbox" checked={checked} disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      {label}
    </label>
  );
}
