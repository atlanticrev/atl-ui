import { SpinnerIcon, clsx, ChevronDownIcon, useOverlayDismiss } from './chunk-JWALAQXS.js';
export { AtlAutocomplete, AtlCheckbox, AtlDropdown, AtlInput, AtlPopup, AtlRadioButton, AtlSelect, AtlSwitcher, AtlTooltip } from './chunk-JWALAQXS.js';
import { forwardRef, createContext, useId, useState, useRef, useCallback, useMemo, useContext, createElement, useEffect } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';

var AtlButton = forwardRef(
  ({ children, className, disableMotion, disabled, iconLeft, iconRight, iconSize = 24, loading = false, size = 48, type = "button", variant = "filled", ...props }, ref) => {
    const isIconOnly = !children && Boolean(iconLeft || iconRight);
    return /* @__PURE__ */ jsx(
      "button",
      {
        ...props,
        className: clsx("atl-button", `atl-button--${variant}`, `atl-button--size-${size}`, loading && "atl-button--loading", isIconOnly && "atl-button--icon-only", disableMotion && "atl-button--no-motion", className),
        disabled: disabled || loading,
        ref,
        type,
        children: /* @__PURE__ */ jsxs("span", { className: "atl-button__content", children: [
          loading ? /* @__PURE__ */ jsx(SpinnerIcon, { size: iconSize }) : iconLeft,
          children && /* @__PURE__ */ jsx("span", { className: "atl-button__label", children }),
          !loading && iconRight
        ] })
      }
    );
  }
);
AtlButton.displayName = "AtlButton";
function AtlCard({ as, className, ...props }) {
  const Component = as ?? "div";
  const classes = clsx("atl-card", className);
  return /* @__PURE__ */ jsx(
    Component,
    {
      className: classes,
      ...props
    }
  );
}
var getSelectedLabel = (files) => {
  if (files.length === 0) {
    return "";
  }
  if (files.length === 1) {
    return files[0].name;
  }
  return `${files.length} files selected`;
};
var AtlFileUpload = ({ accept, className, disabled = false, helperText, label, multiple = false, onChange, status = "default", testId }) => {
  const inputId = useId();
  const [selectedLabel, setSelectedLabel] = useState("");
  const handleChange = (event) => {
    const nextFiles = Array.from(event.target.files ?? []);
    setSelectedLabel(getSelectedLabel(nextFiles));
    onChange?.(nextFiles);
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("atl-file-upload", `atl-file-upload--${status}`, disabled && "atl-file-upload--disabled", className), "data-testid": testId, children: [
    /* @__PURE__ */ jsx("label", { className: "atl-file-upload__button", htmlFor: inputId, children: label }),
    /* @__PURE__ */ jsx("input", { accept, className: "atl-file-upload__input", disabled, id: inputId, multiple, type: "file", onChange: handleChange }),
    selectedLabel && /* @__PURE__ */ jsx("span", { className: "atl-file-upload__value", children: selectedLabel }),
    helperText && /* @__PURE__ */ jsx("span", { className: "atl-file-upload__helper", children: helperText })
  ] });
};

// src/components/progress/utils.ts
var DEFAULT_PROGRESS_MAX = 100;
var normalizeProgressMax = (max) => {
  if (Number.isFinite(max) && max > 0) {
    return max;
  }
  return DEFAULT_PROGRESS_MAX;
};
var clampProgressValue = (value, max) => {
  const numericValue = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.min(Math.max(numericValue, 0), max);
};
var getProgressPercent = (value, max) => Math.round(value / max * 100);
var INDETERMINATE_FILL_WIDTH = "38%";
var AtlProgress = ({
  ariaLabel,
  className,
  indeterminate = false,
  label,
  max = 100,
  showValue = true,
  size = "md",
  status = "default",
  testId,
  value = 0
}) => {
  const labelId = useId();
  const safeMax = normalizeProgressMax(max);
  const safeValue = clampProgressValue(value, safeMax);
  const percent = getProgressPercent(safeValue, safeMax);
  const shouldRenderValue = showValue && !indeterminate;
  const shouldRenderHeader = Boolean(label) || shouldRenderValue;
  const fillWidth = indeterminate ? INDETERMINATE_FILL_WIDTH : `${percent}%`;
  const labelledBy = label ? labelId : void 0;
  const resolvedAriaLabel = labelledBy ? void 0 : ariaLabel ?? "Progress";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "atl-progress",
        `atl-progress--${size}`,
        `atl-progress--${status}`,
        indeterminate && "atl-progress--indeterminate",
        className
      ),
      "data-testid": testId,
      children: [
        shouldRenderHeader ? /* @__PURE__ */ jsxs("div", { className: "atl-progress__header", children: [
          label ? /* @__PURE__ */ jsx("span", { className: "atl-progress__label", id: labelId, children: label }) : null,
          shouldRenderValue ? /* @__PURE__ */ jsxs("span", { className: "atl-progress__value", children: [
            percent,
            "%"
          ] }) : null
        ] }) : null,
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-label": resolvedAriaLabel,
            "aria-labelledby": labelledBy,
            "aria-valuemax": safeMax,
            "aria-valuemin": 0,
            "aria-valuenow": indeterminate ? void 0 : safeValue,
            className: "atl-progress__track",
            role: "progressbar",
            children: /* @__PURE__ */ jsx("span", { className: "atl-progress__fill", style: { width: fillWidth } })
          }
        )
      ]
    }
  );
};
var TOAST_LIMIT = 3;
var DEFAULT_DURATION = 4200;
var DEFAULT_VARIANT = "info";
var ToastContext = createContext(null);
var AtlToastCard = ({ toast, onDismiss }) => {
  const handleDismiss = () => {
    onDismiss(toast.id);
  };
  const classes = clsx("atl-toast", `atl-toast--${toast.variant}`);
  const role = toast.variant === "error" ? "alert" : "status";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-live": "polite",
      className: classes,
      role,
      children: [
        /* @__PURE__ */ jsx("span", { className: "atl-toast__message", children: toast.message }),
        /* @__PURE__ */ jsx(
          AtlButton,
          {
            "aria-label": "Dismiss",
            className: "atl-toast__dismiss",
            onClick: handleDismiss,
            variant: "text",
            type: "button",
            children: "Dismiss"
          }
        )
      ]
    }
  );
};
var AtlToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const timeoutsRef = useRef(/* @__PURE__ */ new Map());
  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);
  const enqueueToast = useCallback(
    (message, options) => {
      idRef.current += 1;
      const id = `toast-${idRef.current}`;
      const duration = options?.duration ?? DEFAULT_DURATION;
      const variant = options?.variant ?? DEFAULT_VARIANT;
      const nextToast = {
        id,
        message,
        variant,
        duration
      };
      setToasts((prev) => {
        const next = [nextToast, ...prev];
        return next.slice(0, TOAST_LIMIT);
      });
      const handleDismiss = () => {
        closeToast(id);
      };
      const timeoutId = window.setTimeout(handleDismiss, duration);
      timeoutsRef.current.set(id, timeoutId);
      return id;
    },
    [closeToast]
  );
  const value = useMemo(
    () => ({
      enqueueToast,
      closeToast
    }),
    [enqueueToast, closeToast]
  );
  const renderToast = (toast) => /* @__PURE__ */ jsx(
    AtlToastCard,
    {
      onDismiss: closeToast,
      toast
    },
    toast.id
  );
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsx("div", { className: "atl-toast-provider", children: /* @__PURE__ */ jsx("div", { className: "atl-toast-provider__stack", children: toasts.map(renderToast) }) })
  ] });
};
var useAtlToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAtlToast must be used within AtlToastProvider.");
  }
  return context;
};
var getBorderRadius = (value) => {
  if (value === void 0) {
    return "50%";
  }
  return typeof value === "number" ? `${value}px` : value;
};
var normalizeInitials = (value) => {
  return value.trim().replace(/\s+/g, "").slice(0, 3).toUpperCase();
};
var AtlAvatar = (props) => {
  const [failedImage, setFailedImage] = useState(null);
  const resolvedInitials = normalizeInitials(props.initials);
  const shouldRenderIcon = Boolean(props.icon);
  const shouldRenderImage = !shouldRenderIcon && Boolean(props.image) && failedImage !== props.image;
  const shouldShowInitials = !shouldRenderIcon && (!props.image || failedImage === props.image);
  const shouldShowLoader = !shouldRenderIcon && Boolean(props.image) && failedImage === props.image;
  const style = {
    "--atl-avatar-bg": props.backgroundColor,
    "--atl-avatar-icon-color": props.iconColor,
    "--atl-avatar-icon-scale": props.iconScale,
    "--atl-avatar-icon-size": props.iconSize,
    "--atl-avatar-image-fit": props.objectFit,
    "--atl-avatar-image-padding": props.imagePadding,
    "--atl-avatar-text-color": props.textColor,
    border: props.border ? `${props.border.width}px solid ${props.border.color}` : void 0,
    borderRadius: getBorderRadius(props.borderRadius),
    height: props.size ?? 32,
    width: props.size ?? 32
  };
  const handleImageError = () => {
    setFailedImage(props.image ?? null);
    props.onImageError?.();
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("atl-avatar", props.className), style, children: [
    shouldRenderIcon && props.icon && /* @__PURE__ */ jsx("span", { className: "atl-avatar__icon", children: /* @__PURE__ */ jsx(props.icon, {}) }),
    shouldRenderImage && /* @__PURE__ */ jsx("img", { alt: props.imageAlt ?? "", className: "atl-avatar__image", src: props.image, onError: handleImageError }),
    shouldShowInitials && /* @__PURE__ */ jsx("span", { className: "atl-avatar__initials", children: resolvedInitials }),
    shouldShowLoader && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "atl-avatar__loader" })
  ] });
};
var AtlBreadcrumbs = ({ className, items }) => {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: clsx("atl-breadcrumbs", className), children: items.map((item, index) => {
    const isLast = index === items.length - 1;
    return /* @__PURE__ */ jsxs("span", { className: "atl-breadcrumbs__item", children: [
      item.onClick && !isLast ? /* @__PURE__ */ jsx("button", { className: "atl-breadcrumbs__trigger", "data-testid": item.testId, type: "button", onClick: item.onClick, children: item.label }) : /* @__PURE__ */ jsx("span", { className: isLast ? "atl-breadcrumbs__current" : void 0, "data-testid": item.testId, children: item.label }),
      !isLast && /* @__PURE__ */ jsx(ChevronDownIcon, { size: 16, style: { transform: "rotate(-90deg)" } })
    ] }, item.testId);
  }) });
};
var CrossIcon = ({ size = 10, ...props }) => {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      "aria-hidden": "true",
      focusable: "false",
      fill: "none",
      height: size,
      viewBox: "0 0 10 10",
      width: size,
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M9 9L1 1M1 9L9 1",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeWidth: "1.5"
        }
      )
    }
  );
};
var AtlChip = ({ customColors, disabled = false, label, onRemove, size = "M", testId, variant = "default", withCross = false }) => {
  const inlineStyles = customColors ? { background: customColors.background, color: customColors.text } : void 0;
  return /* @__PURE__ */ jsxs("span", { className: clsx("atl-chip", `atl-chip--size-${size.toLowerCase()}`, `atl-chip--${variant}`, disabled && "atl-chip--disabled"), "data-testid": testId, style: inlineStyles, children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    withCross && /* @__PURE__ */ jsx("button", { className: "atl-chip__remove", disabled, type: "button", onClick: onRemove, children: /* @__PURE__ */ jsx(CrossIcon, {}) })
  ] });
};
var SidebarButton = ({ collapsed, item, onClick, selected }) => {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: clsx("atl-sidebar__item", selected && "atl-sidebar__item--selected"),
      type: "button",
      onClick: () => onClick?.(item.key),
      children: [
        item.icon,
        !collapsed && /* @__PURE__ */ jsx("span", { children: item.label })
      ]
    }
  );
};
var AtlSidebar = ({
  className,
  collapsed = false,
  footer,
  footerItems = [],
  header,
  items,
  loading = false,
  onItemClick,
  selectedKey,
  testId
}) => {
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: clsx("atl-sidebar", collapsed && "atl-sidebar--collapsed", className),
      "data-testid": testId,
      children: [
        header && /* @__PURE__ */ jsx("div", { className: "atl-sidebar__header", children: header }),
        /* @__PURE__ */ jsxs("div", { className: "atl-sidebar__group", children: [
          loading && /* @__PURE__ */ jsx("span", { className: "atl-sidebar__loading", children: "Loading\u2026" }),
          items.map((item) => /* @__PURE__ */ jsx(
            SidebarButton,
            {
              collapsed,
              item,
              onClick: onItemClick,
              selected: item.key === selectedKey
            },
            item.key
          ))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "atl-sidebar__group", children: [
          footerItems.map((item) => /* @__PURE__ */ jsx(
            SidebarButton,
            {
              collapsed,
              item,
              onClick: onItemClick,
              selected: item.key === selectedKey
            },
            item.key
          )),
          footer
        ] })
      ]
    }
  );
};
var DEFAULT_PAGE_SIZE = 10;
var resolveCellValue = (record, dataIndex) => {
  if (dataIndex === void 0) {
    return void 0;
  }
  return record[dataIndex];
};
var AtlSimpleTable = ({ ariaLabel, className, columns = [], dataSource, locale, onRow, pagination = false, rowClassName, rowKey, style }) => {
  const paginationConfig = pagination || void 0;
  const pageSize = paginationConfig?.pageSize ? paginationConfig.pageSize : DEFAULT_PAGE_SIZE;
  const currentPage = paginationConfig?.current ? paginationConfig.current : 1;
  const total = paginationConfig?.total ? paginationConfig.total : dataSource?.length ?? 0;
  const pagedData = useMemo(() => {
    if (!paginationConfig || !dataSource) {
      return dataSource ?? [];
    }
    const start = (currentPage - 1) * pageSize;
    return dataSource.slice(start, start + pageSize);
  }, [currentPage, dataSource, pageSize, paginationConfig]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return /* @__PURE__ */ jsxs("div", { className: clsx("atl-simple-table", className), style, children: [
    /* @__PURE__ */ jsxs("table", { "aria-label": ariaLabel, className: "atl-simple-table__table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((column, index) => /* @__PURE__ */ jsx("th", { style: { textAlign: column.align, width: column.width }, children: typeof column.title === "function" ? column.title({}) : column.title }, column.key ?? String(column.dataIndex ?? index))) }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        pagedData.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "atl-simple-table__empty", colSpan: Math.max(columns.length, 1), children: locale?.emptyText ?? "No data" }) }),
        pagedData.map((record, index) => {
          const resolvedKey = typeof rowKey === "function" ? rowKey(record) : typeof rowKey === "string" ? String(record[rowKey]) : String(index);
          const rowProps = onRow?.(record, index) ?? {};
          const resolvedClassName = typeof rowClassName === "function" ? rowClassName(record, index) : rowClassName;
          return /* @__PURE__ */ createElement("tr", { ...rowProps, className: resolvedClassName, key: resolvedKey }, columns.map((column, columnIndex) => {
            const value = resolveCellValue(record, column.dataIndex);
            const cell = column.render ? column.render(value, record, index) : String(value ?? "");
            return /* @__PURE__ */ jsx("td", { className: column.className, style: { textAlign: column.align }, children: cell }, column.key ?? String(column.dataIndex ?? columnIndex));
          }));
        })
      ] })
    ] }),
    paginationConfig && totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "atl-simple-table__pagination", children: [
      /* @__PURE__ */ jsx(AtlButton, { disabled: currentPage <= 1, size: 32, variant: "outlined", onClick: () => paginationConfig.onChange?.(currentPage - 1, pageSize), children: "Prev" }),
      /* @__PURE__ */ jsx(AtlButton, { disabled: currentPage >= totalPages, size: 32, variant: "outlined", onClick: () => paginationConfig.onChange?.(currentPage + 1, pageSize), children: "Next" })
    ] })
  ] });
};
var AtlTabs = ({ activeKey, className, contentClassName, items, onChange, size = 40, testId }) => {
  const activeTab = items.find((item) => item.key === activeKey);
  return /* @__PURE__ */ jsxs("div", { className: clsx("atl-tabs", className), "data-testid": testId, children: [
    /* @__PURE__ */ jsx("div", { className: "atl-tabs__list", role: "tablist", children: items.map((item) => {
      const isActive = item.key === activeKey;
      return /* @__PURE__ */ jsx("button", { "aria-selected": isActive, className: clsx("atl-tabs__tab", `atl-tabs__tab--${size}`, isActive && "atl-tabs__tab--active"), disabled: item.disabled, role: "tab", type: "button", onClick: () => onChange(item.key), children: item.label }, item.key);
    }) }),
    /* @__PURE__ */ jsx("div", { className: contentClassName, children: activeTab?.children })
  ] });
};
var CloseCircleIcon = ({ size = 24, ...props }) => {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "aria-hidden": "true",
      focusable: "false",
      fill: "none",
      height: size,
      viewBox: "0 0 24 24",
      width: size,
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "9",
            stroke: "currentColor",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M15 9L9 15M9 9L15 15",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5"
          }
        )
      ]
    }
  );
};
var FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
var useFocusTrap = ({
  enabled = true,
  rootRef
}) => {
  useEffect(() => {
    if (!enabled || !rootRef.current) {
      return;
    }
    const rootNode = rootRef.current;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableElements = Array.from(rootNode.querySelectorAll(FOCUSABLE_SELECTOR));
    const firstElement = focusableElements[0] ?? rootNode;
    const lastElement = focusableElements[focusableElements.length - 1] ?? rootNode;
    firstElement.focus();
    const handleKeyDown = (event) => {
      if (event.key !== "Tab") {
        return;
      }
      const activeElement = document.activeElement;
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }
      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    rootNode.addEventListener("keydown", handleKeyDown);
    return () => {
      rootNode.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [enabled, rootRef]);
};
var AtlModal = ({ cancelText = "Cancel", children, className, confirmText = "Confirm", confirmVariant = "filled", footer, header, isCloseHidden = false, isDisabled = false, isLoading = false, isOpen, onCancel, onClose, onConfirm, size = 520, testId, title, ...props }) => {
  const contentRef = useRef(null);
  const handleCancel = onCancel ?? onClose;
  const handleConfirm = onConfirm ?? onClose;
  useOverlayDismiss({ enabled: isOpen, onClose, refs: [contentRef] });
  useFocusTrap({ enabled: isOpen, rootRef: contentRef });
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (!isOpen) {
    return null;
  }
  return createPortal(
    /* @__PURE__ */ jsx("div", { className: "atl-modal__backdrop", "data-testid": `${testId}-backdrop`, children: /* @__PURE__ */ jsxs("div", { ...props, "aria-modal": "true", className: clsx("atl-modal", className), "data-testid": testId, ref: contentRef, role: "dialog", style: { "--atl-modal-width": `${size}px` }, children: [
      header ?? /* @__PURE__ */ jsxs("div", { className: "atl-modal__header", children: [
        title && /* @__PURE__ */ jsx("p", { className: "atl-modal__title", children: title }),
        !isCloseHidden && /* @__PURE__ */ jsx("button", { className: "atl-modal__close", type: "button", onClick: onClose, children: /* @__PURE__ */ jsx(CloseCircleIcon, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "atl-modal__body", children }),
      footer ?? /* @__PURE__ */ jsxs("div", { className: "atl-modal__footer", children: [
        /* @__PURE__ */ jsx(AtlButton, { variant: "text", onClick: handleCancel, children: cancelText }),
        /* @__PURE__ */ jsx(AtlButton, { disabled: isDisabled || isLoading, loading: isLoading, variant: confirmVariant, onClick: handleConfirm, children: confirmText })
      ] })
    ] }) }),
    document.body
  );
};

export { AtlAvatar, AtlBreadcrumbs, AtlButton, AtlCard, AtlChip, AtlFileUpload, AtlModal, AtlProgress, AtlSidebar, AtlSimpleTable, AtlTabs, AtlToastProvider, useAtlToast };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map