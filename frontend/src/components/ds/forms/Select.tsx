import { useState, type CSSProperties, type ChangeEvent } from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps {
  label?: string;
  value?: string;
  options: (SelectOption | string)[];
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  style?: CSSProperties;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

/** Dropdown select styled to match Hello Books fields. */
export function Select({
  label, value, options = [], placeholder = "Selecione\u2026",
  hint, error, disabled = false, required = false, id, style = {}, ...rest
}: SelectProps) {
  const [focus, setFocus] = useState(false);
  const inputId = id || (label ? `sel-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--color-danger)" : focus ? "var(--color-primary)" : "var(--color-border-strong)";
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)",
        }}>
          {label}{required && <span style={{ color: "var(--color-danger)" }}> *</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          id={inputId}
          value={value}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: "100%",
            height: "48px",
            padding: "0 40px 0 16px",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            color: value ? "var(--color-text)" : "var(--color-text-soft)",
            background: disabled ? "#F1F2F7" : "var(--color-surface-soft)",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-md)",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            boxShadow: focus && !error ? "0 0 0 3px var(--focus-ring)" : "none",
            transition: "border-color .15s ease, box-shadow .15s ease",
          }}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg style={{ position: "absolute", right: "16px", pointerEvents: "none" }}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-text-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {error
        ? <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)", fontWeight: 500 }}>{error}</span>
        : hint
          ? <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-soft)" }}>{hint}</span>
          : null}
    </div>
  );
}
