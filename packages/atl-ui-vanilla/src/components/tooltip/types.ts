export type AltTooltipPlacement = 'bottom' | 'left' | 'right' | 'top';
export type AltTooltipTrigger = 'click' | 'hover';

export type AltTooltipOpenChangeDetail = {
	open: boolean;
};

export type AltTooltipElementApi = HTMLElement & {
	content: Node | null;
	open: boolean;
	placement: AltTooltipPlacement;
	text: string;
	trigger: AltTooltipTrigger;
};
