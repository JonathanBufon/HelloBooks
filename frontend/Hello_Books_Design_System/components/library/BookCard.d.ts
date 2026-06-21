import React from "react";

export interface BookData {
  title: string;
  author?: string;
  status?: string;
  category?: string;
  available?: number;
  copies?: number;
  coverSrc?: string;
}

/**
 * @startingPoint section="Library" subtitle="Card de livro do catálogo" viewport="320x300"
 */
export interface BookCardProps {
  book: BookData;
  actionLabel?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}

/**
 * Catalog book card — cover, title, author, status, category, availability, action.
 */
export function BookCard(props: BookCardProps): JSX.Element;
