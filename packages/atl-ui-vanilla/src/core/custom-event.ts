export type TypedCustomEvent<T> = CustomEvent<T>;

export const createTypedEvent = <T>(
	type: string,
	detail: T,
	init: Omit<CustomEventInit<T>, 'detail'> = {},
): TypedCustomEvent<T> => {
	return new globalThis.CustomEvent<T>(type, {
		bubbles: true,
		composed: true,
		...init,
		detail,
	});
};
