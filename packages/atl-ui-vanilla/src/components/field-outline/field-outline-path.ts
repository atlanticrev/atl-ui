export type FieldOutlinePathOptions = {
	height: number;
	notchStart: number;
	notchWidth: number;
	radius: number;
	strokeWidth: number;
	width: number;
};

const DECIMAL_PRECISION = 1000;

const clamp = (value: number, minimum: number, maximum: number): number => {
	return Math.min(Math.max(value, minimum), maximum);
};

const formatNumber = (value: number): string => {
	const rounded = Math.round(value * DECIMAL_PRECISION) / DECIMAL_PRECISION;
	return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(/\.?0+$/, '');
};

const buildSharpPath = (
	left: number,
	top: number,
	right: number,
	bottom: number,
	gapStart: number,
	gapEnd: number,
): string => {
	if (gapEnd <= gapStart) {
		return (
			`M ${formatNumber(left)} ${formatNumber(top)} H ${formatNumber(right)} ` +
			`V ${formatNumber(bottom)} H ${formatNumber(left)} V ${formatNumber(top)}`
		);
	}

	return (
		`M ${formatNumber(left)} ${formatNumber(top)} H ${formatNumber(gapStart)} ` +
		`M ${formatNumber(gapEnd)} ${formatNumber(top)} H ${formatNumber(right)} ` +
		`V ${formatNumber(bottom)} H ${formatNumber(left)} V ${formatNumber(top)}`
	);
};

export const buildFieldOutlinePath = (options: FieldOutlinePathOptions): string => {
	if (options.width <= options.strokeWidth || options.height <= options.strokeWidth) return '';

	const inset = options.strokeWidth / 2;

	const left = inset;

	const top = inset;

	const right = options.width - inset;

	const bottom = options.height - inset;

	const maximumRadius = Math.min(
		(options.width - options.strokeWidth) / 2,
		(options.height - options.strokeWidth) / 2,
	);

	const radius = clamp(options.radius - inset, 0, maximumRadius);

	const topStart = left + radius;

	const topEnd = right - radius;

	const gapStart = clamp(options.notchStart, topStart, topEnd);

	const gapEnd = clamp(options.notchStart + options.notchWidth, gapStart, topEnd);

	if (radius === 0) return buildSharpPath(left, top, right, bottom, gapStart, gapEnd);

	const topPath =
		gapEnd > gapStart
			? `M ${formatNumber(topStart)} ${formatNumber(top)} H ${formatNumber(gapStart)} ` +
				`M ${formatNumber(gapEnd)} ${formatNumber(top)} H ${formatNumber(topEnd)}`
			: `M ${formatNumber(topStart)} ${formatNumber(top)} H ${formatNumber(topEnd)}`;

	return (
		`${topPath} A ${formatNumber(radius)} ${formatNumber(radius)} 0 0 1 ` +
		`${formatNumber(right)} ${formatNumber(top + radius)} V ${formatNumber(bottom - radius)} ` +
		`A ${formatNumber(radius)} ${formatNumber(radius)} 0 0 1 ${formatNumber(right - radius)} ` +
		`${formatNumber(bottom)} H ${formatNumber(left + radius)} A ${formatNumber(radius)} ` +
		`${formatNumber(radius)} 0 0 1 ${formatNumber(left)} ${formatNumber(bottom - radius)} ` +
		`V ${formatNumber(top + radius)} A ${formatNumber(radius)} ${formatNumber(radius)} 0 0 1 ` +
		`${formatNumber(left + radius)} ${formatNumber(top)}`
	);
};
