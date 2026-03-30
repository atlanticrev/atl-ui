import { useRef } from 'react';

export const useComboboxRefs = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
	const inputRootRef = useRef<HTMLLabelElement>(null);

	return {
		anchorRef,
		inputRef,
		inputRootRef,
	};
};
