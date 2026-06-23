import React from "react";

export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/** Checkbox with label — purple when checked. */
export function Checkbox(props: CheckboxProps): JSX.Element;
