import React from "react";
import { Avatar } from "../data/Avatar.jsx";
import { StatusBadge } from "../data/StatusBadge.jsx";

/** Member hero card: foto, nome, ID, tipo, membro desde, nível de leitura, status. */
export function MemberProfileCard({ member = {}, actions, style = {} }) {
  const { name, id, type, since, level, status = "Ativo", avatar } = member;
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-md)",
      padding: "28px",
      display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap",
      ...style,
    }}>
      <Avatar name={name} src={avatar} size="xl" />
      <div style={{ flex: 1, minWidth: "200px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--weight-extrabold)", color: "var(--color-text)" }}>{name}</h2>
          <StatusBadge status={status} />
        </div>
        <div style={{ display: "flex", gap: "20px", marginTop: "12px", flexWrap: "wrap" }}>
          {[["ID", id], ["Tipo", type], ["Membro desde", since], ["Nível", level]].filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "var(--tracking-label)", color: "var(--color-text-soft)", fontWeight: "var(--weight-bold)" }}>{k}</div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginTop: "3px" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      {actions && <div style={{ display: "flex", gap: "10px" }}>{actions}</div>}
    </div>
  );
}
