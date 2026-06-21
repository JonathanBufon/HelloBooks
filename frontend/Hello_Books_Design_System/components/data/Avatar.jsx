import React from "react";

const SIZES = { sm: 32, md: 40, lg: 48, xl: 64 };

/** Avatar — imagem ou iniciais sobre roxo claro. */
export function Avatar({ name = "", src, size = "md", style = {} }) {
  const dim = SIZES[size] || SIZES.md;
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: dim, height: dim, flexShrink: 0,
      borderRadius: "var(--radius-full)", overflow: "hidden",
      background: "var(--color-primary-100)", color: "var(--color-primary)",
      fontSize: dim * 0.38, fontWeight: "var(--weight-bold)",
      ...style,
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initials}
    </span>
  );
}
