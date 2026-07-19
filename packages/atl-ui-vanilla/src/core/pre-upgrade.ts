export const upgradeProperty = (target: object, propertyName: PropertyKey): boolean => {
	if (!Object.hasOwn(target, propertyName)) {
		return false;
	}

	const propertyValue = Reflect.get(target, propertyName);

	if (!Reflect.deleteProperty(target, propertyName)) {
		return false;
	}

	return Reflect.set(target, propertyName, propertyValue);
};

export const upgradeProperties = (target: object, propertyNames: readonly PropertyKey[]): void => {
	for (const propertyName of propertyNames) {
		upgradeProperty(target, propertyName);
	}
};
