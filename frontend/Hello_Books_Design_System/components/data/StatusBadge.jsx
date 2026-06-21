import React from "react";
import { Badge } from "./Badge.jsx";

/** Maps a Hello Books status string (livro/membro/empréstimo) to the right tone. */
const STATUS_TONE = {
  // Livro
  "Disponível": "success", "Emprestado": "warning", "Reservado": "primary",
  "Manutenção": "info", "Perdido": "danger", "Descartado": "neutral",
  // Membro
  "Ativo": "success", "Suspenso": "warning", "Inadimplente": "danger",
  "Inativo": "neutral", "Bloqueado": "danger",
  // Empréstimo
  "Atrasado": "danger", "Devolvido": "success", "Renovado": "primary",
  "Cancelado": "neutral", "Regularizado": "success", "Pendente": "warning",
};

export function StatusBadge({ status, dot = true, style = {} }) {
  const tone = STATUS_TONE[status] || "neutral";
  return <Badge tone={tone} dot={dot} style={style}>{status}</Badge>;
}
