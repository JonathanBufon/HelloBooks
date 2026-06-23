import React from "react";

export interface CardProps {
  children?: React.ReactNode;
  padding?: string | number;
  elevation?: "none" | "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned action slot (button, link). */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

/** White surface card — base container for content blocks. */
export function Card(props: CardProps): JSX.Element;
/** Card title row with optional subtitle and action slot. */
export function CardHeader(props: CardHeaderProps): JSX.Element;
