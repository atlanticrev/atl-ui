import type { AtlFieldError, AtlFormErrors } from './types';

export const normalizeFieldError = (error?: AtlFieldError | string): AtlFieldError | undefined => {
	if (!error) {
		return undefined;
	}

	return typeof error === 'string' ? { message: error } : error;
};

export const hasErrors = (errors: AtlFormErrors): boolean => {
	return Object.values(errors).some(Boolean);
};

export const mergeErrorNames = (previous: AtlFormErrors, next: AtlFormErrors, extraNames: string[] = []) => {
	return Array.from(new Set([...Object.keys(previous), ...Object.keys(next), ...extraNames]));
};
