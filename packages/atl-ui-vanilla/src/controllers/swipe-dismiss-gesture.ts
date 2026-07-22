export const SWIPE_ACTIVATION_PX = 12;
export const SWIPE_FLING_VELOCITY = 700;
export const SWIPE_SNAP_DURATION = 250;

const FAST_SNAP_MAX_DURATION = 200;
const FAST_SNAP_MIN_DURATION = 50;

export type SwipeDismissPlacement = 'bottom' | 'left' | 'right' | 'top';

export type SwipeDismissMotion = {
	progress: number;
	velocityX: number;
	velocityY: number;
};

const clamp = (value: number, minimum: number, maximum: number): number => {
	return Math.min(Math.max(value, minimum), maximum);
};

export const getClosingDistance = (placement: SwipeDismissPlacement, distanceX: number, distanceY: number): number => {
	if (placement === 'left') return -distanceX;

	if (placement === 'right') return distanceX;

	if (placement === 'top') return -distanceY;

	return distanceY;
};

export const getClosingVelocity = (placement: SwipeDismissPlacement, velocityX: number, velocityY: number): number => {
	return getClosingDistance(placement, velocityX, velocityY);
};

export const isSwipeDismissGesture = (
	placement: SwipeDismissPlacement,
	distanceX: number,
	distanceY: number,
): boolean => {
	const primary = getClosingDistance(placement, distanceX, distanceY);

	const cross = placement === 'left' || placement === 'right' ? Math.abs(distanceY) : Math.abs(distanceX);

	return primary >= SWIPE_ACTIVATION_PX && primary >= cross;
};

export const getSwipeProgress = (closingOffset: number, size: number): number => {
	if (size <= 0) return 1;

	return clamp(1 - closingOffset / size, 0, 1);
};

export const isSwipeFling = (placement: SwipeDismissPlacement, motion: SwipeDismissMotion): boolean => {
	const primary = getClosingVelocity(placement, motion.velocityX, motion.velocityY);

	const cross = placement === 'left' || placement === 'right' ? motion.velocityY : motion.velocityX;

	return Math.abs(primary) >= SWIPE_FLING_VELOCITY && Math.abs(primary) > Math.abs(cross);
};

export const shouldDismissSwipe = (placement: SwipeDismissPlacement, motion: SwipeDismissMotion): boolean => {
	if (isSwipeFling(placement, motion)) {
		return getClosingVelocity(placement, motion.velocityX, motion.velocityY) > 0;
	}

	return motion.progress < 0.5;
};

export const getSwipeSnapDuration = (progress: number, dismiss: boolean, fling: boolean): number => {
	if (!fling) return SWIPE_SNAP_DURATION;

	const remainingDistance = dismiss ? progress : 1 - progress;

	return Math.max(Math.round(FAST_SNAP_MAX_DURATION * remainingDistance), FAST_SNAP_MIN_DURATION);
};
