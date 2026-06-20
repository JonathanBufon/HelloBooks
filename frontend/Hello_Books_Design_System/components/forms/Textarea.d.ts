import React from "react";

export interface TextareaProps {
  label?: string;
  value?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/** Multi-line text field — same visual language as TextInput. */
export function Textarea(props: TextareaProps): JSX.Element;
