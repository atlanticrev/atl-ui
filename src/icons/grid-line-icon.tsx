import type { SVGProps } from 'react';

type GridLineIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const GridLineIcon = ({ size = 20, ...props }: GridLineIconProps): JSX.Element => {
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
			<rect
				height="5.5"
				rx="1.25"
				stroke="currentColor"
				strokeWidth="1.5"
				width="5.5"
				x="3.25"
				y="3.25"
			/>
			<rect
				height="5.5"
				rx="1.25"
				stroke="currentColor"
				strokeWidth="1.5"
				width="5.5"
				x="11.25"
				y="3.25"
			/>
			<rect
				height="5.5"
				rx="1.25"
				stroke="currentColor"
				strokeWidth="1.5"
				width="5.5"
				x="3.25"
				y="11.25"
			/>
			<rect
				height="5.5"
				rx="1.25"
				stroke="currentColor"
				strokeWidth="1.5"
				width="5.5"
				x="11.25"
				y="11.25"
			/>
		</svg>
	);
};
