import {
	INPUT_LABEL_GAP_OFFSET,
	INPUT_LABEL_GAP_PADDING,
	buildInputOutlinePath,
	type InputOutlineMetrics,
} from './input-outline.utils';

type AtlInputOutlineProps = {
	labelWidth: number;
	metrics: InputOutlineMetrics;
	strokeWidth: number;
};

export const AtlInputOutline = ({
	labelWidth,
	metrics,
	strokeWidth,
}: AtlInputOutlineProps) => {
	if (!metrics.width || !metrics.height) {
		return null;
	}

	const path = buildInputOutlinePath({
		height: metrics.height,
		notchStart: INPUT_LABEL_GAP_OFFSET,
		notchWidth: labelWidth > 0 ? labelWidth + INPUT_LABEL_GAP_PADDING : 0,
		radius: metrics.radius,
		strokeWidth,
		width: metrics.width,
	});

	return (
		<svg
			aria-hidden="true"
			className="atl-input__outline"
			focusable="false"
			height={metrics.height}
			viewBox={`0 0 ${metrics.width} ${metrics.height}`}
			width={metrics.width}
		>
			<path className="atl-input__outline-path" d={path} />
		</svg>
	);
};
