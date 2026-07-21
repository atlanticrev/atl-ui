import { emitSelectChange } from './events';
import type { SelectInteractionCallbacks } from './interactions';
import type { SelectModel } from './model';

export type SelectOverlayActions = {
	close: (event?: Event) => void;
	isOpen: () => boolean;
	open: (event?: Event) => void;
	toggle: (event?: Event) => void;
};

export const createSelectionInteractions = (
	host: HTMLElement,
	model: SelectModel,
	overlay: SelectOverlayActions,
	render: () => void,
): SelectInteractionCallbacks => {
	const shouldCloseOnSelect = (): boolean => {
		const configured = host.getAttribute('close-on-select');
		return configured === null ? !host.hasAttribute('multiple') : configured !== 'false';
	};
	const selectActive = (event?: Event): void => {
		if (!overlay.isOpen()) {
			overlay.open(event);
			return;
		}

		if (host.hasAttribute('readonly')) {
			return;
		}

		const wasSelected = model.activeValue ? model.values.includes(model.activeValue) : false;
		if (model.selectActive()) {
			const reason = host.hasAttribute('multiple') && wasSelected ? 'remove' : 'select';
			emitSelectChange(host, model, reason, event);
		}

		shouldCloseOnSelect() ? overlay.close(event) : render();
	};

	return {
		choose: (value, event): void => {
			const option = model.options.find((candidate) => candidate.value === value);

			if (option && !option.disabled) {
				model.activeValue = value;
				selectActive(event);
			}
		},
		close: overlay.close,
		isOpen: overlay.isOpen,
		move: (direction, edge): void => {
			model.moveActive(direction, edge);
			render();
		},
		open: overlay.open,
		refreshOptions: (): void => {
			model.refreshOptions();
			render();
		},
		selectActive,
		toggle: overlay.toggle,
		typeahead: (query): void => {
			model.moveToMatch(query);
			render();
		},
	};
};
