/* Lucide icon helper for the Hello Books UI kit.
   Renders a single Lucide icon by name. Requires lucide UMD loaded globally. */
function Icon({ name, size = 20, color, strokeWidth = 2, style = {} }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = "";
    const el = document.createElement("i");
    el.setAttribute("data-lucide", name);
    ref.current.appendChild(el);
    window.lucide.createIcons({
      attrs: { width: size, height: size, "stroke-width": strokeWidth },
    });
  }, [name, size, strokeWidth]);
  return <span ref={ref} style={{ display: "inline-flex", color, ...style }} />;
}

window.Icon = Icon;
