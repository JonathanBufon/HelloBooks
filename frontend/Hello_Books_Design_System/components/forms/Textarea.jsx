import React from "react";

/** Multi-line text field. Mesma linguagem visual do TextInput. */
export function Textarea({
  label, value, placeholder, hint, error, rows = 4,
  disabled = false, required = false, id, style = {}, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `ta-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--color-danger)" : focus ? "var(--color-primary)" : "var(--color-border-strong)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)",
        }}>
          {label}{required && <span style={{ color: "var(--color-danger)" }}> *</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          lineHeight: "var(--leading-normal)",
          color: "var(--color-text)",
          background: disabled ? "#F1F2F7" : "var(--color-surface-soft)",
          border: `1px solid ${borderColor}`,
          borderRadius: "var(--radius-md)",
          outline: "none",
          resize: "vertical",
          boxShadow: focus && !error ? "0 0 0 3px var(--focus-ring)" : "none",
          transition: "border-color .15s ease, box-shadow .15s ease",
        }}
        {...rest}
      />
      {error
        ? <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)", fontWeight: 500 }}>{error}</span>
        : hint
          ? <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-soft)" }}>{hint}</span>
          : null}
    </div>
  );
}
