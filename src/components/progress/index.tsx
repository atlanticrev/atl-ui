type ProgressProps = {
	label: string;
	value: number;
};

export function AtlProgress({ label, value }: ProgressProps) {
	const clampedValue = Math.min(100, Math.max(0, value));

	return (
		<div className="atl-progress">
			<span className="atl-progress__label">{label}</span>

			<div className="atl-progress__track">
				<span
					className="atl-progress__fill"
					style={{ width: `${clampedValue}%` }}
				/>
			</div>
		</div>
	);
}
