import { syncAltIconContent, type AltReplaceableIcon } from '../../icons';

import type { SelectDom } from './dom';

type SelectUpdateHost = HTMLElement & {
	requestUpdate: () => void;
};

const indicatorIcons = new WeakMap<HTMLElement, AltReplaceableIcon>();
const leadingIcons = new WeakMap<HTMLElement, Node | null>();

export const readSelectIndicatorIcon = (host: HTMLElement): AltReplaceableIcon => {
	return indicatorIcons.get(host);
};

export const defineSelectIndicatorIconProperty = (target: typeof HTMLElement.prototype): void => {
	Object.defineProperty(target, 'indicatorIcon', {
		configurable: true,
		get(this: HTMLElement): AltReplaceableIcon {
			return readSelectIndicatorIcon(this);
		},
		set(this: SelectUpdateHost, value: AltReplaceableIcon): void {
			indicatorIcons.set(this, value);

			this.requestUpdate();
		},
	});
};

export const defineSelectLeadingIconProperty = (target: typeof HTMLElement.prototype): void => {
	Object.defineProperty(target, 'leadingIcon', {
		configurable: true,
		get(this: HTMLElement): Node | null {
			return leadingIcons.get(this) ?? null;
		},
		set(this: SelectUpdateHost, value: Node | null): void {
			leadingIcons.set(this, value);

			this.requestUpdate();
		},
	});
};

export const syncSelectIndicatorIcon = (host: HTMLElement, dom: SelectDom): void => {
	if (dom.trigger.dataset.altOwned !== 'select-trigger' || !dom.indicator) return;

	const leadingIcon = leadingIcons.get(host) ?? null;

	host.dataset.hasLeadingIcon = String(Boolean(leadingIcon));

	if (dom.leadingIcon) {
		dom.leadingIcon.hidden = !leadingIcon;

		if (leadingIcon && dom.leadingIcon.firstChild !== leadingIcon) dom.leadingIcon.replaceChildren(leadingIcon);

		if (!leadingIcon && dom.leadingIcon.childNodes.length > 0) dom.leadingIcon.replaceChildren();
	}

	const customIcon = readSelectIndicatorIcon(host);

	syncAltIconContent(dom.indicator, customIcon, 'chevron-down', { size: 18 });
};
