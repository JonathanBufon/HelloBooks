import React from "react";

/**
 * Hello Books primary action button.
 * Variants: primary (gradient roxo), secondary (branco/roxo outline),
 * danger (texto vermelho), ghost. Sizes: sm 36 / md 44 / lg 52.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  iconRight = null,
  disabled = false,
  full = false,
  style = {},
  ...rest
}) {
  const heights = { sm: 36, md: 44, lg: 52 };
  const pads = { sm: "0 14px", md: "0 18px", lg: "0 24px" };
  const fontSizes = { sm: "var(--text-sm)", md: "var(--text-sm)", lg: "var(--text-base)" };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    height: heights[size],
    padding: pads[size],
    fontFamily: "var(--font-sans)",
    fontSize: fontSizes[size],
    fontWeight: "var(--weight-bold)",
    lineHeight: 1,
    borderRadius: "var(--radius-md)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto",
    transition: "filter .15s ease, background .15s ease, border-color .15s ease, transform .05s ease",
    whiteSpace: "nowrap",
  };

  const variants = {
    primary: {
      background: "var(--gradient-primary)",
      color: "var(--color-text-on-primary)",
      boxShadow: "var(--shadow-sm)",
    },
    secondary: {
      background: "var(--color-surface)",
      color: "var(--color-primary)",
      border: "1px solid var(--color-primary-300)",
    },
    danger: {
      background: "var(--color-surface)",
      color: "var(--color-danger)",
      border: "1px solid var(--color-danger-border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--color-text-muted)",
    },
  };

  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover
    ? (variant === "primary"
        ? { filter: "brightness(1.06)" }
        : variant === "ghost"
          ? { background: "var(--color-primary-50)", color: "var(--color-primary)" }
          : { background: "var(--color-primary-50)" })
    : {};

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...hoverStyle, ...style }}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
