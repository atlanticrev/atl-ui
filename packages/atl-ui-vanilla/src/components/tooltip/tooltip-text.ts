export const readTooltipText = (host: HTMLElement): string => {
	return host.getAttribute('text') ?? host.getAttribute('title') ?? '';
};

export const writeTooltipText = (host: HTMLElement, value: string): void => {
	if (value) host.setAttribute('text', value);
	else host.removeAttribute('text');

	host.removeAttribute('title');
};

export const migrateTooltipTitle = (host: HTMLElement, name: string, value: string | null): boolean => {
	if (name !== 'title' || value === null) return false;

	writeTooltipText(host, value);

	return true;
};
