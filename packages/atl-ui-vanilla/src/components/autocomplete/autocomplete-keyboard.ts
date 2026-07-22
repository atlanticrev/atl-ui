export type AutocompleteKeyboardCallbacks = {
	clear: (event: Event) => void;
	close: (event: Event) => void;
	commitFreeSolo: (event: Event) => void;
	isFreeSolo: () => boolean;
	isOpen: () => boolean;
	move: (direction: 1 | -1, edge?: 'end' | 'start') => void;
	open: (event: Event) => void;
	selectActive: (event: Event) => boolean;
};

export const handleAutocompleteKeyDown = (event: KeyboardEvent, callbacks: AutocompleteKeyboardCallbacks): void => {
	if (event.isComposing || event.keyCode === 229) return;

	if (event.key === 'Escape') {
		callbacks.isOpen() ? callbacks.close(event) : callbacks.clear(event);
	} else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
		callbacks.open(event);

		callbacks.move(event.key === 'ArrowUp' ? -1 : 1);
	} else if (event.key === 'Home' || event.key === 'End') {
		if (!callbacks.isOpen()) return;

		callbacks.move(event.key === 'Home' ? 1 : -1, event.key === 'Home' ? 'start' : 'end');
	} else if (event.key === 'PageDown' || event.key === 'PageUp') {
		callbacks.open(event);

		const direction = event.key === 'PageUp' ? -1 : 1;

		for (let index = 0; index < 5; index += 1) callbacks.move(direction);
	} else if (event.key === 'Enter' && callbacks.isOpen()) {
		if (!callbacks.selectActive(event) && callbacks.isFreeSolo()) callbacks.commitFreeSolo(event);
	} else if (event.key === 'Tab') {
		callbacks.close(event);

		return;
	} else {
		return;
	}

	event.preventDefault();
};
