import React from "react";

export interface SidebarUser {
  name: string;
  role: string;
  avatar?: string;
}

/**
 * @startingPoint section="Navigation" subtitle="Sidebar fixa do Hello Books" viewport="300x640"
 */
export interface SidebarProps {
  /** Library subtitle under the brand name. */
  subtitle?: string;
  /** SidebarItem nodes. */
  children?: React.ReactNode;
  /** Logged-in user card at the bottom. */
  user?: SidebarUser;
  style?: React.CSSProperties;
}

/**
 * Fixed left navigation shell: brand, nav items, user card.
 */
export function Sidebar(props: SidebarProps): JSX.Element;
