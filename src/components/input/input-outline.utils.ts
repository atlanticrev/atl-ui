export type InputOutlineMetrics = {
	height: number;
	radius: number;
	width: number;
};

type BuildInputOutlinePathParams = {
	height: number;
	notchStart: number;
	notchWidth: number;
	radius: number;
	strokeWidth: number;
	width: number;
};

export const EMPTY_INPUT_OUTLINE_METRICS: InputOutlineMetrics = {
	height: 0,
	radius: 0,
	width: 0,
};

export const INPUT_LABEL_GAP_OFFSET = 8;
export const INPUT_LABEL_GAP_PADDING = 16;

const DECIMAL_PRECISION = 1000;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const formatSvgNumber = (value: number): string => {
	const roundedValue = Math.round(value * DECIMAL_PRECISION) / DECIMAL_PRECISION;
	return Number.isInteger(roundedValue) ? String(roundedValue) : String(roundedValue).replace(/\.?0+$/, '');
};

const buildSharpOutlinePath = (
	left: number,
	top: number,
	right: number,
	bottom: number,
	gapStart: number,
	gapEnd: number,
): string => {
	const hasGap = gapEnd > gapStart;

	if (!hasGap) {
		return [
			'M',
			formatSvgNumber(left),
			formatSvgNumber(top),
			'H',
			formatSvgNumber(right),
			'V',
			formatSvgNumber(bottom),
			'H',
			formatSvgNumber(left),
			'V',
			formatSvgNumber(top),
		].join(' ');
	}

	return [
		'M',
		formatSvgNumber(left),
		formatSvgNumber(top),
		'H',
		formatSvgNumber(gapStart),
		'M',
		formatSvgNumber(gapEnd),
		formatSvgNumber(top),
		'H',
		formatSvgNumber(right),
		'V',
		formatSvgNumber(bottom),
		'H',
		formatSvgNumber(left),
		'V',
		formatSvgNumber(top),
	].join(' ');
};

const buildRoundedOutlinePath = (
	left: number,
	top: number,
	right: number,
	bottom: number,
	radius: number,
	gapStart: number,
	gapEnd: number,
): string => {
	const topStart = left + radius;
	const topEnd = right - radius;
	const hasGap = gapEnd > gapStart;

	const path = [
		'M',
		formatSvgNumber(topStart),
		formatSvgNumber(top),
		'H',
		formatSvgNumber(hasGap ? gapStart : topEnd),
	];

	if (hasGap) {
		path.push(
			'M',
			formatSvgNumber(gapEnd),
			formatSvgNumber(top),
			'H',
			formatSvgNumber(topEnd),
		);
	}

	path.push(
		'A',
		formatSvgNumber(radius),
		formatSvgNumber(radius),
		'0 0 1',
		formatSvgNumber(right),
		formatSvgNumber(top + radius),
		'V',
		formatSvgNumber(bottom - radius),
		'A',
		formatSvgNumber(radius),
		formatSvgNumber(radius),
		'0 0 1',
		formatSvgNumber(right - radius),
		formatSvgNumber(bottom),
		'H',
		formatSvgNumber(left + radius),
		'A',
		formatSvgNumber(radius),
		formatSvgNumber(radius),
		'0 0 1',
		formatSvgNumber(left),
		formatSvgNumber(bottom - radius),
		'V',
		formatSvgNumber(top + radius),
		'A',
		formatSvgNumber(radius),
		formatSvgNumber(radius),
		'0 0 1',
		formatSvgNumber(left + radius),
		formatSvgNumber(top),
	);

	return path.join(' ');
};

export const buildInputOutlinePath = ({
	height,
	notchStart,
	notchWidth,
	radius,
	strokeWidth,
	width,
}: BuildInputOutlinePathParams): string => {
	if (width <= strokeWidth || height <= strokeWidth) {
		return '';
	}

	const inset = strokeWidth / 2;
	const left = inset;
	const top = inset;
	const right = width - inset;
	const bottom = height - inset;
	const maxRadius = Math.min((width - strokeWidth) / 2, (height - strokeWidth) / 2);
	const normalizedRadius = clamp(radius - inset, 0, maxRadius);
	const topStart = left + normalizedRadius;
	const topEnd = right - normalizedRadius;
	const gapStart = clamp(notchStart, topStart, topEnd);
	const gapEnd = clamp(notchStart + notchWidth, gapStart, topEnd);

	if (normalizedRadius === 0) {
		return buildSharpOutlinePath(left, top, right, bottom, gapStart, gapEnd);
	}

	return buildRoundedOutlinePath(left, top, right, bottom, normalizedRadius, gapStart, gapEnd);
};
