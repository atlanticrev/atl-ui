import type { InputDom } from './input-dom';
import type { AltInputElementApi } from './types';

export type InputPropertiesElement = AltInputElementApi & {
	inputDom: InputDom | undefined;
	pendingLeadingIcon: Node | null;
	pendingTrailingIcon: Node | null;
	pendingValue: string | undefined;
	requestUpdate: () => void;
};

export type InputPropertiesConstructor = new () => InputPropertiesElement;
