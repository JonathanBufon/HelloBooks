import React from "react";

export interface IconButtonProps {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline";
  active?: boolean;
  disabled?: boolean;
  "aria-label": string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Square icon-only button. Always pass aria-label. */
export function IconButton(props: IconButtonProps): JSX.Element;
