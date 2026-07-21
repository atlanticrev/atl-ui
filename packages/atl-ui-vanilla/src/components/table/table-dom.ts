export type TableDom = {
	tbody: HTMLTableSectionElement;
	empty: HTMLTableRowElement;
	next: HTMLButtonElement;
	nextIcon: HTMLSpanElement;
	nextLabel: HTMLSpanElement;
	pagination: HTMLDivElement;
	previous: HTMLButtonElement;
	previousIcon: HTMLSpanElement;
	previousLabel: HTMLSpanElement;
	scroll: HTMLDivElement;
	table: HTMLTableElement;
	thead: HTMLTableSectionElement;
};

export const createTableDom = (host: HTMLElement): TableDom => {
	const document = host.ownerDocument;
	const scroll = document.createElement('div');
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const tbody = document.createElement('tbody');
	const empty = document.createElement('tr');
	const pagination = document.createElement('div');
	const previous = document.createElement('button');
	const next = document.createElement('button');
	const previousIcon = document.createElement('span');
	const previousLabel = document.createElement('span');
	const nextIcon = document.createElement('span');
	const nextLabel = document.createElement('span');
	scroll.className = 'alt-simple-table__scroll';
	scroll.role = 'region';
	scroll.tabIndex = 0;
	table.className = 'alt-simple-table__table';
	pagination.className = 'alt-simple-table__pagination';
	previous.className = 'alt-button';
	next.className = 'alt-button';
	previous.type = 'button';
	next.type = 'button';
	previous.dataset.variant = 'outlined';
	next.dataset.variant = 'outlined';
	previousIcon.className = 'alt-button__icon alt-button__icon--start';
	previousLabel.className = 'alt-button__content';
	nextIcon.className = 'alt-button__icon alt-button__icon--end';
	nextLabel.className = 'alt-button__content';
	previousIcon.hidden = true;
	nextIcon.hidden = true;
	previous.append(previousIcon, previousLabel);
	next.append(nextLabel, nextIcon);
	table.append(thead, tbody);
	scroll.append(table);
	pagination.append(previous, next);
	host.replaceChildren(scroll, pagination);
	return {
		tbody,
		empty,
		next,
		nextIcon,
		nextLabel,
		pagination,
		previous,
		previousIcon,
		previousLabel,
		scroll,
		table,
		thead,
	};
};
