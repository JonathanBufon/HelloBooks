import React from "react";

/**
 * @startingPoint section="Data" subtitle="Card de métrica para dashboard" viewport="700x200"
 */
export interface MetricCardProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  /** Variation label e.g. "+12%". */
  delta?: string;
  deltaTone?: "success" | "warning" | "danger";
  /** Icon chip color. */
  tone?: "primary" | "success" | "warning" | "danger" | "info";
  style?: React.CSSProperties;
}

/**
 * Dashboard metric card — icon chip, big number, label, optional delta.
 */
export function MetricCard(props: MetricCardProps): JSX.Element;
