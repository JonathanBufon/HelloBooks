import React from "react";

export interface TopbarUser { name: string; role: string; avatar?: string; }

export interface TopbarProps {
  searchPlaceholder?: string;
  /** Show red dot on the bell. @default true */
  hasNotifications?: boolean;
  user?: TopbarUser;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Extra nodes before the icon cluster. */
  right?: React.ReactNode;
  style?: React.CSSProperties;
}

/** App top bar — global search, notifications, help, user. */
export function Topbar(props: TopbarProps): JSX.Element;
