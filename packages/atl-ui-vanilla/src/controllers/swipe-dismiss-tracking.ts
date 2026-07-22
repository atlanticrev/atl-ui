export type SwipeTracking = {
	closingOffset: number;
	dragging: boolean;
	lastTime: number;
	lastX: number;
	lastY: number;
	startTarget: EventTarget | null;
	startX: number;
	startY: number;
	velocityX: number;
	velocityY: number;
};

const VELOCITY_SMOOTHING = 0.35;

export const createSwipeTracking = (event: TouchEvent): SwipeTracking => {
	const touch = event.touches[0];

	return {
		closingOffset: 0,
		dragging: false,
		lastTime: event.timeStamp,
		lastX: touch.clientX,
		lastY: touch.clientY,
		startTarget: event.target,
		startX: touch.clientX,
		startY: touch.clientY,
		velocityX: 0,
		velocityY: 0,
	};
};

export const updateSwipeVelocity = (tracking: SwipeTracking, touch: Touch, time: number): void => {
	const elapsedSeconds = Math.max(time - tracking.lastTime, 1) / 1_000;

	const velocityX = (touch.clientX - tracking.lastX) / elapsedSeconds;

	const velocityY = (touch.clientY - tracking.lastY) / elapsedSeconds;

	tracking.velocityX = tracking.velocityX * VELOCITY_SMOOTHING + velocityX * (1 - VELOCITY_SMOOTHING);

	tracking.velocityY = tracking.velocityY * VELOCITY_SMOOTHING + velocityY * (1 - VELOCITY_SMOOTHING);

	tracking.lastTime = time;

	tracking.lastX = touch.clientX;

	tracking.lastY = touch.clientY;
};
