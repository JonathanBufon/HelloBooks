import React from "react";

export interface SearchInputProps {
  value?: string;
  placeholder?: string;
  width?: string | number;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/** Global search field with leading magnifier — for the topbar. */
export function SearchInput(props: SearchInputProps): JSX.Element;
