import type { SVGProps } from 'react';

type HomeLineIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const HomeLineIcon = ({ size = 20, ...props }: HomeLineIconProps): JSX.Element => {
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
				d={`
					M3.75 8.52L9.14 4.23C9.65 3.82 10.35 3.82 10.86 4.23L16.25 8.52V14.5C16.25 15.33 15.58 16
					14.75 16H5.25C4.42 16 3.75 15.33 3.75 14.5V8.52Z
				`}
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
			<path
				d="M7.5 16V11.25H12.5V16"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
