import { forwardRef, memo, useState, useId, useRef, useEffect, useLayoutEffect, useCallback, createContext, useMemo, useContext } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createPortal } from 'react-dom';

// src/components/button/index.tsx

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
  ({ variant = "primary", className, children, disableMotion, ...props }, ref) => {
    const classes = clsx(
      "atl-button",
      `atl-button--${variant}`,
      disableMotion && "atl-button--no-motion",
      className
    );
    return /* @__PURE__ */ jsx(
      "button",
      {
        className: classes,
        ref,
        ...props,
        children: /* @__PURE__ */ jsx("span", { className: "atl-button__label", children })
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
var DEFAULT_OFFSET = 8;
var DEFAULT_PLACEMENT = "bottom-start";
var DEFAULT_MODE = "anchored";
var DEFAULT_BREAKPOINT = 960;
var getTransformOrigin = (placement) => {
  switch (placement) {
    case "bottom-end":
      return "top right";
    case "top-start":
      return "bottom left";
    case "top-end":
      return "bottom right";
    default:
      return "top left";
  }
};
var AtlDropdown = ({
  anchorRef,
  children,
  isOpen,
  onClose,
  className,
  offset = DEFAULT_OFFSET,
  placement = DEFAULT_PLACEMENT,
  mode = DEFAULT_MODE,
  mobileBreakpoint = DEFAULT_BREAKPOINT
}) => {
  const [position, setPosition] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const dropdownRef = useRef(null);
  const placementRef = useRef(placement);
  const observerRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const hasMeasuredRef = useRef(false);
  const resolveIsModal = useCallback(() => {
    if (mode === "modal") {
      return true;
    }
    if (mode === "anchored") {
      return false;
    }
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches;
  }, [mobileBreakpoint, mode]);
  const updatePosition = useCallback(
    (allowFlip) => {
      if (!anchorRef.current) {
        return;
      }
      const rect = anchorRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current?.getBoundingClientRect();
      const dropdownNode = dropdownRef.current;
      const dropdownWidth = dropdownRect?.width || dropdownNode?.offsetWidth || dropdownNode?.scrollWidth || rect.width;
      const dropdownHeight = dropdownRect?.height || dropdownNode?.offsetHeight || dropdownNode?.scrollHeight || 0;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = viewportWidth - rect.right;
      const computedOffset = offset;
      const minWidth = rect.width;
      let computedPlacement = allowFlip ? placement : placementRef.current;
      if (allowFlip && placement.startsWith("bottom") && dropdownHeight && spaceBelow < dropdownHeight + computedOffset) {
        computedPlacement = computedPlacement.replace("bottom", "top");
      }
      if (allowFlip && placement.startsWith("top") && dropdownHeight && spaceAbove < dropdownHeight + computedOffset) {
        computedPlacement = computedPlacement.replace("top", "bottom");
      }
      const wouldOverflowRight = rect.left + dropdownWidth > viewportWidth;
      const wouldOverflowLeft = rect.right - dropdownWidth < 0;
      if (allowFlip && computedPlacement.endsWith("start") && dropdownWidth && wouldOverflowRight && spaceLeft > spaceRight) {
        computedPlacement = computedPlacement.replace("start", "end");
      }
      if (allowFlip && computedPlacement.endsWith("end") && dropdownWidth && wouldOverflowLeft && spaceRight > spaceLeft) {
        computedPlacement = computedPlacement.replace("end", "start");
      }
      const isBottomPlacement = computedPlacement.startsWith("bottom");
      const isEndPlacement = computedPlacement.endsWith("end");
      let top = isBottomPlacement ? rect.bottom + scrollY + computedOffset : rect.top + scrollY - computedOffset;
      let left = isEndPlacement ? rect.right + scrollX : rect.left + scrollX;
      if (allowFlip && dropdownHeight) {
        const dropdownTop = isBottomPlacement ? top : top - dropdownHeight;
        const overflowTop = Math.max(0, scrollY + 8 - dropdownTop);
        const overflowBottom = Math.max(0, dropdownTop + dropdownHeight - (scrollY + viewportHeight - 8));
        top += overflowTop;
        top -= overflowBottom;
      }
      if (allowFlip && dropdownWidth) {
        const dropdownLeft = isEndPlacement ? left - dropdownWidth : left;
        const overflowLeft = Math.max(0, scrollX + 8 - dropdownLeft);
        const overflowRight = Math.max(0, dropdownLeft + dropdownWidth - (scrollX + viewportWidth - 8));
        left += overflowLeft;
        left -= overflowRight;
      }
      setPosition({
        top,
        left,
        minWidth,
        transformOrigin: getTransformOrigin(computedPlacement),
        placement: computedPlacement
      });
      if (allowFlip) {
        placementRef.current = computedPlacement;
      }
    },
    [anchorRef, offset, placement]
  );
  const handlePointerDown = useCallback(
    (event) => {
      if (!dropdownRef.current || !anchorRef.current) {
        return;
      }
      const targetNode = event.target;
      const clickInsideDropdown = dropdownRef.current.contains(targetNode);
      const clickInsideAnchor = anchorRef.current.contains(targetNode);
      if (!clickInsideDropdown && !clickInsideAnchor) {
        onClose();
      }
    },
    [anchorRef, onClose]
  );
  const handleEscapeKey = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );
  useLayoutEffect(() => {
    if (!isOpen) {
      hasMeasuredRef.current = false;
      return;
    }
    placementRef.current = placement;
    if (isModal) {
      return;
    }
    updatePosition(true);
  }, [isOpen, placement, updatePosition, isModal]);
  useLayoutEffect(() => {
    if (!isOpen || isModal || hasMeasuredRef.current) {
      return;
    }
    if (!dropdownRef.current) {
      return;
    }
    updatePosition(true);
    hasMeasuredRef.current = true;
  }, [isOpen, isModal, updatePosition]);
  useEffect(() => {
    const nextIsModal = resolveIsModal();
    setIsModal(nextIsModal);
    if (mode !== "auto") {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    const handleChange = (event) => {
      setIsModal(event.matches);
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [mobileBreakpoint, mode, resolveIsModal]);
  useEffect(() => {
    if (!isOpen || !dropdownRef.current || isModal) {
      return;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }
    resizeObserverRef.current = new ResizeObserver(() => {
      updatePosition(true);
    });
    resizeObserverRef.current.observe(dropdownRef.current);
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }
        if (entry.intersectionRatio < 1) {
          updatePosition(true);
        }
      },
      { threshold: [1] }
    );
    observerRef.current.observe(dropdownRef.current);
    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [isOpen, isModal, updatePosition]);
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey, handlePointerDown]);
  useEffect(() => {
    if (!isOpen || isModal) {
      return;
    }
    const handleResize = () => updatePosition(true);
    const handleScroll = () => updatePosition(true);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, isModal, updatePosition]);
  const wrapperStyle = useMemo(() => {
    if (isModal) {
      return void 0;
    }
    if (!position) {
      return {
        top: 0,
        left: 0,
        minWidth: 0,
        visibility: "hidden",
        ["--dropdown-translate-x"]: "0",
        ["--dropdown-translate-y"]: "0"
      };
    }
    const translateX = position.placement.endsWith("end") ? "-100%" : "0";
    const translateY = position.placement.startsWith("top") ? "-100%" : "0";
    return {
      top: position.top,
      left: position.left,
      minWidth: position.minWidth,
      transformOrigin: position.transformOrigin,
      ["--dropdown-translate-x"]: translateX,
      ["--dropdown-translate-y"]: translateY
    };
  }, [position, isModal]);
  if (!isOpen) {
    return null;
  }
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  const content = isModal ? (
    // biome-ignore lint/a11y/noStaticElementInteractions: <overlay>
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "atl-dropdown atl-dropdown__overlay",
        onClick: handleOverlayClick,
        role: "presentation",
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx("atl-dropdown__panel", className),
            ref: dropdownRef,
            children
          }
        )
      }
    )
  ) : /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("atl-dropdown", className),
      ref: dropdownRef,
      style: wrapperStyle,
      children
    }
  );
  return createPortal(content, document.body);
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
var AtlInput = memo(forwardRef(function AtlInput2({
  testId,
  value,
  label,
  placeholder,
  helperText,
  size = "m",
  status = "default",
  variant = "text",
  disabled = false,
  readOnly = false,
  maxLength = 300,
  showCharacterCount = false,
  iconLeft,
  iconRight,
  iconRightRotated = false,
  onIconRightClick,
  className,
  onChange,
  onFocus,
  onBlur,
  ...rest
}, ref) {
  const [isFocused, setIsFocused] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);
  const [internalHasValue, setInternalHasValue] = useState(false);
  const generatedId = useId();
  const measureRef = useRef(null);
  const hasValue = value !== void 0 && value !== "" || internalHasValue;
  const isLabelFloated = hasValue || isFocused;
  const currentLength = value?.length ?? 0;
  const showFooter = helperText || showCharacterCount;
  const inputMode = variant === "number" ? "decimal" : void 0;
  const inputId = testId || generatedId;
  const helperTextId = helperText ? `${inputId}-helper` : void 0;
  const isInvalid = status === "error";
  useEffect(() => {
    setInternalHasValue(value !== void 0 && value !== "");
  }, [value]);
  useLayoutEffect(() => {
    if (measureRef.current && isLabelFloated) {
      setLabelWidth(measureRef.current.getBoundingClientRect().width);
    } else {
      setLabelWidth(0);
    }
  }, [label, isLabelFloated]);
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
  const inputRootClasses = clsx(
    "atl-input__root",
    `atl-input__root--${size}`,
    status === "error" && "atl-input__root--error",
    status === "success" && "atl-input__root--success",
    disabled && "atl-input__root--disabled",
    readOnly && "atl-input__root--readonly"
  );
  const borderClasses = clsx("atl-input__border", label && isLabelFloated && "atl-input__border--with-gap");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx("atl-input", className),
      "data-size": size,
      "data-testid": testId || void 0,
      children: [
        label && /* @__PURE__ */ jsx(
          "span",
          {
            ref: measureRef,
            "aria-hidden": "true",
            className: "atl-input__label-measure",
            children: label
          }
        ),
        /* @__PURE__ */ jsxs(
          "label",
          {
            className: inputRootClasses,
            style: { "--label-width": `${labelWidth}px` },
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
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref,
                  "aria-describedby": helperTextId,
                  "aria-invalid": isInvalid || void 0,
                  "aria-label": !isLabelFloated && label ? label : void 0,
                  className: clsx("atl-input__field", variant === "number" && "atl-input__field--number"),
                  "data-testid": testId ? `${testId}-input` : void 0,
                  disabled,
                  inputMode,
                  maxLength,
                  placeholder: label ? void 0 : placeholder,
                  readOnly,
                  value,
                  onBlur: handleBlur,
                  onChange: handleChange,
                  onFocus: handleFocus,
                  ...rest
                }
              ),
              iconRight && (onIconRightClick ? /* @__PURE__ */ jsx(
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
              ) : /* @__PURE__ */ jsx(
                "span",
                {
                  className: clsx(
                    "atl-input__icon",
                    "atl-input__icon--right",
                    iconRightRotated && "atl-input__icon--rotated"
                  ),
                  children: iconRight
                }
              )),
              /* @__PURE__ */ jsx("span", { className: borderClasses })
            ]
          }
        ),
        showFooter && /* @__PURE__ */ jsxs("div", { className: "atl-input__footer", children: [
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
          showCharacterCount && maxLength && /* @__PURE__ */ jsxs(
            "output",
            {
              "aria-atomic": "true",
              "aria-live": "polite",
              className: "atl-input__counter",
              children: [
                /* @__PURE__ */ jsx("span", { className: "atl-input__counter-current", children: currentLength }),
                /* @__PURE__ */ jsxs("span", { className: "atl-input__counter-total", children: [
                  "/",
                  maxLength
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
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
var DEFAULT_DROPDOWN_OFFSET = 10;
var DEFAULT_MOBILE_BREAKPOINT = 960;
function AtlSelect({ label, value, options, onChange, helper, className, dropdownOffset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const labelId = useId();
  const listId = useId();
  const anchorRef = useRef(null);
  const optionsRef = useRef(null);
  const focusRafRef = useRef(null);
  const focusAttemptsRef = useRef(0);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const focusOptions = useCallback(() => {
    if (focusRafRef.current) {
      window.cancelAnimationFrame(focusRafRef.current);
    }
    focusRafRef.current = window.requestAnimationFrame(() => {
      if (optionsRef.current) {
        try {
          optionsRef.current.focus({ preventScroll: true });
        } catch {
          optionsRef.current.focus();
        }
        focusAttemptsRef.current = 0;
        focusRafRef.current = null;
        return;
      }
      focusAttemptsRef.current += 1;
      if (focusAttemptsRef.current < 6) {
        focusOptions();
        return;
      }
      focusAttemptsRef.current = 0;
      focusRafRef.current = null;
    });
  }, []);
  const focusTrigger = () => {
    anchorRef.current?.focus();
  };
  const ensureHighlight = useCallback(() => {
    if (selectedIndex >= 0) {
      setHighlightedIndex(selectedIndex);
      return;
    }
    if (options.length > 0) {
      setHighlightedIndex(0);
    }
  }, [options.length, selectedIndex]);
  const closeAndResetHighlight = () => {
    setIsOpen(false);
    setHighlightedIndex(null);
    focusTrigger();
  };
  useEffect(() => {
    if (isOpen) {
      ensureHighlight();
      focusOptions();
    } else {
      setHighlightedIndex(null);
      if (focusRafRef.current) {
        window.cancelAnimationFrame(focusRafRef.current);
        focusRafRef.current = null;
      }
      focusAttemptsRef.current = 0;
    }
  }, [isOpen, ensureHighlight, focusOptions]);
  const handleOptionClick = (event) => {
    const optionValue = event.currentTarget.dataset.value;
    if (!optionValue) {
      return;
    }
    if (optionValue !== value) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };
  const handleOptionSelect = (index) => {
    const option = options[index];
    if (!option) {
      return;
    }
    if (option.value !== value) {
      onChange(option.value);
    }
    closeAndResetHighlight();
  };
  const getNextIndex = (direction) => {
    if (options.length === 0) {
      return null;
    }
    const baseIndex = highlightedIndex ?? (selectedIndex >= 0 ? selectedIndex : 0);
    const delta = direction === "next" ? 1 : -1;
    const nextIndex = baseIndex + delta;
    if (nextIndex >= options.length) {
      return 0;
    }
    if (nextIndex < 0) {
      return options.length - 1;
    }
    return nextIndex;
  };
  const moveHighlight = (direction) => {
    const nextIndex = getNextIndex(direction);
    if (nextIndex === null) {
      return;
    }
    setHighlightedIndex(nextIndex);
  };
  const handleArrowNavigation = (direction) => {
    if (!isOpen) {
      setIsOpen(true);
      ensureHighlight();
    }
    moveHighlight(direction);
    focusOptions();
  };
  const handleTriggerKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      handleArrowNavigation(event.key === "ArrowDown" ? "next" : "prev");
    }
  };
  const handleOptionsKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight("next");
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight("prev");
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex !== null) {
        handleOptionSelect(highlightedIndex);
      }
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeAndResetHighlight();
    }
    if (event.key === "Tab") {
      closeAndResetHighlight();
    }
  };
  const getOptionClasses = (optionValue) => {
    const isActive = optionValue === value;
    return clsx("atl-select__option", isActive && "atl-select__option--active");
  };
  const getOptionAriaSelected = (optionValue) => optionValue === value;
  const getOptionId = (index) => `${listId}-option-${index}`;
  const renderOption = (option, index) => {
    const optionClasses = getOptionClasses(option.value);
    const isSelected = getOptionAriaSelected(option.value);
    const isHighlighted = highlightedIndex === index;
    const classes2 = clsx(optionClasses, isHighlighted && "atl-select__option--highlighted");
    return /* @__PURE__ */ jsx(
      AtlButton,
      {
        "aria-selected": isSelected,
        className: classes2,
        "data-value": option.value,
        id: getOptionId(index),
        onClick: handleOptionClick,
        role: "option",
        tabIndex: -1,
        type: "button",
        disableMotion: true,
        variant: "ghost",
        children: option.label
      },
      option.value
    );
  };
  const classes = clsx("atl-select", className);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];
  return /* @__PURE__ */ jsxs("div", { className: classes, children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "atl-select__label",
        id: labelId,
        children: label
      }
    ),
    /* @__PURE__ */ jsxs(
      AtlButton,
      {
        "aria-controls": listId,
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox",
        "aria-labelledby": labelId,
        className: "atl-select__trigger",
        onClick: handleToggle,
        onKeyDown: handleTriggerKeyDown,
        ref: anchorRef,
        type: "button",
        disableMotion: true,
        variant: "ghost",
        children: [
          /* @__PURE__ */ jsx("span", { className: "atl-select__value", children: selectedOption?.label ?? label }),
          /* @__PURE__ */ jsx("span", { className: "atl-select__icon" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      AtlDropdown,
      {
        anchorRef,
        className: "atl-select__dropdown",
        isOpen,
        mode: "auto",
        mobileBreakpoint: DEFAULT_MOBILE_BREAKPOINT,
        offset: dropdownOffset ?? DEFAULT_DROPDOWN_OFFSET,
        onClose: handleClose,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            "aria-activedescendant": highlightedIndex !== null ? getOptionId(highlightedIndex) : void 0,
            "aria-labelledby": labelId,
            className: "atl-select__options",
            id: listId,
            onKeyDown: handleOptionsKeyDown,
            ref: optionsRef,
            role: "listbox",
            tabIndex: -1,
            children: options.map(renderOption)
          }
        )
      }
    ),
    helper ? /* @__PURE__ */ jsx("span", { className: "atl-select__helper", children: helper }) : null
  ] });
}
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
            variant: "ghost",
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

export { AtlButton, AtlCard, AtlDropdown, AtlFileUpload, AtlInput, AtlProgress, AtlSelect, AtlToastProvider, useAtlToast };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map