import type { SVGProps } from 'react';

type CreditCardIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const CreditCardIcon = ({ size = 20, ...props }: CreditCardIconProps): JSX.Element => {
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
				height="11"
				rx="2"
				stroke="currentColor"
				strokeWidth="1.5"
				width="14.5"
				x="2.75"
				y="4.5"
			/>

			<path
				d="M2.75 8H17.25"
				stroke="currentColor"
				strokeWidth="1.5"
			/>

			<path
				d="M6 12H8.75"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
