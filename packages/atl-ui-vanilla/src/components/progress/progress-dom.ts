export type ProgressDom = {
	control: HTMLProgressElement;
	fill: HTMLSpanElement;
	header: HTMLDivElement;
	label: HTMLSpanElement;
	track: HTMLDivElement;
	value: HTMLSpanElement;
};

let progressId = 0;

export const createProgressDom = (host: HTMLElement): ProgressDom => {
	const document = host.ownerDocument;
	const header = document.createElement('div');
	const label = document.createElement('span');
	const value = document.createElement('span');
	const control = document.createElement('progress');
	const track = document.createElement('div');
	const fill = document.createElement('span');
	header.className = 'alt-progress__header';
	label.className = 'alt-progress__label';
	value.className = 'alt-progress__value';
	control.className = 'alt-progress__control';
	track.className = 'alt-progress__track';
	fill.className = 'alt-progress__fill';
	label.id = `${host.id || `alt-progress-${++progressId}`}-label`;
	header.append(label, value);
	track.append(control, fill);
	host.replaceChildren(header, track);
	return { control, fill, header, label, track, value };
};
