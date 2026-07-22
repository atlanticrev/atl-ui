export type MicrotaskScheduler = (callback: () => void) => void;

const scheduleMicrotask: MicrotaskScheduler = (callback) => {
	globalThis.queueMicrotask(callback);
};

export const createMicrotaskBatch = (
	callback: () => void,
	scheduler: MicrotaskScheduler = scheduleMicrotask,
): (() => void) => {
	let isPending = false;

	return () => {
		if (isPending) {
			return;
		}

		isPending = true;

		scheduler(() => {
			isPending = false;

			callback();
		});
	};
};
