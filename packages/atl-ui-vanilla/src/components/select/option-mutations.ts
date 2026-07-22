const OWNED_OPTION_PART_SELECTOR = '[data-alt-owned="option-view"]';

const mutationTarget = (record: MutationRecord): Element | null => {
	return record.target.nodeType === Node.ELEMENT_NODE ? (record.target as Element) : record.target.parentElement;
};

const isOwnedOptionPart = (node: Node): boolean => {
	return node.nodeType === Node.ELEMENT_NODE && (node as Element).matches(OWNED_OPTION_PART_SELECTOR);
};

const isOwnedOptionMutation = (record: MutationRecord, target: Element | null): boolean => {
	if (target?.closest(OWNED_OPTION_PART_SELECTOR)) return true;

	if (record.type !== 'childList' || target?.localName !== 'alt-option') return false;

	const changedNodes = [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)];

	return changedNodes.length > 0 && changedNodes.every(isOwnedOptionPart);
};

export const isOptionSourceMutation = (record: MutationRecord): boolean => {
	const target = mutationTarget(record);

	if (isOwnedOptionMutation(record, target)) return false;

	if (target?.closest('alt-option')) return true;

	return [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)].some(
		(node) => node.nodeType === Node.ELEMENT_NODE && (node as Element).localName === 'alt-option',
	);
};
