import { bindFieldOutline } from '../field-outline/field-outline';

import type { SelectDom } from './dom';

export const bindSelectOutline = (host: HTMLElement, dom: SelectDom, signal: AbortSignal): void => {
	if (!dom.label || !dom.value || !dom.outline || !dom.outlinePath) {
		return;
	}

	bindFieldOutline(
		{
			getFloating: () => host.dataset.labelFloat === 'true' || host.matches(':focus-within'),
			host,
			label: dom.label,
			outline: dom.outline,
			outlinePath: dom.outlinePath,
			root: dom.trigger,
			text: dom.value,
		},
		signal,
	);
};
