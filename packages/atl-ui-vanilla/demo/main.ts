import type { AltSelectElementApi, AltToastElementApi } from '../src';
import { defineAllAltElements } from '../src';
import '../src/styles/default.scss';
import './demo.scss';

type DemoState = {
	errors: string[];
	events: string[];
};

const getElement = <ElementType extends HTMLElement>(id: string): ElementType => {
	const element = document.getElementById(id);

	if (!element) {
		throw new Error(`Missing demo element: ${id}`);
	}

	return element as unknown as ElementType;
};

defineAllAltElements();

const demoState: DemoState = {
	errors: [],
	events: [],
};
const form = getElement<HTMLFormElement>('post-form');
const formOutput = getElement<HTMLOutputElement>('form-output');
const toastRegion = getElement<AltToastElementApi>('toast-region');
const themeButton = getElement<HTMLButtonElement>('theme-button');

Reflect.set(window, 'altDemo', demoState);

const recordEvent = (event: Event): void => {
	const detail = 'detail' in event ? JSON.stringify(event.detail) : '';
	demoState.events.push(`${event.type}:${detail}`);
};

const handleError = (event: ErrorEvent): void => {
	demoState.errors.push(event.message);
};

const handleRejection = (event: PromiseRejectionEvent): void => {
	demoState.errors.push(String(event.reason));
};

const handleSubmit = (event: SubmitEvent): void => {
	event.preventDefault();
	const values: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

	new FormData(form).forEach((value, key) => {
		const current = values[key];
		values[key] = current === undefined ? value : ([] as FormDataEntryValue[]).concat(current, value);
	});
	formOutput.value = JSON.stringify(values, null, 2);
};

const handleReset = (): void => {
	queueMicrotask(() => {
		formOutput.value = 'Form was reset.';
	});
};

const handleTheme = (): void => {
	const root = document.documentElement;
	const nextTheme = root.dataset.altTheme === 'dark' ? 'light' : 'dark';
	root.dataset.altTheme = nextTheme;
	themeButton.textContent = nextTheme === 'dark' ? 'Light theme' : 'Dark theme';
};

const showSuccessToast = (): void => {
	toastRegion.push({
		message: 'Post published successfully',
		status: 'success',
	});
};

const showErrorToast = (): void => {
	toastRegion.push({
		message: 'Publishing failed. Try again.',
		status: 'error',
	});
};

window.addEventListener('error', handleError);
window.addEventListener('unhandledrejection', handleRejection);
form.addEventListener('submit', handleSubmit);
form.addEventListener('reset', handleReset);
themeButton.addEventListener('click', handleTheme);
getElement('success-toast').addEventListener('click', showSuccessToast);
getElement('error-toast').addEventListener('click', showErrorToast);

document.querySelectorAll<AltSelectElementApi>('alt-select').forEach((select) => {
	select.addEventListener('alt-change', recordEvent as EventListener);
});
getElement('content-tabs').addEventListener('alt-change', recordEvent as EventListener);
toastRegion.addEventListener('alt-dismiss', recordEvent as EventListener);
document.documentElement.dataset.demoReady = 'true';
