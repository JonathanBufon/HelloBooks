import React from "react";

/**
 * @startingPoint section="Actions" subtitle="Botões primário, secundário e perigo" viewport="700x180"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** Height: sm 36px / md 44px / lg 52px. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Trailing icon node. */
  iconRight?: React.ReactNode;
  disabled?: boolean;
  /** Stretch to container width. */
  full?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Primary action button for Hello Books. Use verbos de ação no rótulo
 * ("Cadastrar Livro", "Registrar Empréstimo").
 */
export function Button(props: ButtonProps): JSX.Element;
