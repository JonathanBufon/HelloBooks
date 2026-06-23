import React from "react";

const TONES = {
  neutral: { bg: "var(--color-surface-soft)", fg: "var(--color-text-muted)" },
  primary: { bg: "var(--color-primary-100)", fg: "var(--color-primary)" },
  success: { bg: "var(--color-success-bg)", fg: "var(--color-success)" },
  warning: { bg: "var(--color-warning-bg)", fg: "var(--color-warning)" },
  danger:  { bg: "var(--color-danger-bg)", fg: "var(--color-danger)" },
  info:    { bg: "var(--color-info-bg)", fg: "var(--color-info)" },
};

/** Pill badge for status. dot=true mostra ponto colorido à esquerda. */
export function Badge({ children, tone = "neutral", dot = false, style = {} }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "4px 10px",
      fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)",
      lineHeight: 1.4, color: t.fg, background: t.bg,
      borderRadius: "var(--radius-full)", whiteSpace: "nowrap", ...style,
    }}>
      {dot && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: t.fg }} />}
      {children}
    </span>
  );
}
