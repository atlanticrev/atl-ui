import type {
	ChangeEvent,
	FocusEvent,
	MutableRefObject,
	RefObject,
} from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
	EMPTY_INPUT_OUTLINE_METRICS,
	type InputOutlineMetrics,
} from './input-outline.utils';

type UseInputLayoutParams = {
	onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
	onChange?: (value: string) => void;
	onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
	rootRef?: RefObject<HTMLLabelElement | null>;
	value?: string;
};

const getLabelWidth = (node: HTMLSpanElement | null): number => node?.getBoundingClientRect().width ?? 0;

const getOutlineMetrics = (node: HTMLLabelElement | null): InputOutlineMetrics => {
	if (!node) {
		return EMPTY_INPUT_OUTLINE_METRICS;
	}

	const rect = node.getBoundingClientRect();
	const styles = getComputedStyle(node);

	return {
		height: rect.height,
		radius: Number.parseFloat(styles.borderTopLeftRadius) || 0,
		width: rect.width,
	};
};

export const useInputLayout = ({
	onBlur,
	onChange,
	onFocus,
	rootRef,
	value,
}: UseInputLayoutParams) => {
	const [internalHasValue, setInternalHasValue] = useState(value !== undefined && value !== '');
	const [isFocused, setIsFocused] = useState(false);
	const [labelWidth, setLabelWidth] = useState(0);
	const [outlineMetrics, setOutlineMetrics] = useState<InputOutlineMetrics>(EMPTY_INPUT_OUTLINE_METRICS);

	const measureRef = useRef<HTMLSpanElement>(null);
	const rootNodeRef = useRef<HTMLLabelElement | null>(null);
	const mutableRootRef = rootRef as MutableRefObject<HTMLLabelElement | null> | undefined;
	const hasValue = (value !== undefined && value !== '') || internalHasValue;
	const isLabelFloated = hasValue || isFocused;

	useEffect(() => {
		setInternalHasValue(value !== undefined && value !== '');
	}, [value]);

	const syncLayout = useCallback(() => {
		setLabelWidth(isLabelFloated ? getLabelWidth(measureRef.current) : 0);
		setOutlineMetrics(getOutlineMetrics(rootNodeRef.current));
	}, [isLabelFloated]);

	useLayoutEffect(() => {
		syncLayout();
	}, [syncLayout]);

	useLayoutEffect(() => {
		const observer =
			typeof ResizeObserver === 'undefined'
				? null
				: new ResizeObserver(syncLayout);

		if (measureRef.current) {
			observer?.observe(measureRef.current);
		}

		if (rootNodeRef.current) {
			observer?.observe(rootNodeRef.current);
		}

		return () => observer?.disconnect();
	}, [syncLayout]);

	const setRootNode = useCallback((node: HTMLLabelElement | null) => {
		rootNodeRef.current = node;

		if (mutableRootRef) {
			mutableRootRef.current = node;
		}

		setOutlineMetrics(getOutlineMetrics(node));
	}, [mutableRootRef]);

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

	return {
		handleBlur,
		handleChange,
		handleFocus,
		isFocused,
		isLabelFloated,
		labelWidth,
		measureRef,
		outlineMetrics,
		setRootNode,
	};
};
