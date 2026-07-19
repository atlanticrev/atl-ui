import { createTypedEvent } from '../../core';

import type { ToastRecord } from './toast-model';
import type { AltToastDismissDetail, AltToastDismissReason } from './types';

export const dispatchToastDismissed = (host: HTMLElement, record: ToastRecord, reason: AltToastDismissReason): void => {
	host.dispatchEvent(
		createTypedEvent<AltToastDismissDetail>('alt-dismiss', {
			id: record.id,
			reason,
			status: record.status,
		}),
	);
};
