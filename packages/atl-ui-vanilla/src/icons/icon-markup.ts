import { ALT_ICON_DEFINITIONS } from './icon-data';
import type { AltIconName } from './types';

const DEFAULT_ICON_SIZE = 20;

const normalizeSize = (size: number): number => {
	if (!Number.isFinite(size) || size <= 0) return DEFAULT_ICON_SIZE;
	return size;
};

export const altIconMarkup = (name: AltIconName, requestedSize = DEFAULT_ICON_SIZE): string => {
	const definition = ALT_ICON_DEFINITIONS[name];
	const size = normalizeSize(requestedSize);
	const paths = definition.paths
		.map((path) => `<path d="${path}" stroke="currentColor" stroke-linecap="round" ` +
			'stroke-linejoin="round" stroke-width="1.5"></path>')
		.join('');
	return `<svg aria-hidden="true" class="alt-icon" data-alt-icon="${name}" fill="none" ` +
		`focusable="false" height="${size}" viewBox="${definition.viewBox}" width="${size}">${paths}</svg>`;
};
