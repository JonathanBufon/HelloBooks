import React from "react";

/**
 * Book cover. Renders an image when `src` is given, otherwise a tasteful
 * generated spine (gradient + título) for catálogos sem imagem.
 */
export function BookCover({ title = "", author = "", src, width = 64, ratio = 1.45, style = {} }) {
  const height = Math.round(width * ratio);
  // Deterministic hue from the title so each book gets a stable color.
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % 360;
  const hue = (h % 60) + 250; // keep within violet/indigo family

  if (src) {
    return <img src={src} alt={title} style={{ width, height, objectFit: "cover", borderRadius: "8px", boxShadow: "var(--shadow-sm)", ...style }} />;
  }
  return (
    <div style={{
      width, height, flexShrink: 0, borderRadius: "8px", overflow: "hidden",
      background: `linear-gradient(150deg, hsl(${hue} 70% 42%), hsl(${hue + 20} 65% 56%))`,
      boxShadow: "var(--shadow-sm)", position: "relative",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      padding: width > 56 ? "8px" : "5px",
      ...style,
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "5px", background: "rgba(0,0,0,.22)" }} />
      <div style={{ fontSize: width > 56 ? "10px" : "8px", fontWeight: 700, color: "#fff", lineHeight: 1.15, letterSpacing: ".01em", textShadow: "0 1px 2px rgba(0,0,0,.3)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{title}</div>
      {author && width > 56 && <div style={{ fontSize: "8px", color: "rgba(255,255,255,.8)", marginTop: "2px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{author}</div>}
    </div>
  );
}
