import React from "react";

/**
 * Square icon-only button. Provide aria-label (icons sem texto, a11y §27.4).
 */
export function IconButton({
  children,
  size = "md",
  variant = "ghost",
  disabled = false,
  active = false,
  style = {},
  "aria-label": ariaLabel,
  ...rest
}) {
  const dims = { sm: 32, md: 40, lg: 44 };
  const [hover, setHover] = React.useState(false);

  const variants = {
    ghost: {
      background: active ? "var(--color-primary-100)" : "transparent",
      color: active ? "var(--color-primary)" : "var(--color-text-muted)",
      border: "1px solid transparent",
    },
    outline: {
      background: "var(--color-surface)",
      color: "var(--color-text-muted)",
      border: "1px solid var(--color-border-strong)",
    },
  };

  const hoverStyle = !disabled && hover
    ? { background: "var(--color-primary-50)", color: "var(--color-primary)" }
    : {};

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dims[size],
        height: dims[size],
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background .15s ease, color .15s ease",
        ...variants[variant],
        ...hoverStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
