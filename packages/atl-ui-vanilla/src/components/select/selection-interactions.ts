import { createTypedEvent } from '../../core';

import type { SelectInteractionCallbacks } from './interactions';
import type { SelectModel } from './model';
import { ALT_SELECT_CHANGE_EVENT, type AltSelectChangeDetail } from './types';

export type SelectOverlayActions = {
	close: () => void;
	isOpen: () => boolean;
	open: () => void;
	toggle: () => void;
};

const emitChange = (host: HTMLElement, model: SelectModel): void => {
	const detail: AltSelectChangeDetail = {
		value: model.value,
		values: model.values,
	};
	host.dispatchEvent(createTypedEvent(ALT_SELECT_CHANGE_EVENT, detail));
};

export const createSelectionInteractions = (
	host: HTMLElement,
	model: SelectModel,
	overlay: SelectOverlayActions,
	render: () => void,
): SelectInteractionCallbacks => {
	const selectActive = (): void => {
		if (!overlay.isOpen()) {
			overlay.open();
			return;
		}

		if (model.selectActive()) {
			emitChange(host, model);
		}

		host.hasAttribute('multiple') ? render() : overlay.close();
	};

	return {
		choose: (value): void => {
			const option = model.options.find((candidate) => candidate.value === value);

			if (option && !option.disabled) {
				model.activeValue = value;
				selectActive();
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
	};
};
