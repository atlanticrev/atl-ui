import type { AltIconName } from '../../icons';

import type { AltAlertSeverity, AltAlertVariant } from './types';

const severities: readonly AltAlertSeverity[] = ['error', 'info', 'success', 'warning'];
const variants: readonly AltAlertVariant[] = ['filled', 'outlined', 'standard'];
const severityIcons: Record<AltAlertSeverity, AltIconName> = {
	error: 'error',
	info: 'info',
	success: 'check',
	warning: 'warning',
};

export const normalizeAlertSeverity = (value: string | null, fallback: AltAlertSeverity): AltAlertSeverity => {
	return severities.includes(value as AltAlertSeverity) ? (value as AltAlertSeverity) : fallback;
};

export const normalizeAlertVariant = (value: string | null): AltAlertVariant => {
	return variants.includes(value as AltAlertVariant) ? (value as AltAlertVariant) : 'standard';
};

export const getAlertDefaultIcon = (severity: AltAlertSeverity): AltIconName => severityIcons[severity];
