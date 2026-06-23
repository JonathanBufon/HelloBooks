import React from "react";

export interface BookCoverProps {
  title?: string;
  author?: string;
  /** Cover image URL; falls back to a generated spine. */
  src?: string;
  /** Width in px. Height derives from ratio. */
  width?: number;
  /** Height/width ratio. @default 1.45 */
  ratio?: number;
  style?: React.CSSProperties;
}

/** Book cover — image or a generated purple spine when no image. */
export function BookCover(props: BookCoverProps): JSX.Element;
