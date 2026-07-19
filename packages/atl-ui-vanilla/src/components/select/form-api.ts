type PropertyTarget = typeof HTMLElement.prototype;

const customMessages = new WeakMap<HTMLElement, string>();

const getCarrier = (host: HTMLElement): HTMLSelectElement | null => {
	return host.querySelector<HTMLSelectElement>('.alt-select__native');
};

export const syncSelectCustomValidity = (host: HTMLElement, carrier: HTMLSelectElement): void => {
	carrier.setCustomValidity(customMessages.get(host) ?? '');
};

export const defineSelectFormApi = (target: PropertyTarget): void => {
	Object.defineProperties(target, {
		checkValidity: {
			value(this: HTMLElement): boolean {
				return getCarrier(this)?.checkValidity() ?? true;
			},
		},
		form: {
			get(this: HTMLElement): HTMLFormElement | null {
				return getCarrier(this)?.form ?? null;
			},
		},
		reportValidity: {
			value(this: HTMLElement): boolean {
				return getCarrier(this)?.reportValidity() ?? true;
			},
		},
		setCustomValidity: {
			value(this: HTMLElement, message: string): void {
				customMessages.set(this, message);
				getCarrier(this)?.setCustomValidity(message);
			},
		},
		validationMessage: {
			get(this: HTMLElement): string {
				return getCarrier(this)?.validationMessage ?? customMessages.get(this) ?? '';
			},
		},
		validity: {
			get(this: HTMLElement): ValidityState | undefined {
				return getCarrier(this)?.validity;
			},
		},
		willValidate: {
			get(this: HTMLElement): boolean {
				return getCarrier(this)?.willValidate ?? false;
			},
		},
	});
};
