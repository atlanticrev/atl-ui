import type {
	AltAutocompleteElementApi,
	AltDialogElementApi,
	AltPopupElementApi,
	AltTableElementApi,
	AltToastElementApi,
} from '../src';
import { defineAllAltElements } from '../src';

import { hydrateDemoIcons } from './icon-hydration';

type DemoRecord = Record<string, unknown> & { channel: string; status: string };
type DemoState = { errors: string[]; ready: boolean };

const getElement = <ElementType extends HTMLElement>(id: string): ElementType => {
	const element = document.getElementById(id);
	if (!element) throw new Error(`Missing demo element: ${id}`);
	return element as ElementType;
};

defineAllAltElements();
hydrateDemoIcons(document);

const state: DemoState = { errors: [], ready: false };
Reflect.set(window, 'altComponentsDemo', state);
window.addEventListener('error', (event) => state.errors.push(event.message));
window.addEventListener('unhandledrejection', (event) => state.errors.push(String(event.reason)));

const autocomplete = getElement<AltAutocompleteElementApi>('demo-autocomplete');
autocomplete.options = [
	{ description: 'Design workspace', label: 'Figma', value: 'figma' },
	{ description: 'Issue tracking', label: 'Linear', value: 'linear' },
	{ description: 'Docs and notes', label: 'Notion', value: 'notion' },
];

const table = getElement<AltTableElementApi<DemoRecord>>('demo-table');
table.columns = [
	{ dataIndex: 'channel', title: 'Channel' },
	{ dataIndex: 'status', title: 'Status' },
];
table.dataSource = [
	{ channel: 'YouTube', status: 'Ready' },
	{ channel: 'TikTok', status: 'Scheduled' },
];
table.rowKey = 'channel';

const popup = getElement<AltPopupElementApi>('demo-popup');
popup.anchor = getElement('popup-button');
getElement('popup-button').addEventListener('click', () => popup.toggle());

const dialog = getElement<AltDialogElementApi>('demo-dialog');
getElement('dialog-button').addEventListener('click', () => dialog.showModal());

const toast = getElement<AltToastElementApi>('toast-region');
getElement('toast-button').addEventListener('click', () => {
	toast.push({ message: 'All components are running', status: 'success' });
});

const themeButton = getElement<HTMLButtonElement>('theme-button');
themeButton.addEventListener('click', () => {
	const dark = document.documentElement.dataset.altTheme !== 'dark';
	document.documentElement.dataset.altTheme = dark ? 'dark' : 'light';
	themeButton.textContent = dark ? 'Light theme' : 'Dark theme';
});

state.ready = true;
document.documentElement.dataset.demoReady = 'true';
