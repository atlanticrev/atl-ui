import type { SVGProps } from 'react';

export type SearchIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const SearchIcon = ({ size = 20, ...props }: SearchIconProps): JSX.Element => {
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
				cx="9"
				cy="9"
				r="5.75"
				stroke="currentColor"
				strokeWidth="1.5"
			/>

			<path
				d="M13.5 13.5L17 17"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
