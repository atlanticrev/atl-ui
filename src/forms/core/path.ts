const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

export const cloneValue = <T>(value: T): T => {
	if (Array.isArray(value)) {
		return value.map((item) => cloneValue(item)) as T;
	}

	if (isRecord(value)) {
		return Object.fromEntries(
			Object.entries(value).map(([key, nestedValue]) => [key, cloneValue(nestedValue)]),
		) as T;
	}

	return value;
};

export const normalizePath = (path: string): string[] => path.split('.').filter(Boolean);

export const getByPath = (source: unknown, path: string): unknown => {
	return normalizePath(path).reduce<unknown>((currentValue, key) => {
		if (Array.isArray(currentValue)) {
			return currentValue[Number(key)];
		}

		if (isRecord(currentValue)) {
			return currentValue[key];
		}

		return undefined;
	}, source);
};

export const hasByPath = (source: unknown, path: string): boolean => getByPath(source, path) !== undefined;

export const setByPath = <T>(source: T, path: string, value: unknown): T => {
	const nextValue = cloneValue(source);
	const keys = normalizePath(path);

	if (keys.length === 0) {
		return value as T;
	}

	let cursor: unknown = nextValue;

	for (const [index, key] of keys.entries()) {
		const isLast = index === keys.length - 1;
		const nextKey = keys[index + 1];
		const nextContainer = /^\d+$/.test(nextKey ?? '') ? [] : {};

		if (Array.isArray(cursor)) {
			const listIndex = Number(key);
			cursor[listIndex] = isLast ? value : (cursor[listIndex] ?? nextContainer);
			cursor = cursor[listIndex];
			continue;
		}

		if (isRecord(cursor)) {
			cursor[key] = isLast ? value : (cursor[key] ?? nextContainer);
			cursor = cursor[key];
		}
	}

	return nextValue;
};

export const deleteByPath = <T>(source: T, path: string): T => {
	const nextValue = cloneValue(source);
	const keys = normalizePath(path);

	if (keys.length === 0) {
		return nextValue;
	}

	let cursor: unknown = nextValue;

	for (const [index, key] of keys.entries()) {
		const isLast = index === keys.length - 1;

		if (Array.isArray(cursor)) {
			const listIndex = Number(key);

			if (isLast) {
				cursor.splice(listIndex, 1);
				break;
			}

			cursor = cursor[listIndex];
			continue;
		}

		if (!isRecord(cursor)) {
			break;
		}

		if (isLast) {
			delete cursor[key];
			break;
		}

		cursor = cursor[key];
	}

	return nextValue;
};

export const isEqualValue = (left: unknown, right: unknown): boolean => {
	if (Object.is(left, right)) {
		return true;
	}

	if (Array.isArray(left) && Array.isArray(right) && left.length === right.length) {
		return left.every((item, index) => isEqualValue(item, right[index]));
	}

	if (isRecord(left) && isRecord(right)) {
		const leftKeys = Object.keys(left);
		const rightKeys = Object.keys(right);

		return leftKeys.length === rightKeys.length
			&& leftKeys.every((key) => isEqualValue(left[key], right[key]));
	}

	return false;
};

export const isRelatedPath = (left: string, right: string): boolean => {
	return left === right || left.startsWith(`${right}.`) || right.startsWith(`${left}.`);
};
