import type { SVGProps } from 'react';

type DotsVerticalIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const DotsVerticalIcon = ({ size = 20, ...props }: DotsVerticalIconProps): JSX.Element => {
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			fill="none"
			height={size}
			viewBox="0 0 20 20"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle
				cx="10"
				cy="5.25"
				fill="currentColor"
				r="1.1"
			/>
			<circle
				cx="10"
				cy="10"
				fill="currentColor"
				r="1.1"
			/>
			<circle
				cx="10"
				cy="14.75"
				fill="currentColor"
				r="1.1"
			/>
		</svg>
	);
};
