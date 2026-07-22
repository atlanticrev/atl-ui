export type ProgressDom = {
	circle: SVGCircleElement;
	circleTrack: SVGCircleElement;
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

	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	const circleTrack = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

	header.className = 'alt-progress__header';

	label.className = 'alt-progress__label';

	value.className = 'alt-progress__value';

	control.className = 'alt-progress__control';

	track.className = 'alt-progress__track';

	fill.className = 'alt-progress__fill';

	svg.classList.add('alt-progress__circle');

	svg.setAttribute('aria-hidden', 'true');

	svg.setAttribute('viewBox', '0 0 44 44');

	for (const element of [circleTrack, circle]) {
		element.setAttribute('cx', '22');

		element.setAttribute('cy', '22');

		element.setAttribute('r', '18');
	}

	circleTrack.classList.add('alt-progress__circle-track');

	circle.classList.add('alt-progress__circle-fill');

	svg.append(circleTrack, circle);

	label.id = `${host.id || `alt-progress-${++progressId}`}-label`;

	header.append(label, value);

	track.append(control, fill, svg);

	host.replaceChildren(header, track);

	return { circle, circleTrack, control, fill, header, label, track, value };
};
