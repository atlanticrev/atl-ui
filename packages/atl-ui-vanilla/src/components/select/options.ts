import type { AltSelectOption } from './types';

const normalizeOption = (option: AltSelectOption): AltSelectOption => ({
	description: option.description,
	disabled: option.disabled ?? false,
	label: option.label,
	selected: option.selected ?? false,
	value: option.value,
});

export const normalizeOptions = (options: readonly AltSelectOption[]): AltSelectOption[] => {
	const values = new Set<string>();
	const normalized: AltSelectOption[] = [];

	for (const option of options) {
		if (values.has(option.value)) {
			continue;
		}

		values.add(option.value);
		normalized.push(normalizeOption(option));
	}

	return normalized;
};

export const readDeclarativeOptions = (host: Element): AltSelectOption[] => {
	const options = Array.from(host.children)
		.filter((child) => child.localName === 'alt-option')
		.map((child) => ({
			description: child.getAttribute('description') ?? undefined,
			disabled: child.hasAttribute('disabled'),
			label: child.getAttribute('label') ?? child.textContent?.trim() ?? '',
			selected: child.hasAttribute('selected'),
			value: child.getAttribute('value') ?? child.textContent?.trim() ?? '',
		}));

	return normalizeOptions(options);
};

export const findEnabledOption = (
	options: readonly AltSelectOption[],
	start: number,
	direction: 1 | -1,
): AltSelectOption | undefined => {
	for (let offset = 0; offset < options.length; offset += 1) {
		const index = (start + direction * offset + options.length) % options.length;
		const option = options[index];

		if (option && !option.disabled) {
			return option;
		}
	}

	return undefined;
};
