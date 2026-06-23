import React from "react";

export interface ToastProps {
  tone?: "success" | "danger" | "warning" | "info";
  title?: React.ReactNode;
  message?: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
}

/** Toast notification — short feedback message with semantic icon. */
export function Toast(props: ToastProps): JSX.Element;
