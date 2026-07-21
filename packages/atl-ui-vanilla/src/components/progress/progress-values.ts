const DEFAULT_MAX = 100;

export const normalizeProgressMax = (value: number): number => {
	return Number.isFinite(value) && value > 0 ? value : DEFAULT_MAX;
};

export const clampProgressValue = (value: number, max: number): number => {
	return Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), max);
};

export const getProgressPercent = (value: number, max: number): number => {
	return Math.round((value / max) * 100);
};
