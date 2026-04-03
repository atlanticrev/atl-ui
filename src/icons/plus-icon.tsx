import type { SVGProps } from 'react';

type PlusIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const PlusIcon = ({ size = 20, ...props }: PlusIconProps): JSX.Element => {
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
			<path
				d="M10 4.5V15.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M4.5 10H15.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
