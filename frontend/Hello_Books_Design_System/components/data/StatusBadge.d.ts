import React from "react";

export interface StatusBadgeProps {
  /** pt-BR status string for livro, membro or empréstimo. */
  status: string;
  dot?: boolean;
  style?: React.CSSProperties;
}

/** Status badge that auto-picks tone from a Hello Books domain status. */
export function StatusBadge(props: StatusBadgeProps): JSX.Element;
