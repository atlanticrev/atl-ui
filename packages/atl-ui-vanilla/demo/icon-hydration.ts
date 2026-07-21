import { createAltIcon, type AltIconName } from '../src';

const DEMO_ICON_NAMES: readonly AltIconName[] = [
	'check',
	'chevron-down',
	'chevron-right',
	'close',
	'plus',
];

const isDemoIconName = (value: string): value is AltIconName => {
	return DEMO_ICON_NAMES.some((name) => name === value);
};

export const hydrateDemoIcons = (root: ParentNode): void => {
	const containers = Array.from(root.querySelectorAll<HTMLElement>('[data-alt-demo-icon]'));

	for (const container of containers) {
		const name = container.dataset.altDemoIcon ?? '';
		if (!isDemoIconName(name)) continue;
		container.replaceChildren(createAltIcon(container.ownerDocument, name));
	}
};
