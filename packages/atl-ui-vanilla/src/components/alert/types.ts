import type { AltReplaceableIcon } from '../../icons';

export type AltAlertSeverity = 'error' | 'info' | 'success' | 'warning';

export type AltAlertVariant = 'filled' | 'outlined' | 'standard';

export type AltAlertCloseReason = 'close-button' | 'programmatic';

export type AltAlertCloseDetail = {
	reason: AltAlertCloseReason;
	sourceEvent?: Event;
};

export type AltAlertIconMapping = Partial<Record<AltAlertSeverity, AltReplaceableIcon>>;

export type AltAlertElementApi = HTMLElement & {
	action: Node | null | undefined;
	readonly actionElement: HTMLElement | null;
	close: (reason?: AltAlertCloseReason, sourceEvent?: Event) => boolean;
	closeIcon: AltReplaceableIcon;
	color: AltAlertSeverity;
	dismissible: boolean;
	icon: AltReplaceableIcon;
	iconMapping: AltAlertIconMapping | null;
	readonly messageElement: HTMLElement | null;
	severity: AltAlertSeverity;
	show: () => void;
	variant: AltAlertVariant;
};
