import { forwardRef, memo, useId } from 'react';
import { clsx } from '@/lib/clsx';

import type { AtlInputProps } from './input.type';
import { AtlInputFooter } from './input-footer';
import { AtlInputOutline } from './input-outline';
import { AtlInputRightIcon } from './input-right-icon';
import { useInputLayout } from './use-input-layout';

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
	const generatedId = useId();
	const applyReadOnlyStyles = readOnlyStyled ?? readOnly;
	const inputMode = variant === 'number' ? 'decimal' : undefined;
	const inputId = testId || generatedId;
	const helperTextId = helperText ? `${inputId}-helper` : undefined;
	const descriptionId = description ? `${inputId}-description` : undefined;
	const isInvalid = status === 'error';
	const describedBy = [descriptionId, helperTextId].filter(Boolean).join(' ') || undefined;
	const {
		handleBlur,
		handleChange,
		handleFocus,
		isFocused,
		isLabelFloated,
		labelWidth,
		measureRef,
		outlineMetrics,
		setRootNode,
	} = useInputLayout({
		onBlur,
		onChange,
		onFocus,
		rootRef,
		value,
	});
	const strokeWidth = isFocused ? 2 : 1;

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
				ref={setRootNode}
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
				
				{iconRight && (
					<AtlInputRightIcon
						icon={iconRight}
						iconRotated={iconRightRotated}
						onClick={onIconRightClick}
						testId={inputId}
						tooltip={iconRightTooltip}
						tooltipOpen={iconRightTooltipOpen}
					/>
				)}

				<AtlInputOutline labelWidth={labelWidth} metrics={outlineMetrics} strokeWidth={strokeWidth} />
			</label>

			<AtlInputFooter
				helperText={helperText}
				helperTextId={helperTextId}
				maxLength={maxLength}
				showCharacterCount={showCharacterCount}
				status={status}
				value={value}
			/>
		</div>
	);
}));
