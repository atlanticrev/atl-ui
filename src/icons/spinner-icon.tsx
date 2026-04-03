export type SpinnerIconProps = {
	size?: number;
};

export const SpinnerIcon = ({ size = 16 }: SpinnerIconProps): JSX.Element => {
	return (
		<svg
			aria-hidden="true"
			className="atl-spinner-icon"
			focusable="false"
			fill="none"
			height={size}
			viewBox="0 0 16 16"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="8"
				cy="8"
				opacity="0.2"
				r="6"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<path
				d="M14 8a6 6 0 0 0-6-6"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="2"
			/>
		</svg>
	);
};
