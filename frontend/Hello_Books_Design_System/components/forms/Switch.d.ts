import React from "react";

export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
  /** Called with the next boolean value. */
  onChange?: (checked: boolean) => void;
}

/** Toggle switch — purple when on. For policy/setting flags. */
export function Switch(props: SwitchProps): JSX.Element;
