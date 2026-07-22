const COMPATIBILITY_CLICK_WINDOW_MS = 500;

export type CompatibilityClickGuard = {
	arm: () => void;
	dispose: () => void;
};

export const bindCompatibilityClickGuard = (surface: HTMLElement): CompatibilityClickGuard => {
	let armed = false;

	let timer: number | undefined;

	const disarm = (): void => {
		armed = false;

		if (timer !== undefined) surface.ownerDocument.defaultView?.clearTimeout(timer);

		timer = undefined;
	};

	const handleClick = (event: MouseEvent): void => {
		if (!armed) return;

		disarm();

		event.preventDefault();

		event.stopPropagation();
	};

	surface.addEventListener('click', handleClick, true);

	return {
		arm: () => {
			disarm();

			armed = true;

			timer = surface.ownerDocument.defaultView?.setTimeout(disarm, COMPATIBILITY_CLICK_WINDOW_MS);
		},
		dispose: () => {
			disarm();

			surface.removeEventListener('click', handleClick, true);
		},
	};
};
