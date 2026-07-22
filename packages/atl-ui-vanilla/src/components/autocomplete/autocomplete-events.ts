import { createTypedEvent } from '../../core';

import type {
	AltAutocompleteChangeDetail,
	AltAutocompleteChangeReason,
	AltAutocompleteInputDetail,
	AltAutocompleteOption,
} from './types';

export const emitAutocompleteInput = (
	host: HTMLElement,
	value: string,
	reason: AltAutocompleteInputDetail['reason'],
	sourceEvent?: Event,
): void => {
	host.dispatchEvent(
		createTypedEvent<AltAutocompleteInputDetail>('alt-input', {
			reason,
			sourceEvent,
			value,
		}),
	);
};

export const emitAutocompleteChange = (
	host: HTMLElement,
	values: readonly string[],
	reason: AltAutocompleteChangeReason,
	option?: AltAutocompleteOption,
	sourceEvent?: Event,
): void => {
	const detail: AltAutocompleteChangeDetail = {
		option,
		reason,
		sourceEvent,
		value: values[0] ?? '',
		values,
	};

	host.dispatchEvent(createTypedEvent('alt-change', detail));
};
