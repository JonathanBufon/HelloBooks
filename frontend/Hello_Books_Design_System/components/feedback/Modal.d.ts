import React from "react";

export interface ModalProps {
  open?: boolean;
  title: React.ReactNode;
  /** Short description below the title. */
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Footer actions slot (buttons). */
  footer?: React.ReactNode;
  onClose?: () => void;
  width?: number;
  /** Red title for destructive confirmations. */
  danger?: boolean;
}

/** Centered modal dialog with title, body and footer actions. */
export function Modal(props: ModalProps): JSX.Element;
