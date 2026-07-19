export type SelectCarrierOptions = {
	disabled?: boolean;
	form?: string;
	multiple?: boolean;
	name?: string;
	required?: boolean;
};

export const configureSelectCarrier = (carrier: HTMLSelectElement, options: SelectCarrierOptions): void => {
	carrier.disabled = options.disabled ?? false;
	carrier.multiple = options.multiple ?? false;
	carrier.name = options.name ?? '';
	carrier.required = options.required ?? false;

	if (options.form) {
		carrier.setAttribute('form', options.form);
	} else {
		carrier.removeAttribute('form');
	}
};

export const createSelectCarrier = (ownerDocument: Document, options: SelectCarrierOptions = {}): HTMLSelectElement => {
	const carrier = ownerDocument.createElement('select');
	carrier.hidden = true;
	carrier.setAttribute('aria-hidden', 'true');
	carrier.tabIndex = -1;
	configureSelectCarrier(carrier, options);
	return carrier;
};

export const setSelectCarrierValues = (carrier: HTMLSelectElement, values: readonly string[]): void => {
	const limit = carrier.multiple ? values.length : Math.min(values.length, 1);
	const normalized = [...new Set(values)].slice(0, limit);
	const options = normalized.map((value) => {
		const option = carrier.ownerDocument.createElement('option');
		option.defaultSelected = true;
		option.selected = true;
		option.textContent = value;
		option.value = value;
		return option;
	});

	carrier.replaceChildren(...options);

	if (normalized.length === 0) {
		carrier.selectedIndex = -1;
	}
};

export const bindFormReset = (
	carrier: HTMLSelectElement,
	onReset: (event: Event) => void,
	signal?: AbortSignal,
): (() => void) => {
	const form = carrier.form;

	if (!form || signal?.aborted) {
		return (): void => undefined;
	}

	let active = true;
	const cleanup = (): void => {
		if (!active) {
			return;
		}

		active = false;
		form.removeEventListener('reset', onReset);
		signal?.removeEventListener('abort', cleanup);
	};

	form.addEventListener('reset', onReset);
	signal?.addEventListener('abort', cleanup, {
		once: true,
	});
	return cleanup;
};
