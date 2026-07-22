import type { AltSelectOption } from './types';

const normalizeOption = (option: AltSelectOption): AltSelectOption => ({
	checkIcon: option.checkIcon,
	description: option.description,
	disabled: option.disabled ?? false,
	element: option.element,
	icon: option.icon,
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
	const options = Array.from(host.querySelectorAll<HTMLElement>('alt-option'))
		.filter((child) => {
			const owner = child.closest('alt-select, alt-dropdown, alt-autocomplete');
			return owner === null || owner === host;
		})
		.map((child) => ({
			checkIcon: Reflect.get(child, 'checkIcon') as Node | null | undefined,
			description: child.getAttribute('description') ?? undefined,
			disabled: child.hasAttribute('disabled'),
			element: child,
			label: child.getAttribute('label') ?? child.textContent?.trim() ?? '',
			icon: Reflect.get(child, 'icon') as Node | null | undefined,
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
