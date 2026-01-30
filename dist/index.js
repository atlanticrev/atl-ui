import { jsx, jsxs } from 'react/jsx-runtime';

// src/button/Button.tsx
function Button({ variant = "primary", className, ...props }) {
  const base = "ui-button";
  const variantClass = `${base}--${variant}`;
  const classes = className ? `${base} ${variantClass} ${className}` : `${base} ${variantClass}`;
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: classes,
      ...props
    }
  );
}
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "ui-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ui-modal__backdrop",
            onClick: onClose
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "ui-modal__content", children: [
          title ? /* @__PURE__ */ jsx("h2", { className: "ui-modal__title", children: title }) : null,
          /* @__PURE__ */ jsx("div", { className: "ui-modal__body", children }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "ui-modal__close",
              onClick: onClose,
              children: "Close"
            }
          )
        ] })
      ]
    }
  );
}

export { Button, Modal };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map