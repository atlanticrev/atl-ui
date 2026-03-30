import { buildInputOutlinePath, type InputOutlineMetrics } from './input-outline.utils';

type AtlInputOutlineProps = {
	labelOffset: number;
	labelWidth: number;
	metrics: InputOutlineMetrics;
	strokeWidth: number;
};

export const AtlInputOutline = ({ labelOffset, labelWidth, metrics, strokeWidth }: AtlInputOutlineProps) => {
	if (!metrics.width || !metrics.height) {
		return null;
	}

	const path = buildInputOutlinePath({
		height: metrics.height,
		notchStart: labelWidth > 0 ? labelOffset : 0,
		notchWidth: labelWidth,
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
			<path
				className="atl-input__outline-path"
				d={path}
			/>
		</svg>
	);
};
