import type { AltReplaceableIcon } from '../../icons';

import type { AltAlertIconMapping } from './types';

export type AlertContentState = {
	action: Node | null | undefined;
	closeIcon: AltReplaceableIcon;
	icon: AltReplaceableIcon;
	iconMapping: AltAlertIconMapping | null;
};

type AlertContentProperty = keyof AlertContentState;
type UpdateHost = HTMLElement & { requestUpdate: () => void };

const states = new WeakMap<HTMLElement, AlertContentState>();

export const getAlertContentState = (host: HTMLElement): AlertContentState => {
	let state = states.get(host);
	if (!state) {
		state = {
			action: undefined,
			closeIcon: undefined,
			icon: undefined,
			iconMapping: null,
		};
		states.set(host, state);
	}
	return state;
};

const defineContentProperty = (target: typeof HTMLElement.prototype, name: AlertContentProperty): void => {
	Object.defineProperty(target, name, {
		configurable: true,
		get(this: HTMLElement): AlertContentState[AlertContentProperty] {
			return getAlertContentState(this)[name];
		},
		set(this: UpdateHost, value: AlertContentState[AlertContentProperty]): void {
			getAlertContentState(this)[name] = value as never;
			this.requestUpdate();
		},
	});
};

export const defineAlertContentProperties = (target: typeof HTMLElement.prototype): void => {
	defineContentProperty(target, 'action');
	defineContentProperty(target, 'closeIcon');
	defineContentProperty(target, 'icon');
	defineContentProperty(target, 'iconMapping');
};
