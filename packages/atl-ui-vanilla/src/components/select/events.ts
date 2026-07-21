import { createTypedEvent } from '../../core';

import type { SelectModel } from './model';
import { ALT_SELECT_CHANGE_EVENT, type AltSelectChangeDetail } from './types';

export const emitSelectChange = (
	host: HTMLElement,
	model: SelectModel,
	reason: AltSelectChangeDetail['reason'],
	sourceEvent?: Event,
): void => {
	const option = model.options.find((candidate) => candidate.value === model.activeValue);
	const detail: AltSelectChangeDetail = {
		option,
		reason,
		sourceEvent,
		value: model.value,
		values: model.values,
	};
	host.dispatchEvent(createTypedEvent(ALT_SELECT_CHANGE_EVENT, detail));
};
