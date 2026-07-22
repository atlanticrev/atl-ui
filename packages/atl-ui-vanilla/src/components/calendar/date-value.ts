const DATE_VALUE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const parseDateValue = (value: string | null | undefined): Date | null => {
	const match = value?.match(DATE_VALUE);

	if (!match) return null;

	const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));

	return formatDateValue(date) === value ? date : null;
};

export const formatDateValue = (date: Date): string => {
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
		date.getUTCDate(),
	).padStart(2, '0')}`;
};

export const addDays = (date: Date, amount: number): Date => {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + amount));
};

export const addMonths = (date: Date, amount: number): Date => {
	const first = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));

	const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();

	return new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(date.getUTCDate(), lastDay)));
};

export const addYears = (date: Date, amount: number): Date => {
	return new Date(Date.UTC(date.getUTCFullYear() + amount, date.getUTCMonth(), 1));
};

export const startOfMonthGrid = (date: Date, firstDay: number): Date => {
	const first = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

	return addDays(first, -((first.getUTCDay() - firstDay + 7) % 7));
};

export const todayValue = (): string => {
	const now = new Date();

	return formatDateValue(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
};

export const clampDateValue = (value: string, min: string | null, max: string | null): string => {
	if (min && value < min) return min;

	if (max && value > max) return max;

	return value;
};
