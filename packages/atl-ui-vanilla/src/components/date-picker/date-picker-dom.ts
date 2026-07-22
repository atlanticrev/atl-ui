import { createSelectCarrier } from '../../controllers';
import { createAltIcon } from '../../icons';

export type DatePickerDom = {
	calendar: HTMLElement;
	clear: HTMLButtonElement;
	endCarrier: HTMLSelectElement;
	panel: HTMLDivElement;
	startCarrier: HTMLSelectElement;
	trigger: HTMLButtonElement;
	value: HTMLSpanElement;
};

let pickerId = 0;

export const createDatePickerDom = (host: HTMLElement): DatePickerDom => {
	const document = host.ownerDocument;

	const root = document.createElement('div');

	const trigger = document.createElement('button');

	const value = document.createElement('span');

	const clear = document.createElement('button');

	const panel = document.createElement('div');

	const calendar = document.createElement('alt-calendar');

	const startCarrier = createSelectCarrier(document);

	const endCarrier = createSelectCarrier(document);

	const panelId = `${host.id || `alt-date-picker-${++pickerId}`}-panel`;

	root.className = 'alt-date-picker__field';

	trigger.type = 'button';

	trigger.className = 'alt-date-picker__trigger';

	trigger.setAttribute('aria-haspopup', 'dialog');

	trigger.setAttribute('aria-controls', panelId);

	value.className = 'alt-date-picker__value';

	clear.type = 'button';

	clear.className = 'alt-button alt-date-picker__clear';

	clear.dataset.elevation = 'none';

	clear.dataset.iconOnly = '';

	clear.dataset.size = '24';

	clear.dataset.variant = 'text';

	clear.setAttribute('aria-label', 'Clear date');

	clear.append(createAltIcon(document, 'close', { size: 16 }));

	panel.className = 'alt-date-picker__panel';

	panel.id = panelId;

	panel.setAttribute('role', 'dialog');

	panel.setAttribute('aria-label', 'Choose date');

	panel.setAttribute('popover', 'manual');

	panel.hidden = true;

	panel.append(calendar);

	root.append(trigger, clear);

	trigger.append(value);

	startCarrier.dataset.altDateCarrier = 'start';

	endCarrier.dataset.altDateCarrier = 'end';

	host.replaceChildren(root, panel, startCarrier, endCarrier);

	return { calendar, clear, endCarrier, panel, startCarrier, trigger, value };
};
