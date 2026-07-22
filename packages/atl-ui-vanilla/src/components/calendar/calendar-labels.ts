const createFormatter = (locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat => {
	return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' });
};

export const monthLabel = (date: Date, locale: string): string => {
	return createFormatter(locale, { month: 'long', year: 'numeric' }).format(date);
};

export const monthNames = (year: number, locale: string): string[] => {
	const formatter = createFormatter(locale, { month: 'short' });

	return Array.from({ length: 12 }, (_, month) => formatter.format(new Date(Date.UTC(year, month, 1))));
};

export const weekdayNames = (firstDay: number, locale: string): string[] => {
	const formatter = createFormatter(locale, { weekday: 'short' });

	return Array.from({ length: 7 }, (_, offset) => {
		const day = 7 + ((firstDay + offset) % 7);

		return formatter.format(new Date(Date.UTC(2024, 0, day)));
	});
};

export const dateLabel = (date: Date, locale: string): string => {
	return createFormatter(locale, { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' }).format(date);
};
