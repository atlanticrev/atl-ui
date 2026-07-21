import type { AltReplaceableIcon } from '../../icons';

type UpdateHost = HTMLElement & { requestUpdate: () => void };
type IconName = 'clearIcon' | 'indicatorIcon' | 'noResultsIcon';

const icons: Record<IconName, WeakMap<HTMLElement, AltReplaceableIcon>> = {
	clearIcon: new WeakMap(),
	indicatorIcon: new WeakMap(),
	noResultsIcon: new WeakMap(),
};

const defineIconProperty = (target: typeof HTMLElement.prototype, name: IconName): void => {
	Object.defineProperty(target, name, {
		configurable: true,
		get(this: HTMLElement): AltReplaceableIcon {
			return icons[name].get(this);
		},
		set(this: UpdateHost, value: AltReplaceableIcon): void {
			icons[name].set(this, value);
			this.requestUpdate();
		},
	});
};

export const defineAutocompleteIconProperties = (target: typeof HTMLElement.prototype): void => {
	defineIconProperty(target, 'clearIcon');
	defineIconProperty(target, 'indicatorIcon');
	defineIconProperty(target, 'noResultsIcon');
};
