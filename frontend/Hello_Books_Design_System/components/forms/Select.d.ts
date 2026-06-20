import React from "react";

export interface SelectOption { value: string; label: string; }

export interface SelectProps {
  label?: string;
  value?: string;
  options: (SelectOption | string)[];
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

/** Dropdown select styled to match Hello Books fields. */
export function Select(props: SelectProps): JSX.Element;
