import React from "react";
import { Button } from "../actions/Button.jsx";

/**
 * Fine summary highlight card — um dos poucos lugares onde o gradiente roxo
 * pinta o card inteiro (DESIGN.md §16.3). Para multas pendentes.
 */
export function FineSummaryCard({ amount = "R$ 0,00", count = 0, label = "Multas Pendentes", onPay, payLabel = "Registrar Pagamento", style = {} }) {
  const clear = count === 0;
  return (
    <div style={{
      borderRadius: "var(--radius-2xl)",
      padding: "26px",
      color: clear ? "var(--color-text)" : "#fff",
      background: clear ? "var(--color-surface)" : "var(--gradient-primary)",
      border: clear ? "1px solid var(--color-border)" : "none",
      boxShadow: clear ? "var(--shadow-sm)" : "var(--shadow-lg)",
      display: "flex", flexDirection: "column", gap: "18px",
      ...style,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", opacity: clear ? 0.7 : 0.85 }}>{label}</span>
        <span style={{
          width: "40px", height: "40px", borderRadius: "var(--radius-md)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: clear ? "var(--color-success-bg)" : "rgba(255,255,255,.18)",
          color: clear ? "var(--color-success)" : "#fff",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </span>
      </div>
      <div>
        <div style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-extrabold)", lineHeight: 1.05, letterSpacing: "var(--tracking-tight)" }}>{clear ? "Em dia" : amount}</div>
        {!clear && <div style={{ fontSize: "var(--text-sm)", opacity: 0.85, marginTop: "4px" }}>{count} {count === 1 ? "pendência" : "pendências"} em aberto</div>}
        {clear && <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "4px" }}>Nenhuma multa pendente.</div>}
      </div>
      {!clear && (
        <button onClick={onPay} style={{
          height: "44px", border: "none", borderRadius: "var(--radius-md)",
          background: "#fff", color: "var(--color-primary)",
          fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)",
          fontFamily: "var(--font-sans)", cursor: "pointer",
        }}>{payLabel}</button>
      )}
    </div>
  );
}
