import React from "react";

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  /** Count badge (e.g. pending fines). */
  badge?: number | string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/** Navigation row for the sidebar. Active = purple fill + purple bold text. */
export function SidebarItem(props: SidebarItemProps): JSX.Element;
