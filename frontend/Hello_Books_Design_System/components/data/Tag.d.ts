import React from "react";

export interface TagProps {
  children?: React.ReactNode;
  /** Show leading "#". @default true */
  hash?: boolean;
  /** Show a remove button and call this. */
  onRemove?: () => void;
  style?: React.CSSProperties;
}

/** Category/classification chip (#Acadêmico, #Referência). */
export function Tag(props: TagProps): JSX.Element;
