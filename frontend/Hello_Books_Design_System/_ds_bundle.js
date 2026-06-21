/* @ds-bundle: {"format":3,"namespace":"HelloBooksDesignSystem_5c47c8","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"MetricCard","sourcePath":"components/data/MetricCard.jsx"},{"name":"StatusBadge","sourcePath":"components/data/StatusBadge.jsx"},{"name":"Tag","sourcePath":"components/data/Tag.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"SearchInput","sourcePath":"components/forms/SearchInput.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"CardHeader","sourcePath":"components/layout/Card.jsx"},{"name":"PageHeader","sourcePath":"components/layout/PageHeader.jsx"},{"name":"BookCard","sourcePath":"components/library/BookCard.jsx"},{"name":"BookCover","sourcePath":"components/library/BookCover.jsx"},{"name":"FineSummaryCard","sourcePath":"components/library/FineSummaryCard.jsx"},{"name":"MemberProfileCard","sourcePath":"components/library/MemberProfileCard.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"SidebarItem","sourcePath":"components/navigation/SidebarItem.jsx"},{"name":"Topbar","sourcePath":"components/navigation/Topbar.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"d84708cd9e53","components/actions/IconButton.jsx":"900c53ddf27b","components/data/Avatar.jsx":"c41df97f5805","components/data/Badge.jsx":"be7cec11dc32","components/data/DataTable.jsx":"8f717e820438","components/data/MetricCard.jsx":"6d4f34c018f3","components/data/StatusBadge.jsx":"0322d0aec8e4","components/data/Tag.jsx":"4fbaa350cc1c","components/feedback/Modal.jsx":"da8c9a83d554","components/feedback/Toast.jsx":"967272669d5b","components/forms/Checkbox.jsx":"4eed0b0bbcbf","components/forms/SearchInput.jsx":"2885f1aafaea","components/forms/Select.jsx":"cde89040d1e4","components/forms/Switch.jsx":"68e9174fe1cb","components/forms/TextInput.jsx":"e9a3eea94586","components/forms/Textarea.jsx":"547137e3420d","components/layout/Card.jsx":"f15bb4ea661b","components/layout/PageHeader.jsx":"0755c2ffabe9","components/library/BookCard.jsx":"3bcb19cf4237","components/library/BookCover.jsx":"5612389bc3dc","components/library/FineSummaryCard.jsx":"d4c75e8e3c5c","components/library/MemberProfileCard.jsx":"1fca1d90714b","components/navigation/Sidebar.jsx":"7dc8f578beb4","components/navigation/SidebarItem.jsx":"b0c238d7b14c","components/navigation/Topbar.jsx":"0efaaa4d990f","ui_kits/hellobooks/AppShell.jsx":"67abdb7d1283","ui_kits/hellobooks/CatalogScreen.jsx":"e1ef73adf4ed","ui_kits/hellobooks/CirculationScreen.jsx":"9a97a6c6dd7e","ui_kits/hellobooks/DashboardScreen.jsx":"e3038e521af6","ui_kits/hellobooks/LoginScreen.jsx":"a935e0f48f24","ui_kits/hellobooks/MemberProfileScreen.jsx":"977713ee6467","ui_kits/hellobooks/icons.jsx":"427bbd041d10"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HelloBooksDesignSystem_5c47c8 = window.HelloBooksDesignSystem_5c47c8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Hello Books primary action button.
 * Variants: primary (gradient roxo), secondary (branco/roxo outline),
 * danger (texto vermelho), ghost. Sizes: sm 36 / md 44 / lg 52.
 */
function Button({
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
  const heights = {
    sm: 36,
    md: 44,
    lg: 52
  };
  const pads = {
    sm: "0 14px",
    md: "0 18px",
    lg: "0 24px"
  };
  const fontSizes = {
    sm: "var(--text-sm)",
    md: "var(--text-sm)",
    lg: "var(--text-base)"
  };
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
    whiteSpace: "nowrap"
  };
  const variants = {
    primary: {
      background: "var(--gradient-primary)",
      color: "var(--color-text-on-primary)",
      boxShadow: "var(--shadow-sm)"
    },
    secondary: {
      background: "var(--color-surface)",
      color: "var(--color-primary)",
      border: "1px solid var(--color-primary-300)"
    },
    danger: {
      background: "var(--color-surface)",
      color: "var(--color-danger)",
      border: "1px solid var(--color-danger-border)"
    },
    ghost: {
      background: "transparent",
      color: "var(--color-text-muted)"
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? variant === "primary" ? {
    filter: "brightness(1.06)"
  } : variant === "ghost" ? {
    background: "var(--color-primary-50)",
    color: "var(--color-primary)"
  } : {
    background: "var(--color-primary-50)"
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...style
    }
  }, rest), icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Square icon-only button. Provide aria-label (icons sem texto, a11y §27.4).
 */
function IconButton({
  children,
  size = "md",
  variant = "ghost",
  disabled = false,
  active = false,
  style = {},
  "aria-label": ariaLabel,
  ...rest
}) {
  const dims = {
    sm: 32,
    md: 40,
    lg: 44
  };
  const [hover, setHover] = React.useState(false);
  const variants = {
    ghost: {
      background: active ? "var(--color-primary-100)" : "transparent",
      color: active ? "var(--color-primary)" : "var(--color-text-muted)",
      border: "1px solid transparent"
    },
    outline: {
      background: "var(--color-surface)",
      color: "var(--color-text-muted)",
      border: "1px solid var(--color-border-strong)"
    }
  };
  const hoverStyle = !disabled && hover ? {
    background: "var(--color-primary-50)",
    color: "var(--color-primary)"
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/Avatar.jsx
try { (() => {
const SIZES = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64
};

/** Avatar — imagem ou iniciais sobre roxo claro. */
function Avatar({
  name = "",
  src,
  size = "md",
  style = {}
}) {
  const dim = SIZES[size] || SIZES.md;
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: dim,
      height: dim,
      flexShrink: 0,
      borderRadius: "var(--radius-full)",
      overflow: "hidden",
      background: "var(--color-primary-100)",
      color: "var(--color-primary)",
      fontSize: dim * 0.38,
      fontWeight: "var(--weight-bold)",
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: "var(--color-surface-soft)",
    fg: "var(--color-text-muted)"
  },
  primary: {
    bg: "var(--color-primary-100)",
    fg: "var(--color-primary)"
  },
  success: {
    bg: "var(--color-success-bg)",
    fg: "var(--color-success)"
  },
  warning: {
    bg: "var(--color-warning-bg)",
    fg: "var(--color-warning)"
  },
  danger: {
    bg: "var(--color-danger-bg)",
    fg: "var(--color-danger)"
  },
  info: {
    bg: "var(--color-info-bg)",
    fg: "var(--color-info)"
  }
};

/** Pill badge for status. dot=true mostra ponto colorido à esquerda. */
function Badge({
  children,
  tone = "neutral",
  dot = false,
  style = {}
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-bold)",
      lineHeight: 1.4,
      color: t.fg,
      background: t.bg,
      borderRadius: "var(--radius-full)",
      whiteSpace: "nowrap",
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: t.fg
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
/**
 * Operational data table. columns=[{key,label,align,width,render}], rows=[{...}].
 * Cabeçalho azul-claro uppercase; linhas altas com hover roxo claro.
 */
function DataTable({
  columns = [],
  rows = [],
  rowKey = "id",
  onRowClick,
  emptyText = "Nenhum registro encontrado.",
  style = {}
}) {
  const [hover, setHover] = React.useState(-1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      background: "var(--color-surface)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "var(--text-sm)"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: "var(--color-surface-soft)"
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || "left",
      padding: "14px 20px",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-bold)",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "#7A7F91",
      width: c.width,
      whiteSpace: "nowrap"
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    style: {
      padding: "40px",
      textAlign: "center",
      color: "var(--color-text-soft)"
    }
  }, emptyText)) : rows.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: row[rowKey] ?? i,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    onClick: onRowClick ? () => onRowClick(row) : undefined,
    style: {
      borderTop: "1px solid var(--color-border)",
      background: hover === i ? "var(--color-primary-50)" : "transparent",
      cursor: onRowClick ? "pointer" : "default",
      transition: "background .12s ease"
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      textAlign: c.align || "left",
      padding: "16px 20px",
      height: "64px",
      color: "var(--color-text)",
      verticalAlign: "middle"
    }
  }, c.render ? c.render(row[c.key], row) : row[c.key])))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/MetricCard.jsx
try { (() => {
/** Dashboard metric card. Ícone, label, número, variação opcional. */
function MetricCard({
  icon,
  label,
  value,
  delta,
  deltaTone = "success",
  tone = "primary",
  style = {}
}) {
  const tones = {
    primary: {
      bg: "var(--color-primary-100)",
      fg: "var(--color-primary)"
    },
    success: {
      bg: "var(--color-success-bg)",
      fg: "var(--color-success)"
    },
    warning: {
      bg: "var(--color-warning-bg)",
      fg: "var(--color-warning)"
    },
    danger: {
      bg: "var(--color-danger-bg)",
      fg: "var(--color-danger)"
    },
    info: {
      bg: "var(--color-info-bg)",
      fg: "var(--color-info)"
    }
  };
  const t = tones[tone] || tones.primary;
  const deltaColor = deltaTone === "danger" ? "var(--color-danger)" : deltaTone === "warning" ? "var(--color-warning)" : "var(--color-success)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-md)",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "44px",
      height: "44px",
      borderRadius: "var(--radius-md)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: t.bg,
      color: t.fg
    }
  }, icon), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-bold)",
      color: deltaColor
    }
  }, delta)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-3xl)",
      fontWeight: "var(--weight-extrabold)",
      color: "var(--color-text)",
      lineHeight: 1.1,
      letterSpacing: "var(--tracking-tight)"
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--color-text-muted)",
      marginTop: "4px",
      fontWeight: "var(--weight-medium)"
    }
  }, label)));
}
Object.assign(__ds_scope, { MetricCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MetricCard.jsx", error: String((e && e.message) || e) }); }

// components/data/StatusBadge.jsx
try { (() => {
/** Maps a Hello Books status string (livro/membro/empréstimo) to the right tone. */
const STATUS_TONE = {
  // Livro
  "Disponível": "success",
  "Emprestado": "warning",
  "Reservado": "primary",
  "Manutenção": "info",
  "Perdido": "danger",
  "Descartado": "neutral",
  // Membro
  "Ativo": "success",
  "Suspenso": "warning",
  "Inadimplente": "danger",
  "Inativo": "neutral",
  "Bloqueado": "danger",
  // Empréstimo
  "Atrasado": "danger",
  "Devolvido": "success",
  "Renovado": "primary",
  "Cancelado": "neutral",
  "Regularizado": "success",
  "Pendente": "warning"
};
function StatusBadge({
  status,
  dot = true,
  style = {}
}) {
  const tone = STATUS_TONE[status] || "neutral";
  return /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: tone,
    dot: dot,
    style: style
  }, status);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/data/Tag.jsx
try { (() => {
/** Category/classification tag. Estilo chip roxo claro com #. */
function Tag({
  children,
  hash = true,
  onRemove,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px",
      fontSize: "var(--text-xs)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--color-primary)",
      background: "var(--color-primary-100)",
      borderRadius: "var(--radius-sm)",
      whiteSpace: "nowrap",
      ...style
    }
  }, hash && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6
    }
  }, "#"), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Remover tag",
    style: {
      border: "none",
      background: "transparent",
      color: "var(--color-primary)",
      cursor: "pointer",
      padding: 0,
      display: "inline-flex",
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
/** Centered modal dialog. title, descrição curta, conteúdo, ações no rodapé. */
function Modal({
  open = true,
  title,
  description,
  children,
  footer,
  onClose,
  width = 520,
  danger = false
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "rgba(17, 24, 39, 0.4)",
      backdropFilter: "blur(2px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true",
    style: {
      width: "100%",
      maxWidth: width,
      background: "var(--color-surface)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-lg)",
      padding: "28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "16px",
      marginBottom: description ? "8px" : "20px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-xl)",
      fontWeight: "var(--weight-bold)",
      color: danger ? "var(--color-danger)" : "var(--color-text)"
    }
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fechar",
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--color-text-soft)",
      padding: "2px",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })))), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 20px",
      fontSize: "var(--text-sm)",
      color: "var(--color-text-muted)",
      lineHeight: 1.5
    }
  }, description), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: footer ? "24px" : 0
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TONES = {
  success: {
    fg: "var(--color-success)",
    bg: "var(--color-success-bg)"
  },
  danger: {
    fg: "var(--color-danger)",
    bg: "var(--color-danger-bg)"
  },
  warning: {
    fg: "var(--color-warning)",
    bg: "var(--color-warning-bg)"
  },
  info: {
    fg: "var(--color-info)",
    bg: "var(--color-info-bg)"
  }
};
const ICONS = {
  success: /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }),
  danger: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "9",
    x2: "9",
    y2: "15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "9",
    x2: "15",
    y2: "15"
  })),
  warning: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "9",
    x2: "12",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
  })),
  info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12.01",
    y2: "8"
  }))
};

/** Toast notification. Mensagem curta de feedback. */
function Toast({
  tone = "success",
  title,
  message,
  onClose,
  style = {}
}) {
  const t = TONES[tone] || TONES.success;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      minWidth: "300px",
      maxWidth: "420px",
      padding: "14px 16px",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-lg)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "32px",
      height: "32px",
      flexShrink: 0,
      borderRadius: "var(--radius-md)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: t.bg,
      color: t.fg
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, ICONS[tone])), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-bold)",
      color: "var(--color-text)"
    }
  }, title), message && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--color-text-muted)",
      marginTop: title ? "2px" : 0
    }
  }, message)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fechar",
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--color-text-soft)",
      padding: "2px",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Checkbox with label. Roxo quando marcado. */
function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  id,
  style = {}
}) {
  const inputId = id || (label ? `cb-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontSize: "var(--text-sm)",
      color: "var(--color-text)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "20px",
      height: "20px",
      flexShrink: 0,
      borderRadius: "6px",
      border: checked ? "none" : "1px solid var(--color-border-strong)",
      background: checked ? "var(--color-primary)" : "var(--color-surface)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background .15s ease, border-color .15s ease"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), /*#__PURE__*/React.createElement("input", {
    id: inputId,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Global search field for the topbar. Lupa à esquerda. */
function SearchInput({
  value,
  placeholder = "Buscar catálogo, membros ou ISBN...",
  onChange,
  width = "100%",
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width,
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      position: "absolute",
      left: "16px",
      pointerEvents: "none"
    },
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-text-soft)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })), /*#__PURE__*/React.createElement("input", _extends({
    type: "search",
    value: value,
    placeholder: placeholder,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: "46px",
      padding: "0 16px 0 46px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--color-text)",
      background: "var(--color-surface-soft)",
      border: `1px solid ${focus ? "var(--color-primary)" : "var(--color-border)"}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      boxShadow: focus ? "0 0 0 3px var(--focus-ring)" : "none",
      transition: "border-color .15s ease, box-shadow .15s ease"
    }
  }, rest)));
}
Object.assign(__ds_scope, { SearchInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Native select styled as Hello Books field. Use `options` = [{value,label}] ou strings. */
function Select({
  label,
  value,
  options = [],
  placeholder = "Selecione…",
  hint,
  error,
  disabled = false,
  required = false,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `sel-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--color-danger)" : focus ? "var(--color-primary)" : "var(--color-border-strong)";
  const opts = options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--color-text)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-danger)"
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: inputId,
    value: value,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: "48px",
      padding: "0 40px 0 16px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      color: value ? "var(--color-text)" : "var(--color-text-soft)",
      background: disabled ? "#F1F2F7" : "var(--color-surface-soft)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      appearance: "none",
      WebkitAppearance: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: focus && !error ? "0 0 0 3px var(--focus-ring)" : "none",
      transition: "border-color .15s ease, box-shadow .15s ease"
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: "absolute",
      right: "16px",
      pointerEvents: "none"
    },
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--color-text-soft)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }))), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--color-danger)",
      fontWeight: 500
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--color-text-soft)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Toggle switch. Roxo quando ligado. */
function Switch({
  label,
  checked = false,
  onChange,
  disabled = false,
  id,
  style = {}
}) {
  const inputId = id || (label ? `sw-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "12px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontSize: "var(--text-sm)",
      color: "var(--color-text)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: "44px",
      height: "26px",
      flexShrink: 0,
      position: "relative",
      borderRadius: "999px",
      background: checked ? "var(--color-primary)" : "var(--color-border-strong)",
      transition: "background .2s ease"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "3px",
      left: checked ? "21px" : "3px",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,.2)",
      transition: "left .2s ease"
    }
  })), /*#__PURE__*/React.createElement("input", {
    id: inputId,
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Labeled text field. Label acima, erro abaixo (DESIGN.md §14).
 * Altura 48px, foco com borda roxa e halo suave.
 */
function TextInput({
  label,
  value,
  placeholder,
  type = "text",
  hint,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  icon = null,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `tf-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--color-danger)" : focus ? "var(--color-primary)" : "var(--color-border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--color-text)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-danger)"
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "14px",
      display: "inline-flex",
      color: "var(--color-text-soft)",
      pointerEvents: "none"
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    readOnly: readOnly,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: "48px",
      padding: icon ? "0 16px 0 42px" : "0 16px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      color: "var(--color-text)",
      background: readOnly ? "#F1F2F7" : disabled ? "#F1F2F7" : "var(--color-surface-soft)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "text",
      boxShadow: focus && !error ? "0 0 0 3px var(--focus-ring)" : "none",
      transition: "border-color .15s ease, box-shadow .15s ease"
    }
  }, rest))), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--color-danger)",
      fontWeight: 500
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--color-text-soft)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multi-line text field. Mesma linguagem visual do TextInput. */
function Textarea({
  label,
  value,
  placeholder,
  hint,
  error,
  rows = 4,
  disabled = false,
  required = false,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `ta-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const borderColor = error ? "var(--color-danger)" : focus ? "var(--color-primary)" : "var(--color-border-strong)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--color-text)"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-danger)"
    }
  }, " *")), /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    rows: rows,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      padding: "14px 16px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-base)",
      lineHeight: "var(--leading-normal)",
      color: "var(--color-text)",
      background: disabled ? "#F1F2F7" : "var(--color-surface-soft)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      outline: "none",
      resize: "vertical",
      boxShadow: focus && !error ? "0 0 0 3px var(--focus-ring)" : "none",
      transition: "border-color .15s ease, box-shadow .15s ease"
    }
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--color-danger)",
      fontWeight: 500
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--color-text-soft)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** White surface card. Padding 24–32, raio 20, sombra suave. */
function Card({
  children,
  padding = "var(--card-pad)",
  elevation = "md",
  style = {},
  ...rest
}) {
  const shadows = {
    none: "none",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-xl)",
      boxShadow: shadows[elevation],
      padding,
      ...style
    }
  }, rest), children);
}

/** Optional card header with title + optional action slot. */
function CardHeader({
  title,
  subtitle,
  action,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "16px",
      marginBottom: "20px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "var(--text-lg)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--color-text)"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "var(--text-sm)",
      color: "var(--color-text-muted)"
    }
  }, subtitle)), action);
}
Object.assign(__ds_scope, { Card, CardHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/PageHeader.jsx
try { (() => {
/** Page title row. Breadcrumb opcional acima, ações à direita. */
function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "var(--section-gap)",
      ...style
    }
  }, breadcrumb && /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "10px",
      fontSize: "var(--text-sm)",
      color: "var(--color-text-soft)"
    }
  }, breadcrumb.map((b, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.5
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: i === breadcrumb.length - 1 ? "var(--color-text-muted)" : "var(--color-text-soft)"
    }
  }, b)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "20px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      fontWeight: "var(--weight-extrabold)",
      color: "var(--color-text)",
      letterSpacing: "var(--tracking-tight)"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      fontSize: "var(--text-base)",
      color: "var(--color-text-muted)"
    }
  }, subtitle)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      alignItems: "center"
    }
  }, actions)));
}
Object.assign(__ds_scope, { PageHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/PageHeader.jsx", error: String((e && e.message) || e) }); }

// components/library/BookCover.jsx
try { (() => {
/**
 * Book cover. Renders an image when `src` is given, otherwise a tasteful
 * generated spine (gradient + título) for catálogos sem imagem.
 */
function BookCover({
  title = "",
  author = "",
  src,
  width = 64,
  ratio = 1.45,
  style = {}
}) {
  const height = Math.round(width * ratio);
  // Deterministic hue from the title so each book gets a stable color.
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % 360;
  const hue = h % 60 + 250; // keep within violet/indigo family

  if (src) {
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: title,
      style: {
        width,
        height,
        objectFit: "cover",
        borderRadius: "8px",
        boxShadow: "var(--shadow-sm)",
        ...style
      }
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      flexShrink: 0,
      borderRadius: "8px",
      overflow: "hidden",
      background: `linear-gradient(150deg, hsl(${hue} 70% 42%), hsl(${hue + 20} 65% 56%))`,
      boxShadow: "var(--shadow-sm)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: width > 56 ? "8px" : "5px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "5px",
      background: "rgba(0,0,0,.22)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: width > 56 ? "10px" : "8px",
      fontWeight: 700,
      color: "#fff",
      lineHeight: 1.15,
      letterSpacing: ".01em",
      textShadow: "0 1px 2px rgba(0,0,0,.3)",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical"
    }
  }, title), author && width > 56 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "8px",
      color: "rgba(255,255,255,.8)",
      marginTop: "2px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    }
  }, author));
}
Object.assign(__ds_scope, { BookCover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/library/BookCover.jsx", error: String((e && e.message) || e) }); }

// components/library/BookCard.jsx
try { (() => {
/** Catalog book card: capa, título, autor, status, categoria, disponíveis, ação. */
function BookCard({
  book = {},
  onAction,
  actionLabel = "Ver Detalhes",
  style = {}
}) {
  const {
    title,
    author,
    status = "Disponível",
    category,
    available,
    copies,
    coverSrc
  } = book;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-md)",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BookCover, {
    title: title,
    author: author,
    src: coverSrc,
    width: 66
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-base)",
      fontWeight: "var(--weight-bold)",
      color: "var(--color-text)",
      lineHeight: 1.25
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--color-text-muted)"
    }
  }, author), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "2px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    status: status
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "var(--text-xs)",
      color: "var(--color-text-soft)",
      borderTop: "1px solid var(--color-border)",
      paddingTop: "12px"
    }
  }, /*#__PURE__*/React.createElement("span", null, category), available != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--weight-semibold)",
      color: "var(--color-text-muted)"
    }
  }, available, copies != null ? `/${copies}` : "", " dispon\xEDveis")), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    full: true,
    onClick: onAction
  }, actionLabel));
}
Object.assign(__ds_scope, { BookCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/library/BookCard.jsx", error: String((e && e.message) || e) }); }

// components/library/FineSummaryCard.jsx
try { (() => {
/**
 * Fine summary highlight card — um dos poucos lugares onde o gradiente roxo
 * pinta o card inteiro (DESIGN.md §16.3). Para multas pendentes.
 */
function FineSummaryCard({
  amount = "R$ 0,00",
  count = 0,
  label = "Multas Pendentes",
  onPay,
  payLabel = "Registrar Pagamento",
  style = {}
}) {
  const clear = count === 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "var(--radius-2xl)",
      padding: "26px",
      color: clear ? "var(--color-text)" : "#fff",
      background: clear ? "var(--color-surface)" : "var(--gradient-primary)",
      border: clear ? "1px solid var(--color-border)" : "none",
      boxShadow: clear ? "var(--shadow-sm)" : "var(--shadow-lg)",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      opacity: clear ? 0.7 : 0.85
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      width: "40px",
      height: "40px",
      borderRadius: "var(--radius-md)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: clear ? "var(--color-success-bg)" : "rgba(255,255,255,.18)",
      color: clear ? "var(--color-success)" : "#fff"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12.01",
    y2: "16"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-3xl)",
      fontWeight: "var(--weight-extrabold)",
      lineHeight: 1.05,
      letterSpacing: "var(--tracking-tight)"
    }
  }, clear ? "Em dia" : amount), !clear && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      opacity: 0.85,
      marginTop: "4px"
    }
  }, count, " ", count === 1 ? "pendência" : "pendências", " em aberto"), clear && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--color-text-muted)",
      marginTop: "4px"
    }
  }, "Nenhuma multa pendente.")), !clear && /*#__PURE__*/React.createElement("button", {
    onClick: onPay,
    style: {
      height: "44px",
      border: "none",
      borderRadius: "var(--radius-md)",
      background: "#fff",
      color: "var(--color-primary)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-bold)",
      fontFamily: "var(--font-sans)",
      cursor: "pointer"
    }
  }, payLabel));
}
Object.assign(__ds_scope, { FineSummaryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/library/FineSummaryCard.jsx", error: String((e && e.message) || e) }); }

// components/library/MemberProfileCard.jsx
try { (() => {
/** Member hero card: foto, nome, ID, tipo, membro desde, nível de leitura, status. */
function MemberProfileCard({
  member = {},
  actions,
  style = {}
}) {
  const {
    name,
    id,
    type,
    since,
    level,
    status = "Ativo",
    avatar
  } = member;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: "var(--shadow-md)",
      padding: "28px",
      display: "flex",
      alignItems: "center",
      gap: "22px",
      flexWrap: "wrap",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    src: avatar,
    size: "xl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: "200px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-xl)",
      fontWeight: "var(--weight-extrabold)",
      color: "var(--color-text)"
    }
  }, name), /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    status: status
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "20px",
      marginTop: "12px",
      flexWrap: "wrap"
    }
  }, [["ID", id], ["Tipo", type], ["Membro desde", since], ["Nível", level]].filter(([, v]) => v).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)",
      color: "var(--color-text-soft)",
      fontWeight: "var(--weight-bold)"
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--color-text)",
      marginTop: "3px"
    }
  }, v))))), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px"
    }
  }, actions));
}
Object.assign(__ds_scope, { MemberProfileCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/library/MemberProfileCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
/**
 * Fixed left navigation shell. Logo + nome + subtítulo no topo,
 * navegação no meio, card de usuário no rodapé.
 * children = SidebarItem nodes.
 */
function Sidebar({
  subtitle = "Academic Management",
  children,
  user,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: "var(--sidebar-width)",
      flexShrink: 0,
      height: "100%",
      background: "var(--color-surface)",
      borderRight: "1px solid var(--color-border)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 18px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "0 8px 22px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "42px",
      height: "42px",
      borderRadius: "12px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--gradient-primary)",
      color: "#fff",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-lg)",
      fontWeight: "var(--weight-extrabold)",
      color: "var(--color-text)"
    }
  }, "Hello Books"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: "var(--color-text-soft)",
      fontWeight: "var(--weight-medium)"
    }
  }, subtitle))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      flex: 1,
      overflowY: "auto"
    }
  }, children), user && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px",
      padding: "12px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "var(--color-primary-50)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: user.name,
    src: user.avatar,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.3,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-bold)",
      color: "var(--color-text)",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden"
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: "var(--color-text-soft)",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden"
    }
  }, user.role))));
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarItem.jsx
try { (() => {
/** A navigation row inside the sidebar. Estado ativo: fundo roxo claro, texto roxo, peso 700. */
function SidebarItem({
  icon,
  label,
  active = false,
  badge,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      width: "100%",
      padding: "11px 14px",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: "var(--radius-md)",
      background: active ? "var(--color-primary-100)" : hover ? "var(--color-primary-50)" : "transparent",
      color: active ? "var(--color-primary)" : "var(--color-text-muted)",
      fontSize: "var(--text-sm)",
      fontWeight: active ? "var(--weight-bold)" : "var(--weight-medium)",
      fontFamily: "var(--font-sans)",
      transition: "background .12s ease, color .12s ease",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: "20px",
      height: "20px",
      padding: "0 6px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: "var(--weight-bold)",
      borderRadius: "999px",
      background: active ? "var(--color-primary)" : "var(--color-danger)",
      color: "#fff"
    }
  }, badge));
}
Object.assign(__ds_scope, { SidebarItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Topbar.jsx
try { (() => {
/** Top bar: busca global, notificações, ajuda, avatar. */
function Topbar({
  searchPlaceholder,
  hasNotifications = true,
  user,
  onSearch,
  right,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--topbar-height)",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "0 var(--content-pad)",
      background: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: "460px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SearchInput, {
    placeholder: searchPlaceholder,
    onChange: onSearch
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }
  }, right, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    variant: "ghost",
    "aria-label": "Notifica\xE7\xF5es"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.3 21a1.94 1.94 0 0 0 3.4 0"
  }))), hasNotifications && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "8px",
      right: "8px",
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "var(--color-danger)",
      border: "2px solid var(--color-surface)"
    }
  })), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    variant: "ghost",
    "aria-label": "Ajuda"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
  }))), user && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginLeft: "6px",
      paddingLeft: "12px",
      borderLeft: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: user.name,
    src: user.avatar,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-bold)",
      color: "var(--color-text)"
    }
  }, user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: "var(--color-text-soft)"
    }
  }, user.role)))));
}
Object.assign(__ds_scope, { Topbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Topbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/hellobooks/AppShell.jsx
try { (() => {
/* AppShell — sidebar + topbar + scrollable main, composing DS primitives. */
const {
  Sidebar,
  SidebarItem,
  Topbar
} = window.HelloBooksDesignSystem_5c47c8;
const NAV = [["Dashboard", "layout-grid"], ["Catálogo", "book-open"], ["Membros", "users"], ["Circulação", "arrow-left-right"], ["Relatórios", "bar-chart-3"], ["Multas", "alert-circle"], ["Configurações", "settings"]];
const CURRENT_USER = {
  name: "Marina Costa",
  role: "Head Librarian"
};
function AppShell({
  active,
  onNavigate,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100%",
      background: "var(--color-bg)"
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    subtitle: "Central Library",
    user: CURRENT_USER,
    style: {
      height: "100%"
    }
  }, NAV.map(([label, icon]) => /*#__PURE__*/React.createElement(SidebarItem, {
    key: label,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18
    }),
    label: label,
    active: active === label,
    badge: label === "Multas" ? 4 : undefined,
    onClick: () => onNavigate && onNavigate(label)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(Topbar, {
    searchPlaceholder: "Buscar cat\xE1logo, membros ou ISBN...",
    user: CURRENT_USER
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "var(--content-pad)"
    }
  }, children)));
}
window.AppShell = AppShell;
window.CURRENT_USER = CURRENT_USER;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/hellobooks/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/hellobooks/CatalogScreen.jsx
try { (() => {
/* CatalogScreen — filtros + grade de livros + tabela. */
const {
  PageHeader: CPageHeader,
  Button: CButton,
  BookCard: CBookCard,
  Card: CCard,
  SearchInput: CSearchInput,
  Select: CSelect,
  IconButton: CIconButton,
  DataTable: CDataTable,
  StatusBadge: CStatusBadge,
  BookCover: CBookCover,
  Modal: CModal,
  TextInput: CTextInput
} = window.HelloBooksDesignSystem_5c47c8;
const BOOKS = [{
  title: "Dom Casmurro",
  author: "Machado de Assis",
  status: "Disponível",
  category: "Ficção",
  available: 3,
  copies: 5
}, {
  title: "Sapiens",
  author: "Yuval Noah Harari",
  status: "Emprestado",
  category: "História",
  available: 0,
  copies: 4
}, {
  title: "1984",
  author: "George Orwell",
  status: "Disponível",
  category: "Ficção",
  available: 2,
  copies: 6
}, {
  title: "O Cortiço",
  author: "Aluísio Azevedo",
  status: "Reservado",
  category: "Ficção",
  available: 1,
  copies: 3
}, {
  title: "Cosmos",
  author: "Carl Sagan",
  status: "Manutenção",
  category: "Ciência",
  available: 0,
  copies: 2
}, {
  title: "A Revolução dos Bichos",
  author: "George Orwell",
  status: "Disponível",
  category: "Ficção",
  available: 4,
  copies: 4
}];
function CatalogScreen() {
  const [view, setView] = React.useState("grid");
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CPageHeader, {
    title: "Cat\xE1logo",
    subtitle: "Consulta e manuten\xE7\xE3o do acervo",
    breadcrumb: ["Início", "Catálogo"],
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CButton, {
      variant: "secondary",
      size: "md",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "download",
        size: 18
      })
    }, "Importar Metadados"), /*#__PURE__*/React.createElement(CButton, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 18
      }),
      onClick: () => setOpen(true)
    }, "Cadastrar Livro"))
  }), /*#__PURE__*/React.createElement(CCard, {
    padding: "18px",
    style: {
      marginBottom: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: "240px"
    }
  }, /*#__PURE__*/React.createElement(CSearchInput, {
    placeholder: "Buscar por t\xEDtulo, autor ou ISBN..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "180px"
    }
  }, /*#__PURE__*/React.createElement(CSelect, {
    options: ["Todas categorias", "Ficção", "História", "Ciência"],
    value: "Todas categorias",
    placeholder: ""
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "160px"
    }
  }, /*#__PURE__*/React.createElement(CSelect, {
    options: ["Todos status", "Disponível", "Emprestado", "Reservado"],
    value: "Todos status",
    placeholder: ""
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "4px",
      background: "var(--color-surface-soft)",
      padding: "4px",
      borderRadius: "var(--radius-md)"
    }
  }, /*#__PURE__*/React.createElement(CIconButton, {
    variant: view === "grid" ? "outline" : "ghost",
    active: view === "grid",
    "aria-label": "Grade",
    onClick: () => setView("grid")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layout-grid",
    size: 18
  })), /*#__PURE__*/React.createElement(CIconButton, {
    variant: view === "table" ? "outline" : "ghost",
    active: view === "table",
    "aria-label": "Tabela",
    onClick: () => setView("table")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "list",
    size: 18
  }))))), view === "grid" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: "18px"
    }
  }, BOOKS.map(b => /*#__PURE__*/React.createElement(CBookCard, {
    key: b.title,
    book: b,
    actionLabel: "Ver Detalhes"
  }))) : /*#__PURE__*/React.createElement(CDataTable, {
    columns: [{
      key: "cover",
      label: "Capa",
      width: "64px",
      render: (_, r) => /*#__PURE__*/React.createElement(CBookCover, {
        title: r.title,
        author: r.author,
        width: 36
      })
    }, {
      key: "title",
      label: "Título",
      render: (v, r) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 700
        }
      }, v), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: "12px",
          color: "var(--color-text-soft)"
        }
      }, r.author))
    }, {
      key: "category",
      label: "Categoria"
    }, {
      key: "status",
      label: "Status",
      render: v => /*#__PURE__*/React.createElement(CStatusBadge, {
        status: v
      })
    }, {
      key: "available",
      label: "Exemplares",
      align: "center",
      render: (v, r) => `${v}/${r.copies}`
    }, {
      key: "acoes",
      label: "Ações",
      align: "right",
      render: () => /*#__PURE__*/React.createElement(CButton, {
        size: "sm",
        variant: "ghost"
      }, "Ver")
    }],
    rows: BOOKS.map((b, i) => ({
      id: i,
      ...b
    }))
  }), open && /*#__PURE__*/React.createElement(CModal, {
    title: "Cadastrar Livro",
    description: "Preencha os dados bibliogr\xE1ficos do exemplar.",
    width: 560,
    onClose: () => setOpen(false),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CButton, {
      variant: "secondary",
      onClick: () => setOpen(false)
    }, "Cancelar"), /*#__PURE__*/React.createElement(CButton, {
      variant: "primary",
      onClick: () => setOpen(false)
    }, "Cadastrar Livro"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(CTextInput, {
    label: "T\xEDtulo da obra",
    placeholder: "Ex.: Mem\xF3rias P\xF3stumas",
    required: true
  })), /*#__PURE__*/React.createElement(CTextInput, {
    label: "Autor principal",
    placeholder: "Ex.: Machado de Assis",
    required: true
  }), /*#__PURE__*/React.createElement(CTextInput, {
    label: "ISBN-13",
    placeholder: "978-...",
    required: true
  }), /*#__PURE__*/React.createElement(CSelect, {
    label: "Categoria",
    options: ["Ficção", "História", "Ciência", "Referência"],
    value: ""
  }), /*#__PURE__*/React.createElement(CTextInput, {
    label: "N\xBA de exemplares",
    type: "number",
    placeholder: "1"
  }))));
}
window.CatalogScreen = CatalogScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/hellobooks/CatalogScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/hellobooks/CirculationScreen.jsx
try { (() => {
/* CirculationScreen — ações rápidas, filtros e tabela de empréstimos. */
const {
  PageHeader: KPageHeader,
  Button: KButton,
  Card: KCard,
  DataTable: KDataTable,
  StatusBadge: KStatusBadge,
  BookCover: KBookCover,
  Avatar: KAvatar,
  Select: KSelect,
  SearchInput: KSearchInput,
  Toast: KToast
} = window.HelloBooksDesignSystem_5c47c8;
const LOANS = [{
  id: 1,
  title: "Dom Casmurro",
  author: "Machado de Assis",
  member: "João Reis",
  retirada: "28 mai",
  venc: "12 jun",
  status: "Atrasado",
  fine: "R$ 12,00"
}, {
  id: 2,
  title: "Sapiens",
  author: "Yuval Noah Harari",
  member: "Ana Lima",
  retirada: "06 jun",
  venc: "20 jun",
  status: "Ativo",
  fine: "—"
}, {
  id: 3,
  title: "1984",
  author: "George Orwell",
  member: "Marina Costa",
  retirada: "01 jun",
  venc: "15 jun",
  status: "Devolvido",
  fine: "—"
}, {
  id: 4,
  title: "Cosmos",
  author: "Carl Sagan",
  member: "Pedro Sá",
  retirada: "10 jun",
  venc: "24 jun",
  status: "Renovado",
  fine: "—"
}, {
  id: 5,
  title: "O Cortiço",
  author: "Aluísio Azevedo",
  member: "Lucas Dias",
  retirada: "22 mai",
  venc: "05 jun",
  status: "Atrasado",
  fine: "R$ 18,00"
}];
function CirculationScreen() {
  const [toast, setToast] = React.useState(false);
  const quick = [["clipboard-list", "Registrar Empréstimo", "primary"], ["rotate-ccw", "Processar Devolução", "secondary"], ["refresh-cw", "Renovar Empréstimo", "secondary"], ["bookmark", "Criar Reserva", "secondary"]];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KPageHeader, {
    title: "Circula\xE7\xE3o",
    subtitle: "Fluxo operacional de empr\xE9stimos e devolu\xE7\xF5es",
    breadcrumb: ["Início", "Circulação"]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "14px",
      marginBottom: "var(--section-gap)"
    }
  }, quick.map(([icon, label, variant]) => /*#__PURE__*/React.createElement(KButton, {
    key: label,
    variant: variant,
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18
    }),
    onClick: () => variant === "primary" && setToast(true),
    style: {
      justifyContent: "flex-start"
    }
  }, label))), /*#__PURE__*/React.createElement(KCard, {
    padding: "18px",
    style: {
      marginBottom: "18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: "240px"
    }
  }, /*#__PURE__*/React.createElement(KSearchInput, {
    placeholder: "Buscar por livro ou membro..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "180px"
    }
  }, /*#__PURE__*/React.createElement(KSelect, {
    options: ["Todos status", "Ativo", "Atrasado", "Devolvido", "Renovado"],
    value: "Todos status",
    placeholder: ""
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "160px"
    }
  }, /*#__PURE__*/React.createElement(KSelect, {
    options: ["Este mês", "Últimos 7 dias", "Hoje"],
    value: "Este m\xEAs",
    placeholder: ""
  })))), /*#__PURE__*/React.createElement(KDataTable, {
    columns: [{
      key: "title",
      label: "Livro",
      render: (v, r) => /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }
      }, /*#__PURE__*/React.createElement(KBookCover, {
        title: v,
        author: r.author,
        width: 32
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 700
        }
      }, v), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: "12px",
          color: "var(--color-text-soft)"
        }
      }, r.author)))
    }, {
      key: "member",
      label: "Membro",
      render: v => /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }
      }, /*#__PURE__*/React.createElement(KAvatar, {
        name: v,
        size: "sm"
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, v))
    }, {
      key: "retirada",
      label: "Retirada"
    }, {
      key: "venc",
      label: "Vencimento"
    }, {
      key: "status",
      label: "Status",
      render: v => /*#__PURE__*/React.createElement(KStatusBadge, {
        status: v
      })
    }, {
      key: "fine",
      label: "Multa",
      render: v => /*#__PURE__*/React.createElement("span", {
        style: {
          color: v === "—" ? "var(--color-text-soft)" : "var(--color-danger)",
          fontWeight: v === "—" ? 400 : 700
        }
      }, v)
    }, {
      key: "acoes",
      label: "Ações",
      align: "right",
      render: (_, r) => /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: "6px",
          justifyContent: "flex-end"
        }
      }, /*#__PURE__*/React.createElement(KButton, {
        size: "sm",
        variant: "ghost"
      }, "Renovar"), /*#__PURE__*/React.createElement(KButton, {
        size: "sm",
        variant: "secondary"
      }, "Devolver"))
    }],
    rows: LOANS
  }), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 2000
    }
  }, /*#__PURE__*/React.createElement(KToast, {
    tone: "success",
    title: "Empr\xE9stimo registrado.",
    message: "O exemplar foi marcado como emprestado.",
    onClose: () => setToast(false)
  })));
}
window.CirculationScreen = CirculationScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/hellobooks/CirculationScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/hellobooks/DashboardScreen.jsx
try { (() => {
/* DashboardScreen — métricas, tendência semanal, atividade, ações rápidas. */
const {
  PageHeader: DPageHeader,
  MetricCard: DMetricCard,
  Card: DCard,
  CardHeader: DCardHeader,
  Button: DButton,
  Avatar: DAvatar,
  StatusBadge: DStatusBadge
} = window.HelloBooksDesignSystem_5c47c8;
function WeeklyTrends() {
  const data = [["Seg", 62], ["Ter", 78], ["Qua", 54], ["Qui", 88], ["Sex", 95], ["Sáb", 40], ["Dom", 28]];
  const max = 100;
  return /*#__PURE__*/React.createElement(DCard, {
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(DCardHeader, {
    title: "Tend\xEAncia Semanal de Empr\xE9stimos",
    subtitle: "\xDAltimos 7 dias"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: "16px",
      height: "180px",
      padding: "0 4px"
    }
  }, data.map(([day, v]) => /*#__PURE__*/React.createElement("div", {
    key: day,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      height: "100%",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      fontWeight: 700,
      color: "var(--color-text-muted)"
    }
  }, v), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: "38px",
      height: `${v / max * 100}%`,
      borderRadius: "8px 8px 4px 4px",
      background: v >= 88 ? "var(--gradient-primary)" : "var(--color-primary-100)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      color: "var(--color-text-soft)",
      fontWeight: 600
    }
  }, day)))));
}
function QuickActions({
  onNavigate
}) {
  const actions = [["clipboard-list", "Registrar Empréstimo"], ["rotate-ccw", "Processar Devolução"], ["book-plus", "Cadastrar Livro"], ["user-plus", "Cadastrar Membro"]];
  return /*#__PURE__*/React.createElement(DCard, {
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(DCardHeader, {
    title: "A\xE7\xF5es R\xE1pidas"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px"
    }
  }, actions.map(([icon, label]) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: () => onNavigate && onNavigate("Circulação"),
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      alignItems: "flex-start",
      padding: "16px",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      background: "var(--color-surface-soft)",
      cursor: "pointer",
      textAlign: "left",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "38px",
      height: "38px",
      borderRadius: "10px",
      background: "var(--color-primary-100)",
      color: "var(--color-primary)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      fontWeight: 700,
      color: "var(--color-text)"
    }
  }, label)))));
}
function RecentActivity() {
  const items = [["arrow-left-right", "Empréstimo registrado", "Sapiens · Ana Lima", "há 4 min", "primary"], ["rotate-ccw", "Devolução processada", "1984 · João Reis", "há 22 min", "success"], ["alert-circle", "Multa aplicada", "Dom Casmurro · Marina Costa", "há 1 h", "danger"], ["book-plus", "Livro cadastrado", "O Cortiço · 4 exemplares", "há 2 h", "info"]];
  const tones = {
    primary: ["var(--color-primary-100)", "var(--color-primary)"],
    success: ["var(--color-success-bg)", "var(--color-success)"],
    danger: ["var(--color-danger-bg)", "var(--color-danger)"],
    info: ["var(--color-info-bg)", "var(--color-info)"]
  };
  return /*#__PURE__*/React.createElement(DCard, {
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(DCardHeader, {
    title: "Atividade Recente",
    action: /*#__PURE__*/React.createElement(DButton, {
      variant: "ghost",
      size: "sm"
    }, "Ver tudo")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "4px"
    }
  }, items.map(([icon, title, sub, time, tone], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "12px 0",
      borderTop: i ? "1px solid var(--color-border)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "38px",
      height: "38px",
      flexShrink: 0,
      borderRadius: "10px",
      background: tones[tone][0],
      color: tones[tone][1],
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "14px",
      fontWeight: 700,
      color: "var(--color-text)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      color: "var(--color-text-muted)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "12px",
      color: "var(--color-text-soft)",
      whiteSpace: "nowrap"
    }
  }, time)))));
}
function DashboardScreen({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DPageHeader, {
    title: "Dashboard",
    subtitle: "Situa\xE7\xE3o operacional da biblioteca",
    actions: /*#__PURE__*/React.createElement(DButton, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 18
      }),
      onClick: () => onNavigate && onNavigate("Circulação")
    }, "Registrar Empr\xE9stimo")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "18px",
      marginBottom: "var(--section-gap)"
    }
  }, /*#__PURE__*/React.createElement(DMetricCard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "book",
      size: 22
    }),
    label: "Total de Livros",
    value: "12.480",
    delta: "+3%"
  }), /*#__PURE__*/React.createElement(DMetricCard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left-right",
      size: 22
    }),
    label: "Empr\xE9stimos Ativos",
    value: "842",
    tone: "info",
    delta: "+12"
  }), /*#__PURE__*/React.createElement(DMetricCard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "alert-circle",
      size: 22
    }),
    label: "Devolu\xE7\xF5es Atrasadas",
    value: "38",
    tone: "danger",
    delta: "+5",
    deltaTone: "danger"
  }), /*#__PURE__*/React.createElement(DMetricCard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 22
    }),
    label: "Novos Membros",
    value: "64",
    tone: "success",
    delta: "+8%"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: "18px",
      marginBottom: "18px"
    }
  }, /*#__PURE__*/React.createElement(WeeklyTrends, null), /*#__PURE__*/React.createElement(QuickActions, {
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "18px"
    }
  }, /*#__PURE__*/React.createElement(RecentActivity, null), /*#__PURE__*/React.createElement(NewAcquisitions, null)));
}
function NewAcquisitions() {
  const {
    BookCover: NBookCover
  } = window.HelloBooksDesignSystem_5c47c8;
  const books = [["O Cortiço", "Aluísio Azevedo"], ["A Hora da Estrela", "Clarice Lispector"], ["Vidas Secas", "Graciliano Ramos"], ["Grande Sertão", "Guimarães Rosa"]];
  return /*#__PURE__*/React.createElement(DCard, {
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(DCardHeader, {
    title: "Novas Aquisi\xE7\xF5es",
    action: /*#__PURE__*/React.createElement(DButton, {
      variant: "ghost",
      size: "sm"
    }, "Ver acervo")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "16px"
    }
  }, books.map(([t, a]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      alignItems: "center",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(NBookCover, {
    title: t,
    author: a,
    width: 72
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      fontWeight: 700,
      color: "var(--color-text)",
      lineHeight: 1.2
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: "var(--color-text-soft)"
    }
  }, a)))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/hellobooks/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/hellobooks/LoginScreen.jsx
try { (() => {
/* LoginScreen — two columns: institutional purple panel + access form. */
const {
  Button: HBButton,
  TextInput: HBTextInput,
  Checkbox: HBCheckbox
} = window.HelloBooksDesignSystem_5c47c8;
function LoginScreen({
  onLogin
}) {
  const features = [["book-open", "Catálogo Digital"], ["users", "Gestão de Membros"], ["arrow-left-right", "Controle de Empréstimos"], ["bar-chart-3", "Relatórios"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100%",
      background: "var(--color-bg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 0",
      background: "var(--gradient-primary)",
      color: "#fff",
      padding: "56px 52px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mono.svg",
    width: "46",
    height: "46",
    alt: "Hello Books"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.15
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "20px",
      fontWeight: 800
    }
  }, "Hello Books"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "13px",
      opacity: 0.8
    }
  }, "Central Library"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: "34px",
      fontWeight: 800,
      lineHeight: 1.2,
      margin: "0 0 16px",
      letterSpacing: "-0.01em",
      maxWidth: "440px"
    }
  }, "A plataforma inteligente para gest\xE3o de bibliotecas modernas e centros de conhecimento."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      maxWidth: "440px",
      marginTop: "28px"
    }
  }, features.map(([icon, label]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      background: "rgba(255,255,255,.12)",
      borderRadius: "var(--radius-lg)",
      padding: "14px 16px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "14px",
      fontWeight: 600
    }
  }, label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "12px",
      opacity: 0.7
    }
  }, "\xA9 2026 Hello Books \xB7 Academic Management")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: "380px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "26px",
      fontWeight: 800,
      color: "var(--color-text)",
      margin: "0 0 6px"
    }
  }, "Acessar o sistema"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "15px",
      color: "var(--color-text-muted)",
      margin: "0 0 28px"
    }
  }, "Entre com suas credenciais institucionais."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "18px"
    }
  }, /*#__PURE__*/React.createElement(HBTextInput, {
    label: "E-mail",
    type: "email",
    placeholder: "marina@biblioteca.edu",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 18
    }),
    defaultValue: "marina@biblioteca.edu"
  }), /*#__PURE__*/React.createElement(HBTextInput, {
    label: "Senha",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 18
    }),
    defaultValue: "senha123"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(HBCheckbox, {
    label: "Lembrar de mim",
    checked: true
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: "13px",
      color: "var(--color-primary)",
      fontWeight: 600,
      textDecoration: "none"
    }
  }, "Esqueci minha senha")), /*#__PURE__*/React.createElement(HBButton, {
    variant: "primary",
    size: "lg",
    full: true,
    onClick: onLogin
  }, "Entrar no Sistema")))));
}
window.LoginScreen = LoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/hellobooks/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/hellobooks/MemberProfileScreen.jsx
try { (() => {
/* MemberProfileScreen — hero do membro, multas, métricas, info, empréstimos ativos. */
const {
  PageHeader: MPageHeader,
  MemberProfileCard: MMemberCard,
  FineSummaryCard: MFineCard,
  MetricCard: MMetricCard,
  Card: MCard,
  CardHeader: MCardHeader,
  Button: MButton,
  DataTable: MDataTable,
  StatusBadge: MStatusBadge,
  BookCover: MBookCover
} = window.HelloBooksDesignSystem_5c47c8;
const ACTIVE_LOANS = [{
  id: 1,
  title: "Sapiens",
  author: "Yuval Noah Harari",
  retirada: "06 jun",
  venc: "20 jun",
  status: "Ativo"
}, {
  id: 2,
  title: "Dom Casmurro",
  author: "Machado de Assis",
  retirada: "28 mai",
  venc: "12 jun",
  status: "Atrasado"
}, {
  id: 3,
  title: "Cosmos",
  author: "Carl Sagan",
  retirada: "10 jun",
  venc: "24 jun",
  status: "Ativo"
}];
function InfoRow({
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderTop: "1px solid var(--color-border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "13px",
      color: "var(--color-text-soft)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "14px",
      fontWeight: 600,
      color: "var(--color-text)"
    }
  }, value));
}
function MemberProfileScreen() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MPageHeader, {
    title: "Perfil do Membro",
    breadcrumb: ["Início", "Membros", "João Reis"],
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MButton, {
      variant: "secondary",
      size: "md",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "mail",
        size: 18
      })
    }, "Enviar E-mail"), /*#__PURE__*/React.createElement(MButton, {
      variant: "primary",
      size: "md",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "clipboard-list",
        size: 18
      })
    }, "Registrar Empr\xE9stimo"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "18px"
    }
  }, /*#__PURE__*/React.createElement(MMemberCard, {
    member: {
      name: "João Reis",
      id: "MB-2041",
      type: "Acadêmico",
      since: "Mar 2023",
      level: "Leitor Ávido",
      status: "Ativo"
    },
    actions: /*#__PURE__*/React.createElement(MButton, {
      variant: "secondary",
      size: "sm",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "pencil",
        size: 16
      })
    }, "Editar Perfil")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: "18px",
      marginBottom: "18px"
    }
  }, /*#__PURE__*/React.createElement(MMetricCard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left-right",
      size: 22
    }),
    label: "Empr\xE9stimos Ativos",
    value: "3",
    tone: "info"
  }), /*#__PURE__*/React.createElement(MMetricCard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "book-check",
      size: 22
    }),
    label: "Total de Livros Lidos",
    value: "48",
    tone: "success"
  }), /*#__PURE__*/React.createElement(MMetricCard, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 22
    }),
    label: "Devolu\xE7\xF5es no Prazo",
    value: "94%"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridRow: "span 1"
    }
  }, /*#__PURE__*/React.createElement(MFineCard, {
    amount: "R$ 12,00",
    count: 1
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1.6fr",
      gap: "18px"
    }
  }, /*#__PURE__*/React.createElement(MCard, null, /*#__PURE__*/React.createElement(MCardHeader, {
    title: "Informa\xE7\xF5es Pessoais"
  }), /*#__PURE__*/React.createElement(InfoRow, {
    label: "E-mail",
    value: "joao.reis@uni.edu"
  }), /*#__PURE__*/React.createElement(InfoRow, {
    label: "Telefone",
    value: "(48) 99812-4471"
  }), /*#__PURE__*/React.createElement(InfoRow, {
    label: "Curso",
    value: "Letras"
  }), /*#__PURE__*/React.createElement(InfoRow, {
    label: "Matr\xEDcula",
    value: "2023104872"
  }), /*#__PURE__*/React.createElement(InfoRow, {
    label: "Departamento",
    value: "Humanas"
  })), /*#__PURE__*/React.createElement(MCard, null, /*#__PURE__*/React.createElement(MCardHeader, {
    title: "Empr\xE9stimos Ativos",
    action: /*#__PURE__*/React.createElement(MButton, {
      variant: "ghost",
      size: "sm"
    }, "Ver hist\xF3rico")
  }), /*#__PURE__*/React.createElement(MDataTable, {
    columns: [{
      key: "title",
      label: "Livro",
      render: (v, r) => /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }
      }, /*#__PURE__*/React.createElement(MBookCover, {
        title: v,
        author: r.author,
        width: 32
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: 700
        }
      }, v), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: "12px",
          color: "var(--color-text-soft)"
        }
      }, r.author)))
    }, {
      key: "venc",
      label: "Vencimento"
    }, {
      key: "status",
      label: "Status",
      render: v => /*#__PURE__*/React.createElement(MStatusBadge, {
        status: v
      })
    }, {
      key: "acoes",
      label: "Ações",
      align: "right",
      render: () => /*#__PURE__*/React.createElement(MButton, {
        size: "sm",
        variant: "ghost"
      }, "Renovar")
    }],
    rows: ACTIVE_LOANS
  }))));
}
window.MemberProfileScreen = MemberProfileScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/hellobooks/MemberProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/hellobooks/icons.jsx
try { (() => {
/* Lucide icon helper for the Hello Books UI kit.
   Renders a single Lucide icon by name. Requires lucide UMD loaded globally. */
function Icon({
  name,
  size = 20,
  color,
  strokeWidth = 2,
  style = {}
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = "";
    const el = document.createElement("i");
    el.setAttribute("data-lucide", name);
    ref.current.appendChild(el);
    window.lucide.createIcons({
      attrs: {
        width: size,
        height: size,
        "stroke-width": strokeWidth
      }
    });
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: "inline-flex",
      color,
      ...style
    }
  });
}
window.Icon = Icon;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/hellobooks/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.MetricCard = __ds_scope.MetricCard;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.SearchInput = __ds_scope.SearchInput;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.PageHeader = __ds_scope.PageHeader;

__ds_ns.BookCard = __ds_scope.BookCard;

__ds_ns.BookCover = __ds_scope.BookCover;

__ds_ns.FineSummaryCard = __ds_scope.FineSummaryCard;

__ds_ns.MemberProfileCard = __ds_scope.MemberProfileCard;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.SidebarItem = __ds_scope.SidebarItem;

__ds_ns.Topbar = __ds_scope.Topbar;

})();
