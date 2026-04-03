import type { SVGProps } from 'react';

type SettingsLineIconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export const SettingsLineIcon = ({ size = 20, ...props }: SettingsLineIconProps): JSX.Element => {
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
					M10 12.25C11.24 12.25 12.25 11.24 12.25 10C12.25 8.76 11.24 7.75 10 7.75C8.76 7.75 7.75
					8.76 7.75 10C7.75 11.24 8.76 12.25 10 12.25Z
				`}
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<path
				d="M10 4.5V3.75"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M10 16.25V15.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M15.5 10H16.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M3.75 10H4.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M13.89 6.11L14.42 5.58"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M5.58 14.42L6.11 13.89"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M13.89 13.89L14.42 14.42"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
			<path
				d="M5.58 5.58L6.11 6.11"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
};
