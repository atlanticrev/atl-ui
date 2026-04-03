import type { SVGProps } from 'react';

type UsersPlusIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const UsersPlusIcon = ({ size = 20, ...props }: UsersPlusIconProps): JSX.Element => {
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
				d="M7.5 9C8.88 9 10 7.88 10 6.5C10 5.12 8.88 4 7.5 4C6.12 4 5 5.12 5 6.5C5 7.88 6.12 9 7.5 9Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M3.75 14.75C3.75 12.96 5.54 11.5 7.75 11.5C9.96 11.5 11.75 12.96 11.75 14.75"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M14.25 6V10"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M12.25 8H16.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
