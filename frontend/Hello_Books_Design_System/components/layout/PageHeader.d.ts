import React from "react";

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Breadcrumb trail, last item is current page. */
  breadcrumb?: string[];
  /** Right-aligned action slot. */
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Page title row with optional breadcrumb and actions. */
export function PageHeader(props: PageHeaderProps): JSX.Element;
