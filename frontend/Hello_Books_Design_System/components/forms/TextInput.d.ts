import React from "react";

/**
 * @startingPoint section="Forms" subtitle="Campo de texto com label e estados" viewport="700x140"
 */
export interface TextInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Error message — turns border red, replaces hint. */
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Leading icon node. */
  icon?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Labeled text field — label above, error/hint below, 48px tall.
 */
export function TextInput(props: TextInputProps): JSX.Element;
