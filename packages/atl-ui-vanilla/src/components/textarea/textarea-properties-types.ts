import type { TextareaDom } from './textarea-dom';
import type { AltTextareaElementApi } from './types';

export type TextareaPropertiesElement = AltTextareaElementApi & {
	pendingValue: string | undefined;
	requestUpdate: () => void;
	textareaDom: TextareaDom | undefined;
};

export type TextareaPropertiesConstructor = new () => TextareaPropertiesElement;
