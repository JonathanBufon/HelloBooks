import React from "react";

export interface AvatarProps {
  name?: string;
  /** Image URL; falls back to initials. */
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  style?: React.CSSProperties;
}

/** Round avatar — image or initials on light purple. */
export function Avatar(props: AvatarProps): JSX.Element;
