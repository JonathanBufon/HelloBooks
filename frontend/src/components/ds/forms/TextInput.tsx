import { useState, type ReactNode, type CSSProperties, type ChangeEvent } from 'react';

export interface TextInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Error message — turns border red, replaces hint. */
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Leading icon node. */
  icon?: ReactNode;
  id?: string;
  style?: CSSProperties;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Labeled text field — label above, error/hint below, 48px tall.
 */
export function TextInput({
  label,
  value,
  placeholder,
  type = "text",
  hint,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  icon = null,
  id,
  style = {},
  ...rest
}: TextInputProps) {
  const [focus, setFocus] = useState(false);
  const inputId = id || (label ? `tf-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  const borderColor = error
    ? "var(--color-danger)"
    : focus
      ? "var(--color-primary)"
      : "var(--color-border-strong)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-semibold)",
          color: "var(--color-text)",
        }}>
          {label}{required && <span style={{ color: "var(--color-danger)" }}> *</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{
            position: "absolute", left: "14px", display: "inline-flex",
            color: "var(--color-text-soft)", pointerEvents: "none",
          }}>{icon}</span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: "100%",
            height: "48px",
            padding: icon ? "0 16px 0 42px" : "0 16px",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            color: "var(--color-text)",
            background: readOnly ? "#F1F2F7" : disabled ? "#F1F2F7" : "var(--color-surface-soft)",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-md)",
            outline: "none",
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "text",
            boxShadow: focus && !error ? "0 0 0 3px var(--focus-ring)" : "none",
            transition: "border-color .15s ease, box-shadow .15s ease",
          }}
          {...rest}
        />
      </div>
      {error
        ? <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)", fontWeight: 500 }}>{error}</span>
        : hint
          ? <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-soft)" }}>{hint}</span>
          : null}
    </div>
  );
}
