import React from "react";

export interface FineSummaryCardProps {
  /** Formatted amount, e.g. "R$ 24,00". */
  amount?: string;
  /** Number of open fines. 0 renders the "Em dia" clear state. */
  count?: number;
  label?: string;
  payLabel?: string;
  onPay?: () => void;
  style?: React.CSSProperties;
}

/** Fine summary highlight card — purple gradient when fines are due, clear card when paid. */
export function FineSummaryCard(props: FineSummaryCardProps): JSX.Element;
