export type AltInputSize = 'xl' | 'l' | 'm' | 's' | 'xs';

export type AltInputStatus = 'default' | 'error' | 'success';

export type AltInputVariant = 'number' | 'text';

export type AltInputChangeDetail = {
	value: string;
};

export type AltInputElementApi = HTMLElement & {
	checkValidity: () => boolean;
	disabled: boolean;
	form: HTMLFormElement | null;
	inputElement: HTMLInputElement | null;
	leadingIcon: Node | null;
	readOnly: boolean;
	readOnlyStyled: boolean;
	reportValidity: () => boolean;
	select: () => void;
	setCustomValidity: (message: string) => void;
	trailingIcon: Node | null;
	validationMessage: string;
	validity: ValidityState | null;
	value: string;
	variant: AltInputVariant;
};
