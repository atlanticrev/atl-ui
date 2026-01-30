type ProgressProps = {
	label: string;
	value: number;
};

export function Progress({ label, value }: ProgressProps) {
	const clampedValue = Math.min(100, Math.max(0, value));

	return (
		<div className="ui-progress">
			<span className="ui-progress__label">{label}</span>

			<div className="ui-progress__track">
				<span
					className="ui-progress__fill"
					style={{ width: `${clampedValue}%` }}
				/>
			</div>
		</div>
	);
}
