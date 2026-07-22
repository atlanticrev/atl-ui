import type { SelectModel } from '../select/model';

export type DropdownCallbacks = {
	onChange: () => void;
	onRender: () => void;
	onSelectAll: () => void;
};

export const bindDropdownInteractions = (
	host: HTMLElement,
	model: SelectModel,
	callbacks: DropdownCallbacks,
	signal: AbortSignal,
): void => {
	host.addEventListener(
		'click',
		(event) => {
			const target = event.target as Element | null;

			if (target?.closest('.alt-listbox__select-all')) return callbacks.onSelectAll();

			const option = target?.closest<HTMLElement>('.alt-listbox__option');

			if (!option || option.getAttribute('aria-disabled') === 'true') return;

			model.activeValue = option.dataset.value;

			if (model.selectActive()) callbacks.onChange();
		},
		{ signal },
	);

	host.addEventListener(
		'keydown',
		(event) => {
			if (!(event instanceof KeyboardEvent)) return;

			if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
				event.preventDefault();

				const edge = event.key === 'Home' ? 'start' : event.key === 'End' ? 'end' : undefined;

				model.moveActive(event.key === 'ArrowUp' ? -1 : 1, edge);

				callbacks.onRender();
			}

			if ((event.key === 'Enter' || event.key === ' ') && model.activeValue) {
				event.preventDefault();

				if (model.selectActive()) callbacks.onChange();
			}
		},
		{ signal },
	);
};
