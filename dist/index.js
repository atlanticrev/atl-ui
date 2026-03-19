import { forwardRef, memo, useState, useId, useRef, useEffect, useLayoutEffect, useCallback, createContext, useMemo, useContext, createElement } from 'react';
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
  ({ children, className, disableMotion, disabled, htmlType, iconLeft, iconRight, iconSize = 24, isDisabled, loading = false, size = 48, type, variant = "filled", ...props }, ref) => {
    const isIconOnly = !children && Boolean(iconLeft || iconRight);
    return /* @__PURE__ */ jsx(
      "button",
      {
        ...props,
        className: clsx("atl-button", `atl-button--${variant}`, `atl-button--size-${size}`, loading && "atl-button--loading", isIconOnly && "atl-button--icon-only", disableMotion && "atl-button--no-motion", className),
        disabled: disabled || isDisabled || loading,
        ref,
        type: htmlType ?? type ?? "button",
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
function AtlFileUpload({ label, onFileSelected, accept, hint, className }) {
  const inputId = useId();
  const handleChange = (event) => {
    onFileSelected(event.target.files?.[0] ?? null);
  };
  const classes = clsx("atl-file-upload", className);
  return /* @__PURE__ */ jsxs("div", { className: classes, children: [
    /* @__PURE__ */ jsx(
      "label",
      {
        className: "atl-file-upload__button",
        htmlFor: inputId,
        children: label
      }
    ),
    /* @__PURE__ */ jsx(
      "input",
      {
        className: "atl-file-upload__input",
        id: inputId,
        type: "file",
        accept,
        onChange: handleChange
      }
    ),
    hint ? /* @__PURE__ */ jsx("span", { className: "atl-file-upload__hint", children: hint }) : null
  ] });
}
var AtlTooltip = ({ children, className, open, placement = "top", testId, title, trigger = "hover" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const visible = open ?? isOpen;
  const show = useCallback(() => setIsOpen(true), []);
  const hide = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback((event) => {
    event.preventDefault();
    setIsOpen((current) => !current);
  }, []);
  const handleKeyDown = useCallback((event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((current) => !current);
    }
  }, []);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: clsx("atl-tooltip", className),
      onBlur: hide,
      onClick: trigger === "click" ? toggle : void 0,
      onFocus: show,
      onKeyDown: trigger === "click" ? handleKeyDown : void 0,
      onMouseEnter: trigger === "hover" ? show : void 0,
      onMouseLeave: trigger === "hover" ? hide : void 0,
      type: "button",
      children: [
        children,
        visible && /* @__PURE__ */ jsx("span", { className: clsx("atl-tooltip__panel", `atl-tooltip__panel--${placement}`), "data-testid": testId, role: "tooltip", children: title })
      ]
    }
  );
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
  const [isFocused, setIsFocused] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const [internalHasValue, setInternalHasValue] = useState(false);
  const generatedId = useId();
  const measureRef = useRef(null);
  const inputRootRef = useRef(null);
  const mutableRootRef = rootRef;
  const applyReadOnlyStyles = readOnlyStyled ?? readOnly;
  const hasValue = value !== void 0 && value !== "" || internalHasValue;
  const isLabelFloated = hasValue || isFocused;
  const currentLength = value?.length ?? 0;
  const showFooter = helperText || showCharacterCount;
  const inputMode = variant === "number" ? "decimal" : void 0;
  const inputId = testId || generatedId;
  const helperTextId = helperText ? `${inputId}-helper` : void 0;
  const descriptionId = description ? `${inputId}-description` : void 0;
  const isInvalid = status === "error";
  const describedBy = [descriptionId, helperTextId].filter(Boolean).join(" ") || void 0;
  useEffect(() => {
    setInternalHasValue(value !== void 0 && value !== "");
  }, [value]);
  useLayoutEffect(() => {
    if (measureRef.current && isLabelFloated) {
      setLabelWidth(measureRef.current.getBoundingClientRect().width);
      return;
    }
    setLabelWidth(0);
  }, [isLabelFloated]);
  const handleChange = useCallback((event) => {
    setInternalHasValue(event.target.value !== "");
    onChange?.(event.target.value);
  }, [onChange]);
  const handleFocus = useCallback((event) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);
  const handleBlur = useCallback((event) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);
  const renderRightIcon = () => {
    if (!iconRight) {
      return null;
    }
    const iconElement = onIconRightClick ? /* @__PURE__ */ jsx(
      "button",
      {
        className: clsx(
          "atl-input__icon",
          "atl-input__icon--right",
          "atl-input__icon--clickable",
          iconRightRotated && "atl-input__icon--rotated"
        ),
        tabIndex: -1,
        type: "button",
        onClick: onIconRightClick,
        children: iconRight
      }
    ) : /* @__PURE__ */ jsx("span", { className: clsx("atl-input__icon", "atl-input__icon--right", iconRightRotated && "atl-input__icon--rotated"), children: iconRight });
    if (!iconRightTooltip) {
      return iconElement;
    }
    return /* @__PURE__ */ jsx(AtlTooltip, { open: iconRightTooltipOpen, placement: "top", testId: `${inputId}-icon-tooltip`, title: iconRightTooltip, children: iconElement });
  };
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
        ref: (node) => {
          inputRootRef.current = node;
          if (mutableRootRef) {
            mutableRootRef.current = node;
          }
        },
        style: { "--label-width": `${labelWidth}px` },
        children: [
          label && /* @__PURE__ */ jsx("span", { className: clsx("atl-input__label", isLabelFloated && "atl-input__label--floated", iconLeft && "atl-input__label--with-icon"), children: label }),
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
          renderRightIcon(),
          /* @__PURE__ */ jsx("span", { className: clsx("atl-input__border", label && isLabelFloated && "atl-input__border--with-gap") })
        ]
      }
    ),
    showFooter && /* @__PURE__ */ jsxs("div", { className: "atl-input__footer", children: [
      helperText && /* @__PURE__ */ jsx("span", { className: clsx("atl-input__helper", status === "error" && "atl-input__helper--error", status === "success" && "atl-input__helper--success"), id: helperTextId, children: helperText }),
      showCharacterCount && maxLength && /* @__PURE__ */ jsxs("output", { "aria-atomic": "true", "aria-live": "polite", className: "atl-input__counter", children: [
        /* @__PURE__ */ jsx("span", { className: "atl-input__counter-current", children: currentLength }),
        /* @__PURE__ */ jsxs("span", { className: "atl-input__counter-total", children: [
          "/",
          maxLength
        ] })
      ] })
    ] })
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
var VIEWPORT_PADDING = 8;
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
    if (!isOpen || !anchorRef.current) {
      return;
    }
    const anchorRect = (inputRootRef?.current ?? anchorRef.current).getBoundingClientRect();
    const popupRect = popupRef.current?.getBoundingClientRect();
    const popupHeight = popupRect?.height ?? 0;
    const popupWidth = popupRect?.width ?? anchorRect.width;
    const spaceBelow = window.innerHeight - anchorRect.bottom;
    const showAbove = flip && popupHeight > spaceBelow && anchorRect.top > spaceBelow;
    const top = showAbove ? anchorRect.top - popupHeight - gap : anchorRect.bottom + gap;
    const left = Math.min(anchorRect.left, window.innerWidth - popupWidth - VIEWPORT_PADDING);
    setStyle({
      left: Math.max(VIEWPORT_PADDING, left),
      minWidth: anchorRect.width,
      top: Math.max(VIEWPORT_PADDING, top)
    });
  }, [anchorRef, flip, gap, inputRootRef, isOpen, popupRef]);
  return style;
};
var AtlPopup = ({ anchorRef, children, className, flip = false, gap = 4, inputRootRef, isOpen, onClose, testId }) => {
  const popupRef = useRef(null);
  const popupStyle = usePopupPosition({ anchorRef, flip, gap, inputRootRef, isOpen, popupRef });
  useClickOutside({ enabled: isOpen, onOutsideClick: onClose, refs: [anchorRef, popupRef] });
  if (!isOpen) {
    return null;
  }
  return createPortal(
    /* @__PURE__ */ jsx("div", { className: clsx("atl-popup", className), "data-testid": testId, ref: popupRef, style: popupStyle, children }),
    document.body
  );
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
var DEFAULT_MAX_HEIGHT2 = 212;
var defaultFilter = (option, searchValue) => {
  return option.label.toLowerCase().includes(searchValue.toLowerCase());
};
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
  const inputRef = useRef(null);
  const anchorRef = useRef(null);
  const inputRootRef = useRef(null);
  const dropdown = useDropdownState(disabled);
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue.trim()) {
      return options;
    }
    const runFilter = filterFn ?? defaultFilter;
    return options.filter((option) => runFilter(option, searchValue));
  }, [filterFn, options, searchValue, searchable]);
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
  const initialHighlightIndex = filteredOptions.findIndex((option) => selectedValues.includes(option.value));
  const { handleKeyDown, highlightedIndex } = useKeyboardNavigation({
    initialHighlightIndex,
    inputRef,
    isOpen: dropdown.isOpen,
    onClose: dropdown.close,
    onOpen: dropdown.open,
    onSelect: (selected) => {
      if (multiSelect) {
        const currentValues = value ?? [];
        const nextValues = currentValues.includes(selected) ? currentValues.filter((item) => item !== selected) : [...currentValues, selected];
        onChange?.(nextValues);
        return;
      }
      onChange?.(selected);
      dropdown.close();
    },
    options: filteredOptions
  });
  const handleTriggerMouseDown = useCallback((event) => {
    event.preventDefault();
    dropdown.toggle();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [dropdown]);
  const handleSelect = useCallback((selected) => {
    if (multiSelect) {
      const currentValues = value ?? [];
      const nextValues = currentValues.includes(selected) ? currentValues.filter((item) => item !== selected) : [...currentValues, selected];
      onChange?.(nextValues);
      return;
    }
    onChange?.(selected);
    dropdown.close();
  }, [dropdown, multiSelect, onChange, value]);
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
  const emptyState = /* @__PURE__ */ jsx("span", { children: noResultsText });
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
    /* @__PURE__ */ jsx(AtlPopup, { anchorRef, flip, inputRootRef, isOpen: dropdown.isOpen, testId: `${testId}-popup`, onClose: dropdown.close, children: /* @__PURE__ */ jsx(
      AtlDropdown,
      {
        emptyState,
        footerText,
        headerSlot: dropdownHeader,
        highlightedIndex,
        items: filteredOptions,
        maxHeight: maxDropdownHeight,
        multiSelect,
        optionIdPrefix: `${testId}-option`,
        selectAllText,
        selectedValues,
        showFooter,
        testId: `${testId}-dropdown-list`,
        onSelect: handleSelect,
        onSelectAll
      }
    ) })
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
var AtlCircleIcon = (props) => {
  const style = {
    "--atl-circle-icon-bg": props.backgroundColor,
    "--atl-circle-icon-icon-color": props.contentType === "icon" ? props.iconColor : void 0,
    "--atl-circle-icon-icon-scale": props.contentType === "icon" ? props.iconScale : void 0,
    "--atl-circle-icon-icon-size": props.contentType === "icon" ? props.iconSize : void 0,
    "--atl-circle-icon-image-fit": props.contentType === "image" ? props.objectFit : void 0,
    "--atl-circle-icon-image-padding": props.contentType === "image" ? props.imagePadding : void 0,
    "--atl-circle-icon-text-color": props.contentType === "initials" ? props.textColor : void 0,
    border: props.border ? `${props.border.width}px solid ${props.border.color}` : void 0,
    borderRadius: getBorderRadius(props.borderRadius),
    height: props.size,
    width: props.size
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("atl-circle-icon", props.className), style, children: [
    props.contentType === "image" && /* @__PURE__ */ jsx("img", { alt: props.imageAlt ?? "", className: "atl-circle-icon__image", src: props.imageUrl, onError: props.onImageError }),
    props.contentType === "initials" && /* @__PURE__ */ jsx("span", { className: "atl-circle-icon__initials", children: props.initials }),
    props.contentType === "icon" && /* @__PURE__ */ jsx("span", { className: "atl-circle-icon__icon", children: /* @__PURE__ */ jsx(props.icon, {}) }),
    props.contentType === "custom" && props.children
  ] });
};
var SuitcaseIcon = ({ size = 24, ...props }) => {
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
          "path",
          {
            d: "M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M5 9h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Z",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsx("path", { d: "M5 11h14", stroke: "currentColor", strokeLinecap: "round", strokeWidth: "1.5" })
      ]
    }
  );
};

// src/components/avatar/config.ts
var AVATAR_CONFIG = {
  beneficiary: {
    company: {
      backgroundColor: "var(--md-sys-color-secondary-container)",
      iconColor: "var(--md-sys-color-on-secondary-container)"
    },
    initials: {
      backgroundColor: "var(--md-sys-color-secondary-container)",
      textColor: "var(--md-sys-color-on-secondary-container)"
    },
    photo: {
      backgroundColor: "transparent"
    }
  },
  company: {
    initials: {
      backgroundColor: "var(--md-sys-color-primary-container)",
      textColor: "var(--md-sys-color-on-primary-container)"
    },
    logo: {
      backgroundColor: "var(--md-sys-color-primary-container)"
    }
  },
  user: {
    initials: {
      backgroundColor: "var(--md-sys-color-primary)",
      textColor: "var(--md-sys-color-on-primary)"
    },
    photo: {
      backgroundColor: "transparent"
    }
  }
};
var getInitials = (name) => {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "").join("");
};
var AtlAvatar = ({
  backgroundColor,
  className,
  fullName,
  imageUrl,
  initials,
  logoIcon,
  size = 32,
  type,
  variant
}) => {
  const resolvedInitials = useMemo(() => initials ?? getInitials(fullName), [fullName, initials]);
  const config = AVATAR_CONFIG[variant][type];
  const bgColor = backgroundColor ?? config?.backgroundColor;
  if (type === "photo" && imageUrl) {
    return /* @__PURE__ */ jsx(AtlCircleIcon, { className, contentType: "image", imageAlt: fullName, imageUrl, size });
  }
  if (type === "logo" && logoIcon) {
    return /* @__PURE__ */ jsx(AtlCircleIcon, { backgroundColor: bgColor, className, contentType: "icon", icon: logoIcon, size });
  }
  if (type === "logo" && imageUrl) {
    return /* @__PURE__ */ jsx(AtlCircleIcon, { backgroundColor: bgColor, className, contentType: "image", imageAlt: fullName, imagePadding: "20%", imageUrl, objectFit: "contain", size });
  }
  if (type === "company") {
    return /* @__PURE__ */ jsx(AtlCircleIcon, { backgroundColor: bgColor, className, contentType: "icon", icon: SuitcaseIcon, iconColor: config?.iconColor, size });
  }
  return /* @__PURE__ */ jsx(AtlCircleIcon, { backgroundColor: bgColor, className, contentType: "initials", initials: resolvedInitials, size, textColor: config?.textColor });
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
var AtlCheckbox = ({ checked = false, className, disabled = false, indeterminate = false, label, loading = false, onChange, onClick, size = "M", testId }) => {
  const handleChange = useCallback((event) => onChange?.(event.target.checked), [onChange]);
  return /* @__PURE__ */ jsxs("label", { className: clsx("atl-checkbox", className, disabled && "atl-checkbox--disabled"), children: [
    /* @__PURE__ */ jsx("input", { checked, className: "atl-checkbox__input", "data-testid": testId, disabled, type: "checkbox", onChange: handleChange, onClick }),
    /* @__PURE__ */ jsx("span", { className: clsx("atl-checkbox__control", `atl-checkbox__control--${size.toLowerCase()}`, (checked || indeterminate) && "atl-checkbox__control--checked"), children: loading ? /* @__PURE__ */ jsx(SpinnerIcon, { size: 14 }) : checked ? /* @__PURE__ */ jsx(CheckIcon, { size: 16 }) : indeterminate ? "\u2014" : null }),
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
var AtlRadioButton = ({ checked, disabled, invalid = false, label, size = 24, testId, ...props }) => {
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
var AtlSwitcher = ({ checked = false, className, disabled = false, onChange, size = "L", testId }) => {
  const buttonRef = useRef(null);
  const toggle = useCallback(() => {
    if (!disabled) {
      onChange?.(!checked);
    }
  }, [checked, disabled, onChange]);
  useKeyPress({ elementRef: buttonRef, key: " ", onKeyPress: toggle, preventDefault: true });
  useKeyPress({ elementRef: buttonRef, key: "Enter", onKeyPress: toggle, preventDefault: true });
  return /* @__PURE__ */ jsx("button", { "aria-checked": checked, className: clsx("atl-switcher", `atl-switcher--${size.toLowerCase()}`, checked && "atl-switcher--checked", disabled && "atl-switcher--disabled", className), "data-testid": testId, disabled, ref: buttonRef, role: "switch", type: "button", onClick: toggle, children: /* @__PURE__ */ jsx("span", { className: "atl-switcher__knob" }) });
};
var DEFAULT_PAGE_SIZE = 10;
var resolveCellValue = (record, dataIndex) => {
  if (dataIndex === void 0) {
    return void 0;
  }
  return record[dataIndex];
};
var AtlTable = ({ ariaLabel, className, columns = [], dataSource, locale, onRow, pagination = false, rowClassName, rowKey, style }) => {
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
  return /* @__PURE__ */ jsxs("div", { className: clsx("atl-table", className), style, children: [
    /* @__PURE__ */ jsxs("table", { "aria-label": ariaLabel, className: "atl-table__table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((column, index) => /* @__PURE__ */ jsx("th", { style: { textAlign: column.align, width: column.width }, children: typeof column.title === "function" ? column.title({}) : column.title }, column.key ?? String(column.dataIndex ?? index))) }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        pagedData.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "atl-table__empty", colSpan: Math.max(columns.length, 1), children: locale?.emptyText ?? "No data" }) }),
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
    paginationConfig && totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "atl-table__pagination", children: [
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
  useClickOutside({ enabled: isOpen, onOutsideClick: onClose, refs: [contentRef] });
  useFocusTrap({ enabled: isOpen, rootRef: contentRef });
  useKeyPress({ enabled: isOpen, key: "Escape", onKeyPress: onClose });
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
var defaultFilter2 = (option, searchValue) => {
  return option.label.toLowerCase().includes(searchValue.toLowerCase());
};
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
  const inputRef = useRef(null);
  const anchorRef = useRef(null);
  const inputRootRef = useRef(null);
  const dropdown = useDropdownState(disabled);
  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) {
      return options;
    }
    const runFilter = filterFn ?? defaultFilter2;
    return options.filter((option) => runFilter(option, searchValue));
  }, [filterFn, options, searchValue]);
  const displayValue = isTyping ? searchValue : selectedOption?.label ?? "";
  const initialHighlightIndex = filteredOptions.findIndex((option) => option.value === value);
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
    /* @__PURE__ */ jsx(AtlPopup, { anchorRef, flip, inputRootRef, isOpen: dropdown.isOpen, testId: `${testId}-popup`, onClose: dropdown.close, children: /* @__PURE__ */ jsx(
      AtlDropdown,
      {
        emptyState,
        highlightedIndex,
        id: `${testId}-listbox`,
        items: filteredOptions,
        maxHeight: maxDropdownHeight,
        optionIdPrefix: `${testId}-option`,
        selectedValues: value === void 0 ? [] : [value],
        testId: `${testId}-dropdown-list`,
        onSelect: handleSelect
      }
    ) })
  ] });
};

export { AtlAutocomplete, AtlAvatar, AtlBreadcrumbs, AtlButton, AtlCard, AtlCheckbox, AtlChip, AtlCircleIcon, AtlDropdown, AtlFileUpload, AtlInput, AtlModal, AtlPopup, AtlProgress, AtlRadioButton, AtlSelect, AtlSidebar, AtlSwitcher, AtlTable, AtlTabs, AtlToastProvider, AtlTooltip, useAtlToast };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map