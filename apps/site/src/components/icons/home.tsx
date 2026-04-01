import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase(props: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		/>
	);
}

export function CodeIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="m16 18 6-6-6-6" />
			<path d="m8 6-6 6 6 6" />
		</IconBase>
	);
}

export function LayoutIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M9 3v18" />
			<path d="M9 9h12" />
		</IconBase>
	);
}

export function ZapIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="M13 2 3 14h7l-1 8 10-12h-7z" />
		</IconBase>
	);
}
