export const readAutocompleteBoolean = (host: HTMLElement, name: string, fallback: boolean): boolean => {
	const value = host.getAttribute(name);
	return value === null ? fallback : value !== 'false';
};
