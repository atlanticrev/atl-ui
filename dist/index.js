import { forwardRef, memo, useId, createContext, useState, useRef, useEffect, useCallback, useLayoutEffect, useMemo, useContext, createElement } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';

// src/components/button/index.tsx
var SpinnerIcon = ({ size = 16 }) => {
  return /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", className: "atl-spinner-icon", focusable: "false", fill: "none", height: size, viewBox: "0 0 16 16", width: size, xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", opacity: "0.2", r: "6", stroke: "currentColor", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M14 8a6 6 0 0 0-6-6", stroke: "currentColor", strokeLinecap: "round", strokeWidth: "2" })
  ] });
};

// src/lib/clsx.ts
function toClassName(value, classes) {
  if (!value) {
    return;
  }
  if (typeof value === "string" || typeof value === "number") {
    classes.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      toClassName(item, classes);
    }
    return;
  }
  for (const [key, isActive] of Object.entries(value)) {
    if (isActive) {
      classes.push(key);
    }
  }
}
function clsx(...values) {
  const classes = [];
  for (const value of values) {
    toClassName(value, classes);
  }
  return classes.join(" ");
}
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
var CheckIcon = ({ size = 24, ...props }) => {
  return /* @__PURE__ */ jsx(
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
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M5 12.5L9.5 17L19 7",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5"
        }
      )
    }
  );
};
var DEFAULT_MAX_HEIGHT = 212;
var AtlDropdown = ({
  className,
  emptyState,
  footerText,
  headerSlot,
  highlightedIndex = -1,
  id,
  items,
  maxHeight = DEFAULT_MAX_HEIGHT,
  multiSelect = false,
  onSelect,
  onSelectAll,
  optionIdPrefix,
  selectAllText = "Select all",
  selectedValues = [],
  showFooter = false,
  testId
}) => {
  const listRef = useRef(null);
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const showEmptyState = items.length === 0 && emptyState;
  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    const selector = highlightedIndex >= 0 ? '[data-highlighted="true"]' : '[data-selected="true"]';
    listRef.current.querySelector(selector)?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);
  const handleSelectAll = useCallback(() => onSelectAll?.(), [onSelectAll]);
  return /* @__PURE__ */ jsxs("div", { className: clsx("atl-dropdown-list", className), "data-testid": testId, children: [
    headerSlot,
    /* @__PURE__ */ jsx("div", { className: "atl-dropdown-list__main", id, role: "listbox", children: showEmptyState ? /* @__PURE__ */ jsx("div", { className: "atl-dropdown-list__empty", role: "option", tabIndex: -1, children: emptyState }) : /* @__PURE__ */ jsx("div", { className: "atl-dropdown-list__items", ref: listRef, style: { maxHeight }, children: items.map((item, index) => {
      const isSelected = selectedSet.has(item.value);
      const isHighlighted = index === highlightedIndex;
      const optionId = optionIdPrefix ? `${optionIdPrefix}-${index}` : void 0;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          "aria-disabled": item.disabled || void 0,
          "aria-selected": isSelected,
          className: clsx(
            "atl-dropdown-list__item",
            isSelected && "atl-dropdown-list__item--selected",
            isHighlighted && "atl-dropdown-list__item--highlighted",
            item.disabled && "atl-dropdown-list__item--disabled"
          ),
          "data-highlighted": isHighlighted || void 0,
          "data-selected": isSelected || void 0,
          "data-testid": `${testId}-item-${String(item.value)}`,
          id: optionId,
          role: "option",
          tabIndex: -1,
          type: "button",
          onClick: () => !item.disabled && onSelect?.(item.value),
          children: [
            item.icon && /* @__PURE__ */ jsx("span", { className: "atl-dropdown-list__item-icon", children: item.icon }),
            /* @__PURE__ */ jsxs("span", { className: "atl-dropdown-list__item-text", children: [
              /* @__PURE__ */ jsx("span", { className: "atl-dropdown-list__item-label", children: item.label }),
              item.description && /* @__PURE__ */ jsx("span", { className: "atl-dropdown-list__item-description", children: item.description })
            ] }),
            isSelected && /* @__PURE__ */ jsx("span", { className: "atl-dropdown-list__item-checkmark", children: /* @__PURE__ */ jsx(CheckIcon, { size: 24 }) })
          ]
        },
        String(item.value)
      );
    }) }) }),
    showFooter && /* @__PURE__ */ jsxs("div", { className: "atl-dropdown-list__footer", children: [
      footerText && /* @__PURE__ */ jsx("span", { className: "atl-dropdown-list__footer-text", children: footerText }),
      multiSelect && onSelectAll && /* @__PURE__ */ jsx("button", { className: "atl-dropdown-list__select-all", type: "button", onClick: handleSelectAll, children: selectAllText })
    ] })
  ] });
};
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
var AtlInputFooter = ({
  helperText,
  helperTextId,
  maxLength,
  showCharacterCount,
  status,
  value
}) => {
  const shouldShowCounter = Boolean(showCharacterCount && maxLength);
  if (!helperText && !shouldShowCounter) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "atl-input__footer", children: [
    helperText && /* @__PURE__ */ jsx(
      "span",
      {
        className: clsx(
          "atl-input__helper",
          status === "error" && "atl-input__helper--error",
          status === "success" && "atl-input__helper--success"
        ),
        id: helperTextId,
        children: helperText
      }
    ),
    shouldShowCounter && /* @__PURE__ */ jsxs("output", { "aria-atomic": "true", "aria-live": "polite", className: "atl-input__counter", children: [
      /* @__PURE__ */ jsx("span", { className: "atl-input__counter-current", children: value?.length ?? 0 }),
      /* @__PURE__ */ jsxs("span", { className: "atl-input__counter-total", children: [
        "/",
        maxLength
      ] })
    ] })
  ] });
};

// src/components/input/input-outline.utils.ts
var EMPTY_INPUT_OUTLINE_METRICS = {
  height: 0,
  radius: 0,
  width: 0
};
var DECIMAL_PRECISION = 1e3;
var clamp = (value, min, max) => Math.min(Math.max(value, min), max);
var formatSvgNumber = (value) => {
  const roundedValue = Math.round(value * DECIMAL_PRECISION) / DECIMAL_PRECISION;
  return Number.isInteger(roundedValue) ? String(roundedValue) : String(roundedValue).replace(/\.?0+$/, "");
};
var buildSharpOutlinePath = (left, top, right, bottom, gapStart, gapEnd) => {
  const hasGap = gapEnd > gapStart;
  if (!hasGap) {
    return [
      "M",
      formatSvgNumber(left),
      formatSvgNumber(top),
      "H",
      formatSvgNumber(right),
      "V",
      formatSvgNumber(bottom),
      "H",
      formatSvgNumber(left),
      "V",
      formatSvgNumber(top)
    ].join(" ");
  }
  return [
    "M",
    formatSvgNumber(left),
    formatSvgNumber(top),
    "H",
    formatSvgNumber(gapStart),
    "M",
    formatSvgNumber(gapEnd),
    formatSvgNumber(top),
    "H",
    formatSvgNumber(right),
    "V",
    formatSvgNumber(bottom),
    "H",
    formatSvgNumber(left),
    "V",
    formatSvgNumber(top)
  ].join(" ");
};
var buildRoundedOutlinePath = (left, top, right, bottom, radius, gapStart, gapEnd) => {
  const topStart = left + radius;
  const topEnd = right - radius;
  const hasGap = gapEnd > gapStart;
  const path = [
    "M",
    formatSvgNumber(topStart),
    formatSvgNumber(top),
    "H",
    formatSvgNumber(hasGap ? gapStart : topEnd)
  ];
  if (hasGap) {
    path.push(
      "M",
      formatSvgNumber(gapEnd),
      formatSvgNumber(top),
      "H",
      formatSvgNumber(topEnd)
    );
  }
  path.push(
    "A",
    formatSvgNumber(radius),
    formatSvgNumber(radius),
    "0 0 1",
    formatSvgNumber(right),
    formatSvgNumber(top + radius),
    "V",
    formatSvgNumber(bottom - radius),
    "A",
    formatSvgNumber(radius),
    formatSvgNumber(radius),
    "0 0 1",
    formatSvgNumber(right - radius),
    formatSvgNumber(bottom),
    "H",
    formatSvgNumber(left + radius),
    "A",
    formatSvgNumber(radius),
    formatSvgNumber(radius),
    "0 0 1",
    formatSvgNumber(left),
    formatSvgNumber(bottom - radius),
    "V",
    formatSvgNumber(top + radius),
    "A",
    formatSvgNumber(radius),
    formatSvgNumber(radius),
    "0 0 1",
    formatSvgNumber(left + radius),
    formatSvgNumber(top)
  );
  return path.join(" ");
};
var buildInputOutlinePath = ({
  height,
  notchStart,
  notchWidth,
  radius,
  strokeWidth,
  width
}) => {
  if (width <= strokeWidth || height <= strokeWidth) {
    return "";
  }
  const inset = strokeWidth / 2;
  const left = inset;
  const top = inset;
  const right = width - inset;
  const bottom = height - inset;
  const maxRadius = Math.min((width - strokeWidth) / 2, (height - strokeWidth) / 2);
  const normalizedRadius = clamp(radius - inset, 0, maxRadius);
  const topStart = left + normalizedRadius;
  const topEnd = right - normalizedRadius;
  const gapStart = clamp(notchStart, topStart, topEnd);
  const gapEnd = clamp(notchStart + notchWidth, gapStart, topEnd);
  if (normalizedRadius === 0) {
    return buildSharpOutlinePath(left, top, right, bottom, gapStart, gapEnd);
  }
  return buildRoundedOutlinePath(left, top, right, bottom, normalizedRadius, gapStart, gapEnd);
};
var AtlInputOutline = ({ labelOffset, labelWidth, metrics, strokeWidth }) => {
  if (!metrics.width || !metrics.height) {
    return null;
  }
  const path = buildInputOutlinePath({
    height: metrics.height,
    notchStart: labelWidth > 0 ? labelOffset : 0,
    notchWidth: labelWidth,
    radius: metrics.radius,
    strokeWidth,
    width: metrics.width
  });
  return /* @__PURE__ */ jsx(
    "svg",
    {
      "aria-hidden": "true",
      className: "atl-input__outline",
      focusable: "false",
      height: metrics.height,
      viewBox: `0 0 ${metrics.width} ${metrics.height}`,
      width: metrics.width,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          className: "atl-input__outline-path",
          d: path
        }
      )
    }
  );
};
var useClickOutside = ({
  enabled = true,
  onOutsideClick,
  refs
}) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handlePointerDown = (event) => {
      const targetNode = event.target;
      if (!(targetNode instanceof Node)) {
        return;
      }
      const isInside = refs.some((ref) => ref.current?.contains(targetNode));
      if (!isInside) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [enabled, onOutsideClick, refs]);
};
var useKeyPress = ({
  elementRef,
  enabled = true,
  key,
  onKeyPress,
  preventDefault = false
}) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;
      const matchesTarget = !elementRef?.current || activeElement === elementRef.current;
      if (!matchesTarget || event.key !== key) {
        return;
      }
      if (preventDefault) {
        event.preventDefault();
      }
      onKeyPress();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [elementRef, enabled, key, onKeyPress, preventDefault]);
};

// src/hooks/use-overlay-dismiss.ts
var useOverlayDismiss = ({
  closeOnEscape = true,
  closeOnOutsideClick = true,
  enabled = true,
  onClose,
  refs
}) => {
  useClickOutside({
    enabled: enabled && closeOnOutsideClick,
    onOutsideClick: onClose,
    refs
  });
  useKeyPress({
    enabled: enabled && closeOnEscape,
    key: "Escape",
    onKeyPress: onClose
  });
};
var useOverlayState = ({ defaultOpen = false, onOpenChange, open }) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== void 0;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = useCallback((nextOpen) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }, [isControlled, onOpenChange]);
  const openOverlay = useCallback(() => setOpen(true), [setOpen]);
  const closeOverlay = useCallback(() => setOpen(false), [setOpen]);
  const toggleOverlay = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);
  return useMemo(() => ({ closeOverlay, isOpen, openOverlay, setOpen, toggleOverlay }), [closeOverlay, isOpen, openOverlay, setOpen, toggleOverlay]);
};
var AtlTooltip = ({ children, className, defaultOpen = false, onOpenChange, open, placement = "top", testId, title, trigger = "hover" }) => {
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const overlay = useOverlayState({ defaultOpen, onOpenChange, open });
  const isClickTrigger = trigger === "click";
  const show = useCallback(() => overlay.openOverlay(), [overlay]);
  const hide = useCallback(() => overlay.closeOverlay(), [overlay]);
  const toggle = useCallback((event) => {
    event.preventDefault();
    overlay.toggleOverlay();
  }, [overlay]);
  const handleKeyDown = useCallback((event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      overlay.toggleOverlay();
    }
  }, [overlay]);
  const panel = overlay.isOpen ? /* @__PURE__ */ jsx("span", { className: clsx("atl-tooltip__panel", `atl-tooltip__panel--${placement}`), "data-testid": testId, ref: panelRef, role: "tooltip", children: title }) : null;
  useOverlayDismiss({
    closeOnEscape: isClickTrigger,
    closeOnOutsideClick: isClickTrigger,
    enabled: overlay.isOpen,
    onClose: hide,
    refs: [triggerRef, panelRef]
  });
  return /* @__PURE__ */ jsxs("button", { className: clsx("atl-tooltip", className), onBlur: isClickTrigger ? void 0 : hide, onClick: isClickTrigger ? toggle : void 0, onFocus: show, onKeyDown: isClickTrigger ? handleKeyDown : void 0, onMouseEnter: isClickTrigger ? void 0 : show, onMouseLeave: isClickTrigger ? void 0 : hide, ref: triggerRef, type: "button", children: [
    children,
    panel
  ] });
};
var AtlInputRightIcon = ({
  icon,
  iconRotated,
  onClick,
  testId,
  tooltip,
  tooltipOpen
}) => {
  const className = clsx(
    "atl-input__icon",
    "atl-input__icon--right",
    onClick && "atl-input__icon--clickable",
    iconRotated && "atl-input__icon--rotated"
  );
  const iconElement = onClick ? /* @__PURE__ */ jsx("button", { className, tabIndex: -1, type: "button", onClick, children: icon }) : /* @__PURE__ */ jsx("span", { className, children: icon });
  if (!tooltip) {
    return iconElement;
  }
  return /* @__PURE__ */ jsx(AtlTooltip, { open: tooltipOpen, placement: "top", testId: `${testId}-icon-tooltip`, title: tooltip, children: iconElement });
};
var getLabelWidth = (node) => node?.getBoundingClientRect().width ?? 0;
var getLabelOffset = (node) => node ? Number.parseFloat(getComputedStyle(node).getPropertyValue("--atl-input-label-offset")) || 0 : 0;
var getOutlineMetrics = (node) => {
  if (!node) {
    return EMPTY_INPUT_OUTLINE_METRICS;
  }
  const rect = node.getBoundingClientRect();
  const styles = getComputedStyle(node);
  return {
    height: rect.height,
    radius: Number.parseFloat(styles.borderTopLeftRadius) || 0,
    width: rect.width
  };
};
var useInputLayout = ({ onBlur, onChange, onFocus, rootRef, value }) => {
  const [internalHasValue, setInternalHasValue] = useState(value !== void 0 && value !== "");
  const [isFocused, setIsFocused] = useState(false);
  const [labelOffset, setLabelOffset] = useState(0);
  const [labelWidth, setLabelWidth] = useState(0);
  const [outlineMetrics, setOutlineMetrics] = useState(EMPTY_INPUT_OUTLINE_METRICS);
  const measureRef = useRef(null);
  const rootNodeRef = useRef(null);
  const mutableRootRef = rootRef;
  const hasValue = value !== void 0 && value !== "" || internalHasValue;
  const isLabelFloated = hasValue || isFocused;
  useEffect(() => {
    setInternalHasValue(value !== void 0 && value !== "");
  }, [value]);
  const syncLayout = useCallback(() => {
    setLabelOffset(isLabelFloated ? getLabelOffset(rootNodeRef.current) : 0);
    setLabelWidth(isLabelFloated ? getLabelWidth(measureRef.current) : 0);
    setOutlineMetrics(getOutlineMetrics(rootNodeRef.current));
  }, [isLabelFloated]);
  useLayoutEffect(() => {
    syncLayout();
  }, [syncLayout]);
  useLayoutEffect(() => {
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(syncLayout);
    if (measureRef.current) {
      observer?.observe(measureRef.current);
    }
    if (rootNodeRef.current) {
      observer?.observe(rootNodeRef.current);
    }
    return () => observer?.disconnect();
  }, [syncLayout]);
  const setRootNode = useCallback(
    (node) => {
      rootNodeRef.current = node;
      if (mutableRootRef) {
        mutableRootRef.current = node;
      }
      setOutlineMetrics(getOutlineMetrics(node));
    },
    [mutableRootRef]
  );
  const handleChange = useCallback(
    (event) => {
      setInternalHasValue(event.target.value !== "");
      onChange?.(event.target.value);
    },
    [onChange]
  );
  const handleFocus = useCallback(
    (event) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus]
  );
  const handleBlur = useCallback(
    (event) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur]
  );
  return {
    handleBlur,
    handleChange,
    handleFocus,
    isFocused,
    isLabelFloated,
    labelOffset,
    labelWidth,
    measureRef,
    outlineMetrics,
    setRootNode
  };
};
var AtlInput = memo(forwardRef(function AtlInput2({
  className,
  description,
  disabled = false,
  helperText,
  iconLeft,
  iconRight,
  iconRightRotated = false,
  iconRightTooltip,
  iconRightTooltipOpen,
  label,
  maxLength = 300,
  onBlur,
  onChange,
  onFocus,
  onIconRightClick,
  placeholder,
  readOnly = false,
  readOnlyStyled,
  rootRef,
  showCharacterCount = false,
  size = "m",
  status = "default",
  testId,
  value,
  variant = "text",
  ...rest
}, ref) {
  const generatedId = useId();
  const applyReadOnlyStyles = readOnlyStyled ?? readOnly;
  const inputMode = variant === "number" ? "decimal" : void 0;
  const inputId = testId || generatedId;
  const helperTextId = helperText ? `${inputId}-helper` : void 0;
  const descriptionId = description ? `${inputId}-description` : void 0;
  const isInvalid = status === "error";
  const describedBy = [descriptionId, helperTextId].filter(Boolean).join(" ") || void 0;
  const {
    handleBlur,
    handleChange,
    handleFocus,
    isFocused,
    isLabelFloated,
    labelOffset,
    labelWidth,
    measureRef,
    outlineMetrics,
    setRootNode
  } = useInputLayout({
    onBlur,
    onChange,
    onFocus,
    rootRef,
    value
  });
  const strokeWidth = isFocused ? 2 : 1;
  return /* @__PURE__ */ jsxs("div", { className: clsx("atl-input", className), "data-size": size, "data-testid": testId || void 0, children: [
    label && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "atl-input__label-measure", ref: measureRef, children: label }),
    /* @__PURE__ */ jsxs(
      "label",
      {
        className: clsx(
          "atl-input__root",
          `atl-input__root--${size}`,
          status === "error" && "atl-input__root--error",
          status === "success" && "atl-input__root--success",
          disabled && "atl-input__root--disabled",
          applyReadOnlyStyles && "atl-input__root--readonly"
        ),
        ref: setRootNode,
        children: [
          label && /* @__PURE__ */ jsx(
            "span",
            {
              className: clsx(
                "atl-input__label",
                isLabelFloated && "atl-input__label--floated",
                iconLeft && "atl-input__label--with-icon"
              ),
              children: label
            }
          ),
          iconLeft && /* @__PURE__ */ jsx("span", { className: "atl-input__icon", children: iconLeft }),
          /* @__PURE__ */ jsxs("div", { className: "atl-input__content", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ...rest,
                "aria-describedby": describedBy,
                "aria-invalid": isInvalid || void 0,
                "aria-label": !isLabelFloated && label ? label : void 0,
                className: clsx("atl-input__field", variant === "number" && "atl-input__field--number"),
                "data-testid": testId ? `${testId}-input` : void 0,
                disabled,
                inputMode,
                maxLength,
                placeholder: label ? void 0 : placeholder,
                readOnly,
                ref,
                value,
                onBlur: handleBlur,
                onChange: handleChange,
                onFocus: handleFocus
              }
            ),
            description && /* @__PURE__ */ jsx("span", { className: "atl-input__description", id: descriptionId, children: description })
          ] }),
          iconRight && /* @__PURE__ */ jsx(
            AtlInputRightIcon,
            {
              icon: iconRight,
              iconRotated: iconRightRotated,
              onClick: onIconRightClick,
              testId: inputId,
              tooltip: iconRightTooltip,
              tooltipOpen: iconRightTooltipOpen
            }
          ),
          /* @__PURE__ */ jsx(
            AtlInputOutline,
            {
              labelOffset,
              labelWidth,
              metrics: outlineMetrics,
              strokeWidth
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      AtlInputFooter,
      {
        helperText,
        helperTextId,
        maxLength,
        showCharacterCount,
        status,
        value
      }
    )
  ] });
}));
function AtlProgress({ label, value }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return /* @__PURE__ */ jsxs("div", { className: "atl-progress", children: [
    /* @__PURE__ */ jsx("span", { className: "atl-progress__label", children: label }),
    /* @__PURE__ */ jsx("div", { className: "atl-progress__track", children: /* @__PURE__ */ jsx(
      "span",
      {
        className: "atl-progress__fill",
        style: { width: `${clampedValue}%` }
      }
    ) })
  ] });
}
var VIEWPORT_PADDING = 8;
var createPopupStyle = ({
  anchorRect,
  flip,
  gap,
  popupRect
}) => {
  const popupHeight = popupRect.height || 0;
  const popupWidth = popupRect.width || anchorRect.width;
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const showAbove = flip && popupHeight > spaceBelow && anchorRect.top > spaceBelow;
  const top = showAbove ? anchorRect.top - popupHeight - gap : anchorRect.bottom + gap;
  const left = Math.min(anchorRect.left, window.innerWidth - popupWidth - VIEWPORT_PADDING);
  return {
    left: Math.max(VIEWPORT_PADDING, left),
    minWidth: anchorRect.width,
    top: Math.max(VIEWPORT_PADDING, top)
  };
};
var usePopupPosition = ({
  anchorRef,
  flip,
  gap,
  inputRootRef,
  isOpen,
  popupRef
}) => {
  const [style, setStyle] = useState({});
  useLayoutEffect(() => {
    const anchorElement = inputRootRef?.current ?? anchorRef.current;
    const popupElement = popupRef.current;
    if (!isOpen || !anchorElement || !popupElement) {
      return;
    }
    const updatePosition = () => {
      setStyle(
        createPopupStyle({
          anchorRect: anchorElement.getBoundingClientRect(),
          flip,
          gap,
          popupRect: popupElement.getBoundingClientRect()
        })
      );
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const resizeObserver = typeof ResizeObserver === "undefined" ? void 0 : new ResizeObserver(updatePosition);
    resizeObserver?.observe(anchorElement);
    resizeObserver?.observe(popupElement);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [anchorRef, flip, gap, inputRootRef, isOpen, popupRef]);
  return style;
};
var AtlPopup = ({ anchorRef, children, className, closeOnEscape = true, closeOnOutsideClick = true, flip = false, gap = 4, inputRootRef, isOpen, onClose, testId }) => {
  const popupRef = useRef(null);
  const popupStyle = usePopupPosition({ anchorRef, flip, gap, inputRootRef, isOpen, popupRef });
  useOverlayDismiss({
    closeOnEscape,
    closeOnOutsideClick,
    enabled: isOpen,
    onClose,
    refs: [anchorRef, popupRef]
  });
  if (!isOpen) {
    return null;
  }
  return createPortal(
    /* @__PURE__ */ jsx("div", { className: clsx("atl-popup", className), "data-testid": testId, ref: popupRef, style: popupStyle, children }),
    document.body
  );
};
var ComboboxPopup = ({
  anchorRef,
  emptyState,
  flip,
  footerText,
  headerSlot,
  highlightedIndex,
  id,
  inputRootRef,
  isOpen,
  items,
  maxHeight,
  multiSelect = false,
  onClose,
  onSelect,
  onSelectAll,
  optionIdPrefix,
  selectedValues,
  selectAllText,
  showFooter = false,
  testId
}) => {
  return /* @__PURE__ */ jsx(AtlPopup, { anchorRef, flip, inputRootRef, isOpen, testId: `${testId}-popup`, onClose, children: /* @__PURE__ */ jsx(
    AtlDropdown,
    {
      emptyState,
      footerText,
      headerSlot,
      highlightedIndex,
      id,
      items,
      maxHeight,
      multiSelect,
      optionIdPrefix,
      selectAllText,
      selectedValues,
      showFooter,
      testId: `${testId}-dropdown-list`,
      onSelect,
      onSelectAll
    }
  ) });
};
var useComboboxRefs = () => {
  const inputRef = useRef(null);
  const anchorRef = useRef(null);
  const inputRootRef = useRef(null);
  return {
    anchorRef,
    inputRef,
    inputRootRef
  };
};
var useDropdownState = (disabled = false) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
      return;
    }
    open();
  }, [close, isOpen, open]);
  return {
    close,
    isOpen,
    open,
    toggle
  };
};

// src/components/combobox/default-filter.ts
var defaultComboboxFilter = (option, searchValue) => {
  return option.label.toLowerCase().includes(searchValue.toLowerCase());
};

// src/components/combobox/use-filtered-options.ts
var useFilteredOptions = ({
  filterFn,
  options,
  searchValue
}) => {
  return useMemo(() => {
    if (!searchValue.trim()) {
      return options;
    }
    const runFilter = filterFn ?? defaultComboboxFilter;
    return options.filter((option) => runFilter(option, searchValue));
  }, [filterFn, options, searchValue]);
};
var useKeyboardNavigation = ({
  initialHighlightIndex,
  inputRef,
  isOpen,
  onClose,
  onOpen,
  onSelect,
  options
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(initialHighlightIndex);
  const enabledIndices = useMemo(
    () => options.map((option, index) => !option.disabled ? index : -1).filter((index) => index >= 0),
    [options]
  );
  const moveHighlight = useCallback(
    (direction) => {
      if (enabledIndices.length === 0) {
        return;
      }
      setHighlightedIndex((current) => {
        const currentPosition = enabledIndices.indexOf(current);
        if (direction === "first") {
          return enabledIndices[0];
        }
        if (direction === "last") {
          return enabledIndices[enabledIndices.length - 1];
        }
        if (direction === "next") {
          return currentPosition < 0 || currentPosition === enabledIndices.length - 1 ? enabledIndices[0] : enabledIndices[currentPosition + 1];
        }
        return currentPosition <= 0 ? enabledIndices[enabledIndices.length - 1] : enabledIndices[currentPosition - 1];
      });
    },
    [enabledIndices]
  );
  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (!isOpen) {
            onOpen();
          } else if (highlightedIndex >= 0 && options[highlightedIndex]) {
            onSelect(options[highlightedIndex].value);
          }
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          inputRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            onOpen();
          } else {
            moveHighlight("next");
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!isOpen) {
            onOpen();
          } else {
            moveHighlight("prev");
          }
          break;
        case "Home":
          if (isOpen) {
            event.preventDefault();
            moveHighlight("first");
          }
          break;
        case "End":
          if (isOpen) {
            event.preventDefault();
            moveHighlight("last");
          }
          break;
        case "Tab":
          if (isOpen) {
            onClose();
          }
          break;
      }
    },
    [highlightedIndex, inputRef, isOpen, moveHighlight, onClose, onOpen, onSelect, options]
  );
  return {
    handleKeyDown,
    highlightedIndex,
    setHighlightedIndex
  };
};
var ChevronDownIcon = ({ size = 24, ...props }) => {
  return /* @__PURE__ */ jsx(
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
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M6 9L12 15L18 9",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5"
        }
      )
    }
  );
};
var SearchIcon = ({ size = 20, ...props }) => {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      "aria-hidden": "true",
      focusable: "false",
      fill: "none",
      height: size,
      viewBox: "0 0 20 20",
      width: size,
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "9", r: "5.75", stroke: "currentColor", strokeWidth: "1.5" }),
        /* @__PURE__ */ jsx("path", { d: "M13.5 13.5L17 17", stroke: "currentColor", strokeLinecap: "round", strokeWidth: "1.5" })
      ]
    }
  );
};
var useSelectValue = ({
  multiSelect,
  onChange,
  options,
  value
}) => {
  const selectedValues = useMemo(() => {
    if (multiSelect) {
      return value ?? [];
    }
    return value === void 0 ? [] : [value];
  }, [multiSelect, value]);
  const selectedOption = useMemo(() => {
    return multiSelect ? void 0 : options.find((option) => option.value === value);
  }, [multiSelect, options, value]);
  const displayValue = useMemo(() => {
    if (multiSelect) {
      return selectedValues.length > 0 ? `${selectedValues.length} selected` : "";
    }
    return selectedOption?.label ?? "";
  }, [multiSelect, selectedOption, selectedValues.length]);
  const handleSelectValue = useCallback((selected) => {
    if (multiSelect) {
      const currentValues = value ?? [];
      const nextValues = currentValues.includes(selected) ? currentValues.filter((item) => item !== selected) : [...currentValues, selected];
      onChange?.(nextValues);
      return false;
    }
    onChange?.(selected);
    return true;
  }, [multiSelect, onChange, value]);
  return {
    displayValue,
    handleSelectValue,
    selectedOption,
    selectedValues
  };
};
var DEFAULT_MAX_HEIGHT2 = 212;
var AtlSelect = ({
  className,
  disabled = false,
  filterFn,
  flip = true,
  footerText,
  helperText,
  label,
  maxDropdownHeight = DEFAULT_MAX_HEIGHT2,
  multiSelect = false,
  noResultsText = "No results found",
  onChange,
  onSelectAll,
  options,
  placeholder,
  searchPlaceholder,
  searchable = false,
  selectAllText = "Select all",
  showFooter = false,
  size = "m",
  status = "default",
  testId,
  value
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { anchorRef, inputRef, inputRootRef } = useComboboxRefs();
  const dropdown = useDropdownState(disabled);
  const filteredOptions = useFilteredOptions({
    filterFn: searchable ? filterFn : void 0,
    options,
    searchValue: searchable ? searchValue : ""
  });
  const { displayValue, handleSelectValue, selectedOption, selectedValues } = useSelectValue({
    multiSelect,
    onChange,
    options,
    value
  });
  const initialHighlightIndex = useMemo(() => {
    return filteredOptions.findIndex((option) => selectedValues.includes(option.value));
  }, [filteredOptions, selectedValues]);
  const { handleKeyDown, highlightedIndex } = useKeyboardNavigation({
    initialHighlightIndex,
    inputRef,
    isOpen: dropdown.isOpen,
    onClose: dropdown.close,
    onOpen: dropdown.open,
    onSelect: (selected) => {
      const shouldClose = handleSelectValue(selected);
      if (shouldClose) {
        dropdown.close();
      }
    },
    options: filteredOptions
  });
  const handleTriggerMouseDown = useCallback((event) => {
    event.preventDefault();
    dropdown.toggle();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [dropdown, inputRef]);
  const handleSelect = useCallback((selected) => {
    const shouldClose = handleSelectValue(selected);
    if (shouldClose) {
      dropdown.close();
    }
  }, [dropdown, handleSelectValue]);
  const handleSearchKeyDown = useCallback((event) => {
    event.stopPropagation();
    handleKeyDown(event);
  }, [handleKeyDown]);
  const dropdownHeader = searchable ? /* @__PURE__ */ jsx("div", { className: "atl-select__search", children: /* @__PURE__ */ jsx(
    AtlInput,
    {
      autoFocus: true,
      className: "atl-select__search-input",
      iconLeft: /* @__PURE__ */ jsx(SearchIcon, {}),
      placeholder: searchPlaceholder,
      size: "xs",
      value: searchValue,
      onChange: setSearchValue,
      onKeyDown: handleSearchKeyDown
    }
  ) }) : void 0;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx("div", { className: "atl-select", ref: anchorRef, children: /* @__PURE__ */ jsx(
      AtlInput,
      {
        ref: inputRef,
        className: "atl-select__input",
        disabled,
        helperText,
        iconLeft: selectedOption?.icon,
        iconRight: /* @__PURE__ */ jsx(ChevronDownIcon, { size: 24 }),
        iconRightRotated: dropdown.isOpen,
        label,
        onKeyDown: handleKeyDown,
        onMouseDown: handleTriggerMouseDown,
        placeholder,
        readOnly: true,
        readOnlyStyled: false,
        rootRef: inputRootRef,
        size,
        status,
        testId: `${testId}-input`,
        value: displayValue
      }
    ) }),
    /* @__PURE__ */ jsx(
      ComboboxPopup,
      {
        anchorRef,
        emptyState: /* @__PURE__ */ jsx("span", { children: noResultsText }),
        flip,
        footerText,
        headerSlot: dropdownHeader,
        highlightedIndex,
        inputRootRef,
        isOpen: dropdown.isOpen,
        items: filteredOptions,
        maxHeight: maxDropdownHeight,
        multiSelect,
        onClose: dropdown.close,
        onSelect: handleSelect,
        onSelectAll,
        optionIdPrefix: `${testId}-option`,
        selectedValues,
        selectAllText,
        showFooter,
        testId
      }
    )
  ] });
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
var AtlCheckbox = ({ checked = false, className, disabled = false, indeterminate = false, invalid = false, label, loading = false, onChange, onClick, size = "m", testId }) => {
  const handleChange = useCallback((event) => onChange?.(event.target.checked), [onChange]);
  return /* @__PURE__ */ jsxs("label", { className: clsx("atl-checkbox", className, disabled && "atl-checkbox--disabled"), children: [
    /* @__PURE__ */ jsx("input", { checked, className: "atl-checkbox__input", "data-testid": testId, disabled, type: "checkbox", onChange: handleChange, onClick }),
    /* @__PURE__ */ jsx("span", { className: clsx("atl-checkbox__control", `atl-checkbox__control--${size}`, (checked || indeterminate) && "atl-checkbox__control--checked", invalid && "atl-checkbox__control--invalid"), children: loading ? /* @__PURE__ */ jsx(SpinnerIcon, { size: 14 }) : checked ? /* @__PURE__ */ jsx(CheckIcon, { size: 16 }) : indeterminate ? "\u2014" : null }),
    label && /* @__PURE__ */ jsx("span", { children: label })
  ] });
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
var AtlRadioButton = ({ checked, disabled, invalid = false, label, size = "m", testId, ...props }) => {
  return /* @__PURE__ */ jsxs("label", { className: "atl-radio-button", children: [
    /* @__PURE__ */ jsx("input", { ...props, checked, className: "atl-radio-button__input", "data-testid": testId, disabled, type: "radio" }),
    /* @__PURE__ */ jsx("span", { className: clsx("atl-radio-button__control", `atl-radio-button__control--${size}`, checked && "atl-radio-button__control--checked", invalid && "atl-radio-button__control--invalid") }),
    label && /* @__PURE__ */ jsx("span", { children: label })
  ] });
};
var SidebarButton = ({ collapsed, item, onClick, selected }) => {
  return /* @__PURE__ */ jsxs("button", { className: clsx("atl-sidebar__item", selected && "atl-sidebar__item--selected"), type: "button", onClick: () => onClick?.(item.key), children: [
    item.icon,
    !collapsed && /* @__PURE__ */ jsx("span", { children: item.label })
  ] });
};
var AtlSidebar = ({ collapsed = false, footer, footerItems = [], items, loading = false, onItemClick, selectedKey, testId }) => {
  return /* @__PURE__ */ jsxs("aside", { className: clsx("atl-sidebar", collapsed && "atl-sidebar--collapsed"), "data-testid": testId, children: [
    /* @__PURE__ */ jsxs("div", { className: "atl-sidebar__group", children: [
      loading && /* @__PURE__ */ jsx("span", { className: "atl-sidebar__loading", children: "Loading\u2026" }),
      items.map((item) => /* @__PURE__ */ jsx(SidebarButton, { collapsed, item, selected: item.key === selectedKey, onClick: onItemClick }, item.key))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "atl-sidebar__group", children: [
      footerItems.map((item) => /* @__PURE__ */ jsx(SidebarButton, { collapsed, item, selected: item.key === selectedKey, onClick: onItemClick }, item.key)),
      footer
    ] })
  ] });
};
var AtlSwitcher = ({ checked = false, className, disabled = false, invalid = false, onChange, size = "l", testId }) => {
  const buttonRef = useRef(null);
  const toggle = useCallback(() => {
    if (!disabled) {
      onChange?.(!checked);
    }
  }, [checked, disabled, onChange]);
  useKeyPress({ elementRef: buttonRef, key: " ", onKeyPress: toggle, preventDefault: true });
  useKeyPress({ elementRef: buttonRef, key: "Enter", onKeyPress: toggle, preventDefault: true });
  return /* @__PURE__ */ jsx("button", { "aria-checked": checked, className: clsx("atl-switcher", `atl-switcher--${size}`, checked && "atl-switcher--checked", disabled && "atl-switcher--disabled", invalid && "atl-switcher--invalid", className), "data-testid": testId, disabled, ref: buttonRef, role: "switch", type: "button", onClick: toggle, children: /* @__PURE__ */ jsx("span", { className: "atl-switcher__knob" }) });
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
var DEFAULT_MAX_HEIGHT3 = 212;
var AtlAutocomplete = ({
  className,
  disabled = false,
  filterFn,
  flip = false,
  helperText,
  inputPattern,
  label,
  maxDropdownHeight = DEFAULT_MAX_HEIGHT3,
  noResultsIcon,
  noResultsText = "No results found",
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  showDescription = true,
  size = "m",
  status = "default",
  testId,
  value
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { anchorRef, inputRef, inputRootRef } = useComboboxRefs();
  const dropdown = useDropdownState(disabled);
  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const filteredOptions = useFilteredOptions({
    filterFn,
    options,
    searchValue
  });
  const displayValue = isTyping ? searchValue : selectedOption?.label ?? "";
  const initialHighlightIndex = useMemo(() => {
    return filteredOptions.findIndex((option) => option.value === value);
  }, [filteredOptions, value]);
  const { handleKeyDown, highlightedIndex, setHighlightedIndex } = useKeyboardNavigation({
    initialHighlightIndex,
    inputRef,
    isOpen: dropdown.isOpen,
    onClose: dropdown.close,
    onOpen: dropdown.open,
    onSelect: (selected) => {
      onChange(selected);
      setSearchValue("");
      setIsTyping(false);
      dropdown.close();
      requestAnimationFrame(() => inputRef.current?.blur());
    },
    options: filteredOptions
  });
  useEffect(() => {
    if (!dropdown.isOpen) {
      setIsTyping(false);
      setSearchValue("");
      setHighlightedIndex(-1);
    }
  }, [dropdown.isOpen, setHighlightedIndex]);
  const handleInputChange = useCallback((nextValue) => {
    if (inputPattern && nextValue !== "" && !inputPattern.test(nextValue)) {
      return;
    }
    setSearchValue(nextValue);
    setIsTyping(true);
    dropdown.open();
  }, [dropdown, inputPattern]);
  const handleInputFocus = useCallback(() => dropdown.open(), [dropdown]);
  const handleInputBlur = useCallback(() => {
    window.setTimeout(() => {
      if (!dropdown.isOpen) {
        setSearchValue("");
        setIsTyping(false);
      }
    }, 120);
  }, [dropdown.isOpen]);
  const handleSelect = useCallback((selected) => {
    onChange(selected);
    setSearchValue("");
    setIsTyping(false);
    dropdown.close();
  }, [dropdown, onChange]);
  const activeDescendant = highlightedIndex >= 0 ? `${testId}-option-${highlightedIndex}` : void 0;
  const emptyState = /* @__PURE__ */ jsxs("span", { className: "atl-autocomplete__empty-state", children: [
    noResultsIcon ?? /* @__PURE__ */ jsx(SearchIcon, {}),
    /* @__PURE__ */ jsx("span", { children: noResultsText })
  ] });
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx("div", { className: "atl-autocomplete", ref: anchorRef, children: /* @__PURE__ */ jsx(
      AtlInput,
      {
        ref: inputRef,
        "aria-activedescendant": activeDescendant,
        "aria-autocomplete": "list",
        "aria-controls": `${testId}-listbox`,
        "aria-expanded": dropdown.isOpen,
        className: "atl-autocomplete__input",
        description: !isTyping && showDescription ? selectedOption?.description : void 0,
        disabled,
        helperText,
        iconLeft: dropdown.isOpen || selectedOption?.icon ? selectedOption?.icon ?? /* @__PURE__ */ jsx(SearchIcon, {}) : void 0,
        iconRight: /* @__PURE__ */ jsx(ChevronDownIcon, { size: 24 }),
        iconRightRotated: dropdown.isOpen,
        label,
        onKeyDown: handleKeyDown,
        placeholder: isTyping ? searchPlaceholder : placeholder,
        rootRef: inputRootRef,
        role: "combobox",
        size,
        status,
        testId: `${testId}-input`,
        value: displayValue,
        onBlur: handleInputBlur,
        onChange: handleInputChange,
        onFocus: handleInputFocus
      }
    ) }),
    /* @__PURE__ */ jsx(
      ComboboxPopup,
      {
        anchorRef,
        emptyState,
        flip,
        highlightedIndex,
        id: `${testId}-listbox`,
        inputRootRef,
        isOpen: dropdown.isOpen,
        items: filteredOptions,
        maxHeight: maxDropdownHeight,
        onClose: dropdown.close,
        onSelect: handleSelect,
        optionIdPrefix: `${testId}-option`,
        selectedValues: value === void 0 ? [] : [value],
        testId
      }
    )
  ] });
};

export { AtlAutocomplete, AtlAvatar, AtlBreadcrumbs, AtlButton, AtlCard, AtlCheckbox, AtlChip, AtlDropdown, AtlFileUpload, AtlInput, AtlModal, AtlPopup, AtlProgress, AtlRadioButton, AtlSelect, AtlSidebar, AtlSimpleTable, AtlSwitcher, AtlTabs, AtlToastProvider, AtlTooltip, useAtlToast };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map