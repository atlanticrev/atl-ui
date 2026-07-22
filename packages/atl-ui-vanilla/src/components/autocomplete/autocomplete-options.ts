import { normalizeOptions, readDeclarativeOptions } from '../select/options';

import type { AltAutocompleteFilter, AltAutocompleteOption } from './types';

export const filterAutocompleteOptions = (
	options: readonly AltAutocompleteOption[],
	query: string,
	filter: AltAutocompleteFilter | null,
): AltAutocompleteOption[] => {
	const normalizedQuery = query.trim().toLocaleLowerCase();

	if (!normalizedQuery) return normalizeOptions(options);

	return normalizeOptions(options).filter((option) => {
		if (filter) return filter(option, query);

		const content = `${option.label} ${option.description ?? ''}`.toLocaleLowerCase();

		return content.includes(normalizedQuery);
	});
};

export const findAutocompleteOption = (
	options: readonly AltAutocompleteOption[],
	value: string,
): AltAutocompleteOption | undefined => options.find((option) => option.value === value);

export const readAutocompleteOptions = (host: HTMLElement, dropdown?: HTMLElement): AltAutocompleteOption[] => {
	const rendered = dropdown ? readDeclarativeOptions(dropdown) : [];

	const authored = readDeclarativeOptions(host);

	return normalizeOptions([...rendered, ...authored]);
};
