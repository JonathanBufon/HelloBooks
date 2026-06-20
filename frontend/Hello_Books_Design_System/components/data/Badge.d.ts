import React from "react";

export interface BadgeProps {
  children?: React.ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
  /** Show a colored leading dot. */
  dot?: boolean;
  style?: React.CSSProperties;
}

/** Pill badge for status labels. */
export function Badge(props: BadgeProps): JSX.Element;
