import type { AltIconName } from './types';

export type AltIconDefinition = {
	paths: readonly string[];
	viewBox: string;
};

const icon = (...paths: string[]): AltIconDefinition => ({
	paths,
	viewBox: '0 0 24 24',
});

export const ALT_ICON_DEFINITIONS: Record<AltIconName, AltIconDefinition> = {
	'arrow-left': icon('M19 12H5', 'M11 6l-6 6 6 6'),
	'arrow-right': icon('M5 12h14', 'M13 6l6 6-6 6'),
	chart: icon(
		'M12 3v9h9A9 9 0 0 0 12 3Z',
		'M9 5.2A8.5 8.5 0 1 0 18.8 15H9V5.2Z',
	),
	check: icon('M5 12.5 9.5 17 19 7'),
	'chevron-down': icon('M6 9l6 6 6-6'),
	'chevron-right': icon('M9 6l6 6-6 6'),
	close: icon('M7 7l10 10', 'M17 7 7 17'),
	error: icon('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M9 9l6 6', 'M15 9l-6 6'),
	eye: icon(
		'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z',
		'M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
	),
	grid: icon('M4 4h6v6H4Z', 'M14 4h6v6h-6Z', 'M4 14h6v6H4Z', 'M14 14h6v6h-6Z'),
	home: icon('M3.5 10.5 12 3.8l8.5 6.7V20h-6v-6h-5v6h-6v-9.5Z'),
	info: icon('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 11v6', 'M12 7h.01'),
	plus: icon('M12 5v14', 'M5 12h14'),
	search: icon('M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z', 'M16 16l5 5'),
	star: icon('m12 3.5 2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 17.8 6.8 20.5l.99-5.79-4.21-4.1 5.82-.85L12 3.5Z'),
	upload: icon('M12 16V5', 'M7.5 9.5 12 5l4.5 4.5', 'M5 19h14'),
	warning: icon('M12 3 2.5 20h19L12 3Z', 'M12 9v4', 'M12 17h.01'),
};
