import type { ChangeEvent, CSSProperties, FocusEvent } from 'react';
import { forwardRef, memo, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { AtlTooltip } from '@/components/tooltip';
import { clsx } from '@/lib/clsx';

import type { AtlInputProps } from './input.type';

export const AtlInput = memo(forwardRef<HTMLInputElement, AtlInputProps>(function AtlInput({
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
	size = 'm',
	status = 'default',
	testId,
	value,
	variant = 'text',
	...rest
}, ref) {
	const [isFocused, setIsFocused] = useState(false);
	const [labelWidth, setLabelWidth] = useState(0);
	const [internalHasValue, setInternalHasValue] = useState(false);
	const generatedId = useId();
	const measureRef = useRef<HTMLSpanElement>(null);
	const inputRootRef = useRef<HTMLLabelElement | null>(null);
	const mutableRootRef = rootRef as { current: HTMLLabelElement | null } | undefined;
	const applyReadOnlyStyles = readOnlyStyled ?? readOnly;
	const hasValue = (value !== undefined && value !== '') || internalHasValue;
	const isLabelFloated = hasValue || isFocused;
	const currentLength = value?.length ?? 0;
	const showFooter = helperText || showCharacterCount;
	const inputMode = variant === 'number' ? 'decimal' : undefined;
	const inputId = testId || generatedId;
	const helperTextId = helperText ? `${inputId}-helper` : undefined;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const isInvalid = status === 'error';
	const describedBy = [descriptionId, helperTextId].filter(Boolean).join(' ') || undefined;

	useEffect(() => {
		setInternalHasValue(value !== undefined && value !== '');
	}, [value]);

	useLayoutEffect(() => {
		if (measureRef.current && isLabelFloated) {
			setLabelWidth(measureRef.current.getBoundingClientRect().width);
			return;
		}

		setLabelWidth(0);
	}, [isLabelFloated]);

	const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setInternalHasValue(event.target.value !== '');
		onChange?.(event.target.value);
	}, [onChange]);
	const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => {
		setIsFocused(true);
		onFocus?.(event);
	}, [onFocus]);
	const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
		setIsFocused(false);
		onBlur?.(event);
	}, [onBlur]);

	const renderRightIcon = () => {
		if (!iconRight) {
			return null;
		}

		const iconElement = onIconRightClick
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
				<span className={clsx('atl-input__icon', 'atl-input__icon--right', iconRightRotated && 'atl-input__icon--rotated')}>
					{iconRight}
				</span>
			);

		if (!iconRightTooltip) {
			return iconElement;
		}

		return (
			<AtlTooltip open={iconRightTooltipOpen} placement="top" testId={`${inputId}-icon-tooltip`} title={iconRightTooltip}>
				{iconElement}
			</AtlTooltip>
		);
	};

	return (
		<div className={clsx('atl-input', className)} data-size={size} data-testid={testId || undefined}>
			{label && <span aria-hidden="true" className="atl-input__label-measure" ref={measureRef}>{label}</span>}
			<label
				className={clsx(
					'atl-input__root',
					`atl-input__root--${size}`,
					status === 'error' && 'atl-input__root--error',
					status === 'success' && 'atl-input__root--success',
					disabled && 'atl-input__root--disabled',
					applyReadOnlyStyles && 'atl-input__root--readonly',
				)}
				ref={(node) => {
					inputRootRef.current = node;
					if (mutableRootRef) {
						mutableRootRef.current = node;
					}
				}}
				style={{ '--label-width': `${labelWidth}px` } as CSSProperties}
			>
				{label && (
					<span className={clsx('atl-input__label', isLabelFloated && 'atl-input__label--floated', iconLeft && 'atl-input__label--with-icon')}>
						{label}
					</span>
				)}
				{iconLeft && <span className="atl-input__icon">{iconLeft}</span>}
				<div className="atl-input__content">
					<input
						{...rest}
						aria-describedby={describedBy}
						aria-invalid={isInvalid || undefined}
						aria-label={!isLabelFloated && label ? label : undefined}
						className={clsx('atl-input__field', variant === 'number' && 'atl-input__field--number')}
						data-testid={testId ? `${testId}-input` : undefined}
						disabled={disabled}
						inputMode={inputMode}
						maxLength={maxLength}
						placeholder={label ? undefined : placeholder}
						readOnly={readOnly}
						ref={ref}
						value={value}
						onBlur={handleBlur}
						onChange={handleChange}
						onFocus={handleFocus}
					/>
					{description && <span className="atl-input__description" id={descriptionId}>{description}</span>}
				</div>
				{renderRightIcon()}
				<span className={clsx('atl-input__border', label && isLabelFloated && 'atl-input__border--with-gap')} />
			</label>
			{showFooter && (
				<div className="atl-input__footer">
					{helperText && (
						<span className={clsx('atl-input__helper', status === 'error' && 'atl-input__helper--error', status === 'success' && 'atl-input__helper--success')} id={helperTextId}>
							{helperText}
						</span>
					)}
					{showCharacterCount && maxLength && (
						<output aria-atomic="true" aria-live="polite" className="atl-input__counter">
							<span className="atl-input__counter-current">{currentLength}</span>
							<span className="atl-input__counter-total">/{maxLength}</span>
						</output>
					)}
				</div>
			)}
		</div>
	);
}));
