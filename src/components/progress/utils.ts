const DEFAULT_PROGRESS_MAX = 100;

export const normalizeProgressMax = (max: number): number => {
	if (Number.isFinite(max) && max > 0) {
		return max;
	}

	return DEFAULT_PROGRESS_MAX;
};

export const clampProgressValue = (
	value: number | null | undefined,
	max: number,
): number => {
	const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : 0;
	return Math.min(Math.max(numericValue, 0), max);
};

export const getProgressPercent = (value: number, max: number): number =>
	Math.round((value / max) * 100);
