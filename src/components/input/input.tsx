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

import type { UiInputProps } from './input.type';

export const UiInput = memo(forwardRef<HTMLInputElement, UiInputProps>(function UiInput({
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
    'ui-input__root',
    `ui-input__root--${size}`,
    status === 'error' && 'ui-input__root--error',
    status === 'success' && 'ui-input__root--success',
    disabled && 'ui-input__root--disabled',
    readOnly && 'ui-input__root--readonly',
  );

  const borderClasses = clsx('ui-input__border', label && isLabelFloated && 'ui-input__border--with-gap');

  return (
    <div
      className={clsx('ui-input', className)}
      data-size={size}
      data-testid={testId || undefined}
    >
      {label && (
        <span
          ref={measureRef}
          aria-hidden="true"
          className="ui-input__label-measure"
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
              'ui-input__label',
              isLabelFloated && 'ui-input__label--floated',
              iconLeft && 'ui-input__label--with-icon',
            )}
          >
            {label}
          </span>
        )}

        {iconLeft && (
          <span className="ui-input__icon">
            {iconLeft}
          </span>
        )}

        <input
          ref={ref}
          aria-describedby={helperTextId}
          aria-invalid={isInvalid || undefined}
          aria-label={!isLabelFloated && label ? label : undefined}
          className={clsx('ui-input__field', variant === 'number' && 'ui-input__field--number')}
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
                  'ui-input__icon',
                  'ui-input__icon--right',
                  'ui-input__icon--clickable',
                  iconRightRotated && 'ui-input__icon--rotated',
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
                  'ui-input__icon',
                  'ui-input__icon--right',
                  iconRightRotated && 'ui-input__icon--rotated',
                )}
              >
                {iconRight}
              </span>
            )
        )}

        <span className={borderClasses} />
      </label>

      {showFooter && (
        <div className="ui-input__footer">
          {helperText && (
            <span
              className={clsx(
                'ui-input__helper',
                status === 'error' && 'ui-input__helper--error',
                status === 'success' && 'ui-input__helper--success',
              )}
              id={helperTextId}
            >
              {helperText}
            </span>
          )}

          {showCharacterCount && maxLength && (
            <span
              aria-atomic="true"
              aria-live="polite"
              className="ui-input__counter"
              role="status"
            >
              <span className="ui-input__counter-current">
                {currentLength}
              </span>

              <span className="ui-input__counter-total">
                /
                {maxLength}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}));
