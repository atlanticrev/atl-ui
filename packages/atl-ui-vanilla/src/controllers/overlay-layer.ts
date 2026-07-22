type PopoverElement = HTMLElement & {
	togglePopover?: (force?: boolean) => boolean;
};

const captureThemeProperties = (overlay: HTMLElement): (() => void) => {
	const computed = overlay.ownerDocument.defaultView?.getComputedStyle(overlay);

	if (!computed) return (): void => undefined;

	const properties = new Map<string, string>();

	const collect = (styles: CSSStyleDeclaration): void => {
		for (let index = 0; index < styles.length; index += 1) {
			const name = styles.item(index);

			if (!name.startsWith('--alt-') || properties.has(name)) continue;

			const value = styles.getPropertyValue(name);

			if (value) properties.set(name, value);
		}
	};

	collect(computed);

	let ancestor = overlay.parentElement;

	while (ancestor) {
		collect(ancestor.style);

		ancestor = ancestor.parentElement;
	}

	const applied: string[] = [];

	for (const [name, value] of properties) {
		if (overlay.style.getPropertyValue(name)) continue;

		overlay.style.setProperty(name, value);

		applied.push(name);
	}

	return (): void => {
		for (const name of applied) overlay.style.removeProperty(name);
	};
};

const portalToBody = (overlay: HTMLElement): (() => void) => {
	const parent = overlay.parentNode;

	const nextSibling = overlay.nextSibling;

	const restoreTheme = captureThemeProperties(overlay);

	overlay.ownerDocument.body.append(overlay);

	return (): void => {
		if (parent) {
			if (nextSibling?.parentNode === parent) parent.insertBefore(overlay, nextSibling);
			else parent.appendChild(overlay);
		} else overlay.remove();

		restoreTheme();
	};
};

export const bindOverlayLayer = (overlay: HTMLElement, signal?: AbortSignal): (() => void) => {
	if (signal?.aborted) return (): void => undefined;

	const popover = overlay as PopoverElement;

	overlay.setAttribute('popover', 'manual');

	overlay.hidden = false;

	const restoreLayer =
		typeof popover.togglePopover === 'function'
			? (): void => {
					if (overlay.isConnected) popover.togglePopover?.(false);
				}
			: portalToBody(overlay);

	if (typeof popover.togglePopover === 'function') popover.togglePopover(true);

	let active = true;

	const cleanup = (): void => {
		if (!active) return;

		active = false;

		signal?.removeEventListener('abort', cleanup);

		restoreLayer();

		overlay.hidden = true;
	};

	signal?.addEventListener('abort', cleanup, { once: true });

	return cleanup;
};
