import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { clsx } from '@/lib/clsx';

import type { AtlInputProps } from './input.type';

export const AtlInput = memo(forwardRef<HTMLInputElement, AtlInputProps>(function AtlInput({
  testId,
  value,
  label,
  placeholder,
  helperText,
  size = 'm',
  status = 'default',
  variant = 'text',
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
  const [ isFocused, setIsFocused ] = useState(false);
  const [ labelWidth, setLabelWidth ] = useState(0);
  const [ internalHasValue, setInternalHasValue ] = useState(false);

  const generatedId = useId();
  const measureRef = useRef<HTMLSpanElement>(null);

  const hasValue = (value !== undefined && value !== '') || internalHasValue;
  const isLabelFloated = hasValue || isFocused;
  const currentLength = value?.length ?? 0;
  const showFooter = helperText || showCharacterCount;
  const inputMode = variant === 'number' ? 'decimal' : undefined;
  const inputId = testId || generatedId;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;
  const isInvalid = status === 'error';

  useEffect(() => {
    setInternalHasValue(value !== undefined && value !== '');
  }, [ value ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: label text changes should update measurement.
  useLayoutEffect(() => {
    if (measureRef.current && isLabelFloated) {
      setLabelWidth(measureRef.current.getBoundingClientRect().width);
    } else {
      setLabelWidth(0);
    }
  }, [ label, isLabelFloated ]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInternalHasValue(event.target.value !== '');
    onChange?.(event.target.value);
  }, [ onChange ]);

  const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [ onFocus ]);

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [ onBlur ]);

  const inputRootClasses = clsx(
    'atl-input__root',
    `atl-input__root--${size}`,
    status === 'error' && 'atl-input__root--error',
    status === 'success' && 'atl-input__root--success',
    disabled && 'atl-input__root--disabled',
    readOnly && 'atl-input__root--readonly',
  );

  const borderClasses = clsx('atl-input__border', label && isLabelFloated && 'atl-input__border--with-gap');

  return (
    <div
      className={clsx('atl-input', className)}
      data-size={size}
      data-testid={testId || undefined}
    >
      {label && (
        <span
          ref={measureRef}
          aria-hidden="true"
          className="atl-input__label-measure"
        >
          {label}
        </span>
      )}

      <label
        className={inputRootClasses}
        style={{ '--label-width': `${labelWidth}px` } as CSSProperties}
      >
        {label && (
          <span
            className={clsx(
              'atl-input__label',
              isLabelFloated && 'atl-input__label--floated',
              iconLeft && 'atl-input__label--with-icon',
            )}
          >
            {label}
          </span>
        )}

        {iconLeft && (
          <span className="atl-input__icon">
            {iconLeft}
          </span>
        )}

        <input
          ref={ref}
          aria-describedby={helperTextId}
          aria-invalid={isInvalid || undefined}
          aria-label={!isLabelFloated && label ? label : undefined}
          className={clsx('atl-input__field', variant === 'number' && 'atl-input__field--number')}
          data-testid={testId ? `${testId}-input` : undefined}
          disabled={disabled}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={label ? undefined : placeholder}
          readOnly={readOnly}
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          {...rest}
        />

        {iconRight && (
          onIconRightClick
            ? (
              <button
                className={clsx(
                  'atl-input__icon',
                  'atl-input__icon--right',
                  'atl-input__icon--clickable',
                  iconRightRotated && 'atl-input__icon--rotated',
                )}
                tabIndex={-1}
                type="button"
                onClick={onIconRightClick}
              >
                {iconRight}
              </button>
            )
            : (
              <span
                className={clsx(
                  'atl-input__icon',
                  'atl-input__icon--right',
                  iconRightRotated && 'atl-input__icon--rotated',
                )}
              >
                {iconRight}
              </span>
            )
        )}

        <span className={borderClasses} />
      </label>

      {showFooter && (
        <div className="atl-input__footer">
          {helperText && (
            <span
              className={clsx(
                'atl-input__helper',
                status === 'error' && 'atl-input__helper--error',
                status === 'success' && 'atl-input__helper--success',
              )}
              id={helperTextId}
            >
              {helperText}
            </span>
          )}

          {showCharacterCount && maxLength && (
            <output
              aria-atomic="true"
              aria-live="polite"
              className="atl-input__counter"
            >
              <span className="atl-input__counter-current">
                {currentLength}
              </span>

              <span className="atl-input__counter-total">
                /
                {maxLength}
              </span>
            </output>
          )}
        </div>
      )}
    </div>
  );
}));
