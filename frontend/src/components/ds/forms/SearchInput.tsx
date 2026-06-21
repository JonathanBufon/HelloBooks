import { useState, type CSSProperties, type ChangeEvent } from 'react';

export interface SearchInputProps {
  value?: string;
  placeholder?: string;
  width?: string | number;
  style?: CSSProperties;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

/** Global search field with leading magnifier — for the topbar. */
export function SearchInput({
  value, placeholder = "Buscar cat\u00E1logo, membros ou ISBN...",
  onChange, width = "100%", style = {}, ...rest
}: SearchInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{
      position: "relative", display: "flex", alignItems: "center", width, ...style,
    }}>
      <svg style={{ position: "absolute", left: "16px", pointerEvents: "none" }}
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-text-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          height: "46px",
          padding: "0 16px 0 46px",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text)",
          background: "var(--color-surface-soft)",
          border: `1px solid ${focus ? "var(--color-primary)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-md)",
          outline: "none",
          boxShadow: focus ? "0 0 0 3px var(--focus-ring)" : "none",
          transition: "border-color .15s ease, box-shadow .15s ease",
        }}
        {...rest}
      />
    </div>
  );
}
