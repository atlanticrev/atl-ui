const OVERFLOW_TARGET_SELECTOR = '[data-alt-overflow-target]';

export const isTooltipTriggerOverflowing = (trigger: HTMLElement): boolean => {
	const target = trigger.querySelector<HTMLElement>(OVERFLOW_TARGET_SELECTOR) ?? trigger;
	return target.scrollWidth > target.clientWidth || target.scrollHeight > target.clientHeight;
};
