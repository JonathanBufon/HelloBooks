import React from "react";

export interface MemberData {
  name: string;
  id?: string;
  type?: string;
  since?: string;
  level?: string;
  status?: string;
  avatar?: string;
}

export interface MemberProfileCardProps {
  member: MemberData;
  /** Right-aligned action buttons. */
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Member hero card — avatar, name, ID, type, since, reading level, status. */
export function MemberProfileCard(props: MemberProfileCardProps): JSX.Element;
