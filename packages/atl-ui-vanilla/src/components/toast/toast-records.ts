import type { ToastPhase, ToastRecord } from './toast-model';
import type { AltToastDismissReason } from './types';

type CloseRecord = (record: ToastRecord, reason: AltToastDismissReason) => boolean;

export const requestToastClose = (record: ToastRecord, reason: AltToastDismissReason): boolean => {
	if (record.closeReason) return false;

	record.closeReason = reason;

	record.timer.cancel();

	if (record.phase === 'open') record.phase = 'closing';

	return true;
};

export const advanceToastPhase = (record: ToastRecord, phase: ToastPhase): 'changed' | 'remove' | 'stale' => {
	if (record.phase !== phase) return 'stale';

	if (phase === 'entering') {
		record.phase = record.closeReason ? 'closing' : 'open';

		if (!record.closeReason) record.timer.resume('lifecycle');

		return 'changed';
	}

	if (phase === 'closing') {
		record.phase = 'collapsing';

		return 'changed';
	}

	return phase === 'collapsing' ? 'remove' : 'stale';
};

export const reconcileToastCapacity = (records: ToastRecord[], max: number, closeRecord: CloseRecord): boolean => {
	let changed = false;

	let visibleCount = records.filter((record) => record.phase !== 'queued').length;

	for (const record of records) {
		if (record.phase !== 'queued' || visibleCount >= max) continue;

		record.phase = 'entering';

		visibleCount += 1;

		changed = true;
	}

	const hasQueue = records.some((record) => record.phase === 'queued');

	const mustClose = visibleCount > max || (hasQueue && visibleCount >= max);

	const closePending = records.some((record) => record.phase !== 'queued' && record.closeReason);

	if (!mustClose || closePending) return changed;

	const visible = records.filter((record) => record.phase !== 'queued');

	const candidate = visible.find((record) => !record.persist) ?? visible[0];

	return candidate ? closeRecord(candidate, 'overflow') || changed : changed;
};
