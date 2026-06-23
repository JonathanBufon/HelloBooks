import React from "react";

/**
 * Operational data table. columns=[{key,label,align,width,render}], rows=[{...}].
 * Cabeçalho azul-claro uppercase; linhas altas com hover roxo claro.
 */
export function DataTable({ columns = [], rows = [], rowKey = "id", onRowClick, emptyText = "Nenhum registro encontrado.", style = {} }) {
  const [hover, setHover] = React.useState(-1);
  return (
    <div style={{
      border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)",
      overflow: "hidden", background: "var(--color-surface)", ...style,
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
        <thead>
          <tr style={{ background: "var(--color-surface-soft)" }}>
            {columns.map((c) => (
              <th key={c.key} style={{
                textAlign: c.align || "left",
                padding: "14px 20px",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-bold)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-label)",
                color: "#7A7F91",
                width: c.width,
                whiteSpace: "nowrap",
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: "40px", textAlign: "center", color: "var(--color-text-soft)" }}>{emptyText}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={row[rowKey] ?? i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{
                borderTop: "1px solid var(--color-border)",
                background: hover === i ? "var(--color-primary-50)" : "transparent",
                cursor: onRowClick ? "pointer" : "default",
                transition: "background .12s ease",
              }}>
              {columns.map((c) => (
                <td key={c.key} style={{
                  textAlign: c.align || "left",
                  padding: "16px 20px",
                  height: "64px",
                  color: "var(--color-text)",
                  verticalAlign: "middle",
                }}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
